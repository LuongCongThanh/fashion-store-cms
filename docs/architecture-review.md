# Phân tích kiến trúc & hướng dẫn triển khai — Scaffold Fashion Store CMS

> Tài liệu này giải thích **vì sao** `scaffold-plan.md` được sửa (D37–D41, D25, D34, D38) và **làm thế nào** triển khai từng phần, theo từng bước. Nguồn chuẩn về convention vẫn là [`scaffold-plan.md`](./scaffold-plan.md); khi hai tài liệu lệch nhau thì theo plan.
>
> Ngày review: 2026-11-07. Phạm vi: cấu trúc module **dự kiến** (repo chưa có code).

## Mục lục

0. [Từ vựng dùng trong tài liệu](#0-từ-vựng)
1. [Composition root + Session (D37, D34)](#1-composition-root--session)
2. [i18n: instance sở hữu locale (D25)](#2-i18n-instance-sở-hữu-locale)
3. [Navigation module (D38)](#3-navigation-module)
4. [Error policy (D39)](#4-error-policy)
5. [HttpClient một file, refresh qua `skipAuth` (D40)](#5-httpclient-một-file)
6. [Bảng ranh giới import + test tự động (D41)](#6-bảng-ranh-giới-import)
7. [Thứ tự triển khai tổng thể](#7-thứ-tự-triển-khai-tổng-thể)

---

## 0. Từ vựng

| Từ | Nghĩa trong tài liệu này |
|---|---|
| **Module** | Một đơn vị code có interface và phần cài đặt bên trong (một file hoặc một thư mục). |
| **Interface** | Những gì người gọi phải biết để dùng module: tên hàm, tham số, kiểu trả về, lỗi, thứ tự gọi. |
| **Module sâu (deep)** | Interface nhỏ, phần cài đặt bên trong lớn → người gọi biết ít mà được nhiều. Mục tiêu của review. |
| **Module nông (shallow)** | Interface gần phức tạp bằng phần cài đặt → chỉ chuyển độ phức tạp đi chỗ khác. |
| **Seam** | Chỗ có thể thay hành vi mà không sửa code gọi (VD thay transport thật bằng mock). |
| **Adapter** | Một bản cài đặt cụ thể tại một seam. Một adapter = seam giả định; hai adapter (prod + test) = seam thật. |
| **Locality** | Muốn hiểu / sửa một khái niệm thì chỉ cần mở một chỗ. |
| **Leverage** | Một thay đổi nhỏ ở interface đem lại lợi ích cho nhiều nơi gọi. |
| **Deletion test** | Nếu xoá module này, độ phức tạp **tập trung lại** (module có giá trị) hay chỉ **dời đi** (module nông)? |
| **Session** | Ai đang đăng nhập (token), đang quản lý Store nào, và hệ quả khi chúng đổi. Không phải "thông tin user". |
| **App runtime** | Toàn bộ object dựng một lần cho app (pinia, i18n, router, notifier, Session, HttpClient, QueryClient). |
| **Store** | Cửa hàng người dùng CMS đang quản lý — không nhầm với Pinia store. |

---

## 1. Composition root + Session

### 1.1. Vấn đề trong plan cũ

- `main.ts` tự nối dây theo "thứ tự cố định", và **bị loại khỏi coverage** → wiring prod không có test.
- `src/test/Render.ts` tự ráp lại plugin theo cách khác → test có thể pass trong khi app thật hỏng.
- "Token + Store hiện tại + xoá cache khi đổi" bị chia ở 5 nơi: `HttpClientDeps` (7 tham số, 5 callback), `createAuthAdapter`, `createStoreScopeAdapter`, `switchStore` gọi `queryClient.clear()`, `logout` cũng gọi `queryClient.clear()`, `onAuthFailure` nằm trong `main.ts`.

```text
TRƯỚC                                        SAU
main.ts ── ráp tay ──┐                       main.ts ──┐
                     ├─► HttpClient (7 deps) Render.ts ┴─► createAppRuntime(overrides)
Render.ts ─ ráp khác ┘                                        ├─► Session (token, storeId, cache)
auth adapter ─┐                                               └─► HttpClient { baseURL, session, getLocale }
StoreScope adapter ┴─► queryClient.clear() ×2
```

### 1.2. Quyết định

- **D37** — `createAppRuntime(overrides)` trong `src/app/Runtime.ts` là nơi duy nhất tạo và nối object dùng chung. `main.ts` và `Render.ts` gọi cùng hàm.
- **D34** — `Session` trong `src/shared/lib/session/` sở hữu token, storeId, refresh, xoá cache, sự kiện `authFailure` / `loggedOut`. HttpClient chỉ nhận `{ baseURL, session, getLocale }`.
- Session ở `shared/lib` (không ở `features/auth`) vì cả auth và StoreScope dùng, và feature không được import lẫn nhau.
- Session có Pinia store riêng `useSessionStore` (chỉ token + storeId). Thông tin user vẫn ở `features/auth`, danh sách Store vẫn ở `features/StoreScope`.

### 1.3. File và hàm

| File | Hàm / export | Làm gì |
|---|---|---|
| `src/app/Runtime.ts` | `createAppRuntime(overrides?)` | Tạo pinia, i18n, router, notifier, queryClient, Session, HttpClient; nối sự kiện Session → router; trả `{ plugin, router, session, http, queryClient, notifier }`. |
| | `RuntimeOverrides` | Những thứ test được thay: `transport`, `notifier`, `router`, `session` (trạng thái ban đầu), `retry`. |
| `src/app/Runtime.spec.ts` | — | Test wiring prod: request có token + `X-Store-Id` + `Accept-Language`; `authFailure` → về `auth.login`. |
| `src/shared/lib/session/Session.ts` | `createSession(deps)` | Tạo Session từ `pinia`, `queryClient`, `callRefresh`, `initial?`. |
| | `Session.getAccessToken()` | Token để gắn `Authorization`; null = chưa đăng nhập. |
| | `Session.getStoreId()` | Store hiện tại để gắn `X-Store-Id`. |
| | `Session.refresh()` | Lấy token mới; nhiều lời gọi đồng thời dùng chung một promise; thất bại → phát `authFailure`, trả null. |
| | `Session.signIn(tokens)` | Lưu token sau login. |
| | `Session.logout()` | Xoá token + `queryClient.clear()` + phát `loggedOut`. |
| | `Session.switchStore(id)` | Persist storeId + `queryClient.clear()`. |
| | `Session.on(event, fn)` | Nghe `authFailure` / `loggedOut`; trả hàm huỷ. |
| | `useSession()`, `SESSION_KEY` | Lấy Session trong composable (inject). Chỉ auth / StoreScope nên gọi. |
| `src/shared/lib/session/Session.store.ts` | `useSessionStore` | Pinia store nội bộ (token, refreshToken, storeId) có persist. Không ai ngoài `session/` import. |
| `src/shared/lib/session/Session.spec.ts` | — | signIn/logout, `switchStore` xoá cache, refresh đồng thời chỉ gọi 1 lần, refresh thất bại phát `authFailure`. |
| `src/features/auth/UseAuth.ts` | `useAuth()` | `login()` gọi API rồi `session.signIn()`; `logout()` = `session.logout()`; `can()` tính từ `user.permissions`. |
| `src/features/StoreScope/UseStoreScope.ts` | `useStoreScope()` | `{ storeId, stores, switchStore }`; `switchStore` ủy quyền cho Session. |
| `src/main.ts` | — | Một dòng: `createApp(App).use(createAppRuntime().plugin).mount('#app')`. |
| `src/test/Render.ts` | `renderWithPlugins(component, options)` | Gọi `createAppRuntime()` với transport mock + notifier giả + session đã đăng nhập; mount; trả `{ wrapper, http, notifier, runtime }`. |

### 1.4. Các bước triển khai

1. **Tạo `Session.store.ts`** — Pinia store với state `{ accessToken, refreshToken, storeId }`, persist bằng `useLocalStorage` (key `cms.session`).
2. **Tạo `Session.ts`** theo interface ở §M.2 plan:
   - Giữ một biến `pendingRefresh: Promise | null` để gom refresh đồng thời.
   - Event emitter tối giản (`Map<event, Set<fn>>`) cho `on()`.
   - `logout` và `switchStore` gọi `queryClient.clear()` — **không chỗ nào khác được gọi**.
3. **Viết `Session.spec.ts`** trước khi nối vào app (dùng `createPinia()` thật + `new QueryClient()` + `callRefresh` giả).
4. **Tạo `Runtime.ts`**: thứ tự tạo `pinia → i18n → router → notifier → queryClient → session → http`. Session nhận `callRefresh` dạng lazy (`let http!: HttpClient`) để tránh vòng phụ thuộc.
5. **Nối sự kiện**: `session.on('authFailure' | 'loggedOut', () => router.push({ name: 'auth.login' }))`.
6. **Sửa `main.ts`** còn một dòng.
7. **Sửa `Render.ts`** gọi `createAppRuntime()`; xoá mọi chỗ tự ráp plugin.
8. **Viết `Runtime.spec.ts`**.
9. **Bọc Session trong `useAuth()` và `useStoreScope()`** (Step 4).

### 1.5. Cách test & lỗi cần tránh

- ✅ Test wiring qua `Runtime.spec.ts`, test hành vi Session qua `Session.spec.ts`.
- ❌ Không gọi `queryClient.clear()` ở feature.
- ❌ Không import `useSessionStore` ngoài `session/`.
- ❌ Không tạo pinia / QueryClient / i18n riêng trong test — luôn qua `renderWithPlugins()`.

---

## 2. i18n: instance sở hữu locale

### 2.1. Vấn đề trong plan cũ (bug thật)

`I18n.ts` export singleton `i18n = createAppI18n()` và `useLocale()` chỉ cập nhật singleton đó (qua `watchEffect` chạy **lúc import**). Nhưng `main.ts` lại gọi `createAppI18n()` lần nữa → app dùng **instance thứ hai**.

Hậu quả: bấm đổi ngôn ngữ → `<html lang>` và localStorage đổi, nhưng **chữ trên UI không đổi**, header `Accept-Language` vẫn gửi ngôn ngữ cũ.

```text
TRƯỚC                                   SAU
useLocale ─► singleton #1 ◄─ watchEffect  main/Render ─► createAppRuntime ─► createAppI18n() (1 instance)
main.ts   ─► instance #2 ◄─ App, Http                     useLocale ─inject─┘   Http.getLocale ─┘
```

### 2.2. Quyết định (D25)

- `createAppI18n()` trả **plugin**; khi `app.use()` mới đọc/ghi localStorage, đặt `<html lang>`, provide state.
- `useLocale()` **inject** instance — không đọc biến module.
- Không export singleton, không side effect lúc import.
- Code ngoài setup (HttpClient) nhận `getLocale` do runtime truyền.

### 2.3. File và hàm

| File | Hàm | Làm gì |
|---|---|---|
| `src/shared/lib/i18n/I18n.ts` | `createAppI18n({ storageKey? })` | Tạo vue-i18n + ref locale; trả `{ install, getLocale }`. |
| | `.install(app)` | Đọc `cms.locale`, `watchEffect` đồng bộ vue-i18n + `<html lang>` + localStorage, `app.use(i18n)`, provide `LOCALE_KEY`. |
| | `.getLocale()` | Locale hiện tại — runtime truyền cho HttpClient. |
| | `useLocale()` | `{ locale, uiLocale, setLocale }` — đọc instance đã provide; ném lỗi rõ ràng nếu chưa `app.use`. |
| `src/App.vue` | — | `<UApp :locale="uiLocale">` từ `useLocale()`. |

### 2.4. Các bước

1. Viết lại `I18n.ts` theo §H plan (code mẫu có sẵn).
2. Xoá mọi import `i18n` singleton (grep `from '@shared/lib/i18n/I18n'` chỉ còn `createAppI18n`, `useLocale`, type).
3. Trong `Runtime.ts`: `getLocale: i18n.getLocale`.
4. Spec (qua `renderWithPlugins()`): `setLocale('en')` → text UI đổi, `<html lang="en">`, localStorage = `en`, request kế tiếp có `Accept-Language: en`.

---

## 3. Navigation module

### 3.1. Vấn đề

Cùng một khái niệm "người dùng được đi đâu / bấm gì" được suy ra riêng ở `Guards.ts`, `Router.ts` (title), `AppSidebar`, `CommandPalette`, `Shortcuts.ts`, `ShortcutsHelpModal` → thêm một route phải kiểm 5–6 chỗ. Palette + phím tắt được dựng ở Foundation khi chỉ có route auth (không có gì để hiển thị).

### 3.2. Quyết định (D38)

- `src/layouts/Navigation.ts` là **nơi duy nhất** đọc route meta cho sidebar, palette, phím tắt, title.
- Ở `layouts/` vì cần `useAuth().can` (shared không được import features).
- Palette, phím tắt, bảng phím tắt **hoãn tới P5**.

### 3.3. File và hàm

| File | Hàm | Làm gì |
|---|---|---|
| `src/layouts/Navigation.ts` | `buildNavigation(routes, can)` | **Hàm thuần**: lọc route theo `meta.permission` + `can`, trả `{ sidebar, commands, shortcuts, titleOf }`. |
| | `useNavigation()` | Bọc reactive: lấy `router.getRoutes()` + `useAuth().can`, gọi `buildNavigation`. |
| `src/layouts/Navigation.spec.ts` | — | Test thuần, không mount: route thiếu quyền bị lọc; title đúng key; commands/shortcuts sinh từ `meta.command`. |
| `src/app/router/RouteMeta.d.ts` | `RouteMeta` | `requiresAuth`, `permission`, `titleKey`, `command`. |
| `src/layouts/components/AppSidebar.vue` | — | Chỉ render `useNavigation().sidebar`. |
| `src/app/router/Router.ts` | — | Sau mỗi điều hướng: `document.title = titleOf(route)`. |
| *(P5)* `CommandPalette.vue`, `ShortcutsHelpModal.vue` | — | Render `commands` / `shortcuts`. |

### 3.4. Các bước

1. Khai báo `RouteMeta.d.ts`.
2. Viết `buildNavigation` + spec trước (TDD được vì là hàm thuần).
3. Viết `useNavigation()`.
4. `AppSidebar` dùng `useNavigation()`; `Router.ts` dùng `titleOf`.
5. Tới P5: thêm palette + phím tắt, chỉ render — không đọc `meta` trực tiếp.

---

## 4. Error policy

### 4.1. Vấn đề

Bảng §O.4 ("lỗi nào hiện ở đâu") là tài liệu, còn code bị rải ở `QueryClient.ts` (retry, MutationCache), `UseNotify.ts` (`messageOf` tra i18n), `ErrorHandling.ts`, `ApplyApiErrorToForm.ts` → không có chỗ nào test được cả bảng.

### 4.2. Quyết định (D39)

- `src/shared/lib/api/errors/ErrorPolicy.ts` chứa **toàn bộ quy tắc**; các nơi khác là adapter mỏng.
- QueryClient chuyển từ `app/providers/` sang `src/shared/lib/query/`.
- `UseNotify` chỉ hiển thị; bỏ `messageOf` khỏi interface.

### 4.3. File và hàm

| File | Hàm | Làm gì |
|---|---|---|
| `ErrorPolicy.ts` | `isRetryable(e)` | true chỉ với `NETWORK_ERROR`, `TIMEOUT`, 5xx. |
| | `messageKeyOf(e, has)` | Key i18n: `errors.<code>` → `errors.<codeFromStatus>` → `errors.UNKNOWN`. `has` = `te` của vue-i18n. |
| | `isSilent(e)` | true khi request bị huỷ (Abort) → không toast. |
| | `routeMutationError(e, meta)` | `'local'` nếu `meta.errorHandling === 'local'`; `'form'` nếu 400/422 có `fields`; `'silent'` nếu huỷ; còn lại `'toast'`. |
| `ErrorPolicy.spec.ts` | — | Mỗi dòng bảng §O.4 một ca. |
| `src/shared/lib/query/QueryClient.ts` | `createAppQueryClient({ onMutationError, retry? })` | `retry` dùng `isRetryable`; `MutationCache.onError` → `routeMutationError === 'toast'` thì gọi `onMutationError`. |
| `src/shared/lib/query/VueQuery.d.ts` | — | Kiểu `mutationMeta.errorHandling`. |
| `src/shared/composables/UseNotify.ts` | `useNotify()`, `createNotifier()` | `success(key)`, `error(e)` = toast `t(messageKeyOf(e, te))`, bỏ qua nếu `isSilent`. |
| `src/shared/lib/form/ApplyApiErrorToForm.ts` | `applyApiErrorToForm(e, form)` | Gắn `fields` vào form; gọi khi policy trả `'form'`. |
| `src/app/providers/ErrorHandling.ts` | `installErrorHandling(app, { router, notifier })` | Chỉ glue Vue: `errorHandler`, `unhandledrejection`, `router.onError`. |

### 4.4. Các bước

1. Viết `ErrorPolicy.spec.ts` từ bảng §O.4 → viết `ErrorPolicy.ts` cho pass.
2. Chuyển `QueryClient.ts` + `VueQuery.d.ts` sang `shared/lib/query/`, thay logic bằng lời gọi ErrorPolicy.
3. Sửa `UseNotify` dùng `messageKeyOf`; xoá `messageOf`.
4. `ErrorHandling.ts` dùng `isSilent` + notifier.
5. Grep đảm bảo không còn chỗ nào tự kiểm `status === 5xx` hay tự tra `errors.*`.

---

## 5. HttpClient một file

### 5.1. Vấn đề

- Refresh token gọi bằng **axios trần thứ hai** → không có `Accept-Language`, lỗi không chuẩn hoá thành `ApiError`.
- `getDefaultPathParams` là seam cho câu trả lời BE "chờ xác nhận" — đã chiếm chỗ trong interface.
- `client/` tách 4 file + rule ESLint `noClientInternals` + hàm test riêng `createHttpClientWithAdapter` cho phần mà plan tự gọi là "vài dòng".

*(Upload S3 dùng `fetch` riêng là **đúng** — khác origin, không gắn token — nên giữ.)*

### 5.2. Quyết định (D40)

- `client/` chỉ còn `HttpClient.ts` + `HttpClient.spec.ts`; ba bước interceptor là hàm private.
- Test thay transport bằng `deps.transport` (qua `createAppRuntime({ transport })`).
- Refresh đi qua HttpClient với `{ skipAuth: true }`.
- Bỏ `getDefaultPathParams` tới khi BE chốt (phương án dự phòng ghi ở §M.3).

### 5.3. File và hàm

| File | Hàm | Làm gì |
|---|---|---|
| `src/shared/lib/api/client/HttpClient.ts` | `createHttpClient(deps)` | Tạo client từ `{ baseURL, session, getLocale, transport? }`. |
| | `get/post/put/patch/delete` | Trả thẳng `data`; lỗi luôn là `ApiError`; URL/body/kết quả có kiểu theo Swagger. |
| | `RequestOpts.skipAuth` | Không gắn token, không vào hàng đợi refresh — chỉ Session dùng. |
| | `useHttpClient()`, `HTTP_CLIENT_KEY` | Lấy client trong composable của `*.api.ts`. |
| | *(private)* `attachHeaders` | Gắn `Authorization`, `Accept-Language`, `X-Store-Id`. |
| | *(private)* `retryAfterRefresh` | 401 → chờ `session.refresh()` → gửi lại; null → ném lỗi. |
| | *(private)* `toApiError` | Mọi lỗi axios → `ApiError`; huỷ request thì ném nguyên lỗi huỷ. |
| `HttpClient.spec.ts` | — | Mọi ca §O.3 qua interface: N request 401 → 1 refresh; `skipAuth` không có token; mất mạng → `NETWORK_ERROR`; header đủ. |

### 5.4. Các bước

1. Viết `HttpClient.spec.ts` với `axios-mock-adapter` + `createSession({ initial, callRefresh })`.
2. Viết `HttpClient.ts`: tạo axios instance, đăng ký interceptor theo thứ tự `attachHeaders` → `retryAfterRefresh` → `toApiError`.
3. Thêm `skipAuth` vào `RequestOpts`.
4. Trong `Runtime.ts`, `callRefresh` dùng `http.post('/auth/refresh', …, { skipAuth: true })`.
5. Chỉ tách file khi > ~300 dòng **và** phần tách có spec riêng hữu ích.

---

## 6. Bảng ranh giới import

### 6.1. Vấn đề

10 block ESLint, mỗi block lặp lại toàn bộ pattern (do flat config thay chứ không gộp). Step 2 kiểm ~17 ca import **bằng tay** → sửa config sai không ai phát hiện.

### 6.2. Quyết định (D41)

- `no-restricted-imports` khai báo bằng **một bảng** `BOUNDARIES` + `toFlatConfig()`.
- `eslint.config.spec.ts` kiểm tự động mọi ca (thêm vào `include` của Vitest).
- **Giữ** Model độc lập DTO (§T.3) — đó là seam FE/BE có chủ đích. Feature tối thiểu = `api/` + `types/` + `views/`.

### 6.3. File và hàm

| File | Hàm | Làm gì |
|---|---|---|
| `eslint.config.ts` | `BOUNDARIES` | Bảng `{ name, files, forbid }` — đọc là biết thư mục nào cấm gì. |
| | `toFlatConfig(rows)` | Đổi bảng thành block flat config; không logic khác. |
| `eslint.config.spec.ts` | `isBlocked(from, importPath)` | `ESLint.lintText()` với `filePath` giả → có bị `no-restricted-imports` chặn không. |
| | `CASES` | `[file, import, chặn?]` — mỗi ca của Step 2 một dòng. |

### 6.4. Các bước

1. Viết các pattern (`featureBoundary`, `noApp`…) như §E plan.
2. Viết `BOUNDARIES` — dòng chung trước, dòng cụ thể sau.
3. Viết `eslint.config.spec.ts` với toàn bộ ca Step 2.
4. Thêm `eslint.config.spec.ts` vào `vitest.config.ts → include`.
5. Khi thêm rule: thêm 1 dòng vào `BOUNDARIES` + ít nhất 1 ca vào `CASES`.

---

## 7. Thứ tự triển khai tổng thể

Ánh xạ vào các Step có sẵn của plan:

| Step | Làm gì từ tài liệu này |
|---|---|
| Step 2 | §6: `BOUNDARIES`, `toFlatConfig`, `eslint.config.spec.ts` |
| Step 3a | §5: `HttpClient.ts` + spec; §1 bước 1–3: `Session` + spec; §1 bước 4–8: `Runtime.ts`, `main.ts`, `Render.ts`, `Runtime.spec.ts` |
| Step 3a+ | §4: `ErrorPolicy` + spec, chuyển `QueryClient`, sửa `UseNotify`, `ErrorHandling` |
| Step 3c | §2: `I18n.ts` mới, `App.vue`, spec đổi ngôn ngữ |
| Step 4 | §1 bước 9: `useAuth()`, `useStoreScope()` bọc Session |
| Step 5b | §3: `RouteMeta.d.ts`, `Navigation.ts` + spec, `AppSidebar`, title |
| P5 | §3: Command palette, phím tắt, bảng phím tắt |
| Step 7 | Chuyển mục "Thuật ngữ" của plan sang `GLOSSARY.md` |

**Checklist hoàn thành**

- [ ] `main.ts` chỉ một dòng; `Runtime.spec.ts` pass
- [ ] Không còn chỗ nào gọi `queryClient.clear()` ngoài `Session.ts`
- [ ] Không còn export singleton `i18n`; đổi ngôn ngữ đổi được chữ UI
- [ ] Chỉ `Navigation.ts` đọc `route.meta` (trừ `Guards.ts` đọc `requiresAuth`)
- [ ] `ErrorPolicy.spec.ts` có đủ mỗi dòng bảng §O.4
- [ ] `client/` chỉ còn `HttpClient.ts` + spec; refresh dùng `skipAuth`
- [ ] `eslint.config.spec.ts` pass trong `npm test`
