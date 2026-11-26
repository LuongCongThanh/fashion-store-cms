# Các bước app, kiểm tra và bàn giao

> Lịch sử thực hiện scaffold; giữ tiêu chí và bằng chứng ban đầu, không chạy lại như hướng dẫn mới.

## Step 3b — CSS, design system, theme

**Làm gì**

- CSS theo §J và §L: token, font, `main.css` (§L.9).
- `Ui.config.ts` là nguồn duy nhất map màu + mặc định component (D26).
- Theme theo §L.11: `useTheme()` với `storageKey: 'cms.colorMode'`, script chống nháy trong `index.html`, nút chuyển Sáng/Tối/Hệ thống.
- Trang dev `/admin/design-system` hiển thị token (§L.10).

**Kiểm tra:** đúng màu primary; chọn Tối rồi F5 không nháy trắng; `localStorage` chỉ có key `cms.colorMode`.

---

## Step 3c — i18n

**Làm gì**

- `I18n.ts` theo §H: `createAppI18n()` (plugin sở hữu locale), `useLocale()`; không singleton; `vi.json`/`en.json` có nhóm `common`.
- `App.vue` dùng `uiLocale` từ `useLocale()`.
- Spec (qua `renderWithPlugins()`): `useLocale().setLocale('en')` → text UI đổi sang tiếng Anh, `<html lang>`, `localStorage`, và `runtime.http` gửi `Accept-Language: en`.

**Kiểm tra:** chuyển vi/en đổi cả text và component Nuxt UI, F5 vẫn giữ ngôn ngữ; `t('sai.key')` báo lỗi typecheck; không còn `app/stores/`; không còn export singleton `i18n` (§V.2).

---

## Step 4 — Khung `features/auth`

**Làm gì**

- Tạo `features/auth/` theo §A với interface `useAuth()` (§8.1) trong `UseAuth.ts` — stub, chưa gọi API thật; bọc Session (§M.2), không có adapter riêng cho HttpClient.
- `LoginView.vue` rỗng.
- `Guards.ts` kiểm tra `meta.requiresAuth`, chỉ dùng `useAuth()` (không import store).
- `features/StoreScope/` stub: `useStoreScope()` bọc Session, `stores` cố định; `layouts/components/StoreSwitcher.vue` hiện tên Store.
- `useAuth()` bọc Session theo §M.2 (`login()` gọi API rồi `session.signIn()`, `logout()` = `session.logout()`); `Session.spec.ts` + `Runtime.spec.ts` (từ Step 3a) vẫn pass.
- `Guards.spec.ts` viết cùng step này (mock `@features/auth/UseAuth` theo §I).

**Kiểm tra:** truy cập `/admin` khi chưa đăng nhập → chuyển về `/login`; `Guards.spec.ts` pass; `main.ts` chỉ một dòng; không còn `queryClient.clear()` ngoài `Session.ts` — kể cả trong `UseAuth.ts`, `UseStoreScope.ts` (§V.1).

---

## Step 5 — E2E và coverage

**Làm gì**

- Playwright + `e2e/Smoke.spec.ts`.
- Bật `test:coverage`; thêm job e2e vào CI khi có flow thật.

**Kiểm tra:** `npm test`, `npm run test:coverage` và `npm run test:e2e` đều pass.

---

## Step 5b — PWA và công cụ bổ trợ

**Làm gì**

- Chặn index theo §R.1 (meta, `robots.txt`; header ghi vào checklist deploy).
- PWA theo §R: `vite-plugin-pwa`, `pwa-assets.config.ts`, `UsePwa.ts`, `OfflineBanner.vue`.
- `RouteMeta.d.ts`, `layouts/Navigation.ts` + `Navigation.spec.ts` (sidebar lọc theo `can()`, title, commands/shortcuts sinh đúng từ meta), `AppSidebar` render từ Navigation, `document.title` theo §S.1. Command palette và phím tắt **hoãn tới P5** (D38).
- Tool dev theo §S.2 (checker, query devtools, dependabot, knip, `analyze`).

**Kiểm tra:** `curl /robots.txt` trả `Disallow: /`, HTML có meta `noindex`; `npm run build && npm run preview` → Chrome báo cài được, Lighthouse PWA "installable"; build lại → tab cũ hiện toast Tải lại; DevTools Offline → hiện banner, app shell vẫn mở; sidebar chỉ hiện route có quyền; `Navigation.spec.ts` pass; chỉ `Navigation.ts` đọc `route.meta` (trừ `Guards.ts` đọc `requiresAuth`) (§V.3).

---

## Step 6 — Script sinh API types

**Làm gì**

- Script `gen:api` dùng `openapi-typescript`, đọc `OPENAPI_URL` từ env (không có tiền tố `VITE_`, không expose ra browser).
- Nếu BE chưa có Swagger: `src/shared/types/Api.generated.ts` placeholder.

**Kiểm tra:** `npm run gen:api` chạy được (hoặc báo rõ thiếu URL).

---

## Step 7 — Đối chiếu và chốt

**Làm gì**

- So cây thư mục thực tế với §A, sửa chỗ lệch; `npm run lint` toàn repo pass.
- Tách tài liệu (§ nguyên tắc): §B–§U → `docs/guides/README.md` (bỏ phần lịch sử/lý do dài); bảng quyết định D + lý do (§V) giữ nguyên trong plan đã archive; plan → `docs/archive/cms-initial-build/README.md`. `FE_architecture.md` link sang `CONVENTIONS.md` thay vì lặp lại.
- Sửa link: `grep -n 'scaffold-plan' docs/architecture/README.md README.md` phải về 0 kết quả — mỗi link (D-số, §B–§U) đổi sang mục tương ứng trong `CONVENTIONS.md`; link tới lý do quyết định (§V) đổi sang `docs/archive/cms-initial-build/README.md`.

**Commit / PR (D27):** mỗi step là một nhánh + PR riêng, squash merge vào `main` (VD `chore(config): init vite project`, `chore(config): add eslint prettier husky`, `feat(api): add http client with refresh seam`…). Step 1 chưa có hook nên tự kiểm tra format commit; từ Step 2 hook tự chặn. Chỉ commit/push khi được đồng ý.

---

## Ngoài phạm vi plan này

- Feature nghiệp vụ: Product, Category, Order, Customer, Inventory, Media…
- Domain model và glossary nghiệp vụ (Order status, đơn vị tồn kho…). Mục §Thuật ngữ chỉ gồm thuật ngữ kỹ thuật cần cho scaffold.
- Gọi API thật, script generator cho feature, Storybook.
- Theme theo Store, tuỳ chỉnh màu/mật độ theo người dùng.
- 3D (three.js, xem trước model sản phẩm): tạm bỏ qua; nếu storefront cần thì cân nhắc `@google/model-viewer` cho Media.

Các phần này làm sau, theo Phase ở §30.

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
