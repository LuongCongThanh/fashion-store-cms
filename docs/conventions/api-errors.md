# Lỗi API, dialog và toast

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Lỗi API, mã lỗi, xử lý trong HttpClient

## `ApiError` — một kiểu lỗi duy nhất

Mọi lỗi đi ra khỏi HttpClient **luôn** là `ApiError` (kể cả mất mạng, timeout, lỗi parse). Code phía trên không bao giờ phải đọc `AxiosError`.

> Nguồn: [`src/shared/lib/api/errors/ApiError.ts`](../../src/shared/lib/api/errors/ApiError.ts) — tài liệu không chép lại code, đọc file.

## Mã lỗi (`ErrorCode.ts`)

Hai nguồn mã:

| Nguồn                                | Ví dụ                                                                                                                                                             | Khai báo ở                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Client (mặc định theo status / mạng) | `NETWORK_ERROR`, `TIMEOUT`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED`, `CONFLICT`, `BUSINESS_RULE`, `RATE_LIMITED`, `SERVER_ERROR`, `UNKNOWN` | `shared/lib/api/errors/ErrorCode.ts`                                        |
| BE nghiệp vụ                         | `PRODUCT_SLUG_TAKEN`, `ORDER_ALREADY_SHIPPED`                                                                                                                     | Swagger (enum trong `Api.generated.ts`) khi BE cung cấp; trước đó là string |

> Nguồn: [`src/shared/lib/api/errors/ErrorCode.ts`](../../src/shared/lib/api/errors/ErrorCode.ts) — tài liệu không chép lại code, đọc file.

**Hiển thị:** không bao giờ show `error.message` của BE. Text lấy từ i18n theo thứ tự: `errors.<code>` → `errors.<codeFromStatus(status)>` → `errors.UNKNOWN`. Mã nghiệp vụ của feature cũng nằm trong nhóm `errors.*` (`errors.PRODUCT_SLUG_TAKEN`). Thứ tự tra cứu này là `messageKeyOf(error)` trong `ErrorPolicy.ts` ([§O.4](#xử-lý-lỗi-global-hay-internal)); `UseNotify` chỉ gọi `t(messageKeyOf(e))`, không component nào tự tra.

## Xử lý trong HttpClient

Toàn bộ là **chi tiết nội bộ** trong `HttpClient.ts`; interface vẫn chỉ là `createHttpClient(deps)` ([§M](../architecture/http-session.md)). Ba bước dưới là ba hàm private trong cùng file:

| Thứ tự | Hàm nội bộ (trong `HttpClient.ts`) | Loại                 | Việc làm                                                                                                                                                                  |
| ------ | ---------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | `attachHeaders(config)`            | request interceptor  | Gắn `Authorization` (bỏ nếu `skipAuth`), `Accept-Language`                                                                                                                |
| 2      | `retryAfterRefresh(error)`         | response interceptor | 401 → chờ **một** `session.refresh()` đang chạy, gắn token mới, gửi lại request; refresh trả null → ném lỗi (Session đã phát `authFailure`); bỏ qua request có `skipAuth` |
| 3      | `toApiError(error)`                | response interceptor | Mọi lỗi còn lại → `throw ApiError` (bảng dưới); đăng ký **cuối cùng** để chạy sau bước 2                                                                                  |

Mọi ca dưới đây được test trong `HttpClient.spec.ts` qua interface (`createHttpClient({ transport: mock.adapter() })`), không test hàm private — refactor bên trong không làm vỡ test.

`HttpClientDeps` xem [§M.1](../architecture/http-session.md). Timeout mặc định 15s.

Bảng chuẩn hoá lỗi (`toApiError`, nội bộ):

| Đầu vào                                        | Kết quả                                                    |
| ---------------------------------------------- | ---------------------------------------------------------- |
| Có response, body `{ code, message, details }` | `ApiError(status, code, message, details.fields)`          |
| Có response, body không đúng chuẩn             | `ApiError(status, codeFromStatus(status), …)`              |
| `ECONNABORTED` / timeout                       | `ApiError(0, TIMEOUT)`                                     |
| Không có response                              | `ApiError(0, NETWORK_ERROR)`                               |
| Request bị huỷ (`AbortController`)             | Ném lại nguyên lỗi huỷ — **không** coi là lỗi, không toast |

## Xử lý lỗi: global hay internal

**Error policy** (`shared/lib/api/errors/ErrorPolicy.ts`, D39) là nơi duy nhất trả lời "lỗi này xử lý thế nào". Bảng dưới là đặc tả của nó; `ErrorPolicy.spec.ts` có một ca cho mỗi dòng.

> Nguồn: [`src/shared/lib/api/errors/ErrorPolicy.ts`](../../src/shared/lib/api/errors/ErrorPolicy.ts) — tài liệu không chép lại code, đọc file.

Các module tiêu thụ chỉ là adapter mỏng:

- `shared/lib/query/QueryClient.ts` — `retry` dùng `isRetryable`; `MutationCache.onError` dùng `routeMutationError` (`'toast'` → `onMutationError`).
- `shared/composables/UseNotify.ts` — chỉ hiển thị: `error(e)` = toast `t(messageKeyOf(e, te))`; bỏ qua nếu `isSilent(e)`.
- `shared/lib/form/ApplyApiErrorToForm.ts` — được gọi khi `routeMutationError` trả `'form'`.
- `app/providers/ErrorHandling.ts` — chỉ glue Vue (`errorHandler`, `unhandledrejection`, `router.onError`), dùng `isSilent` + notifier.
- `toApiError` trong `HttpClient.ts` là bước transport (axios → `ApiError`), không phải policy.

Nguyên tắc: **lỗi đọc dữ liệu (query) hiển thị tại chỗ; lỗi hành động (mutation) mặc định toast global**, trừ khi màn hình tự xử lý được tốt hơn.

| Tình huống                                             | Ai xử lý                                                            | Hiển thị                                                                                                 |
| ------------------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 401                                                    | Global — `retryAfterRefresh` trong HttpClient + `Session.refresh()` | Refresh im lặng; thất bại → về `/login` + toast `errors.UNAUTHORIZED`                                    |
| Query lỗi (list, detail)                               | **Internal** — view                                                 | `ErrorState` + nút Retry; không toast                                                                    |
| Query 404                                              | Internal                                                            | `ErrorState` "không tìm thấy" trong trang, hoặc `router.replace({ name: 'not-found' })` với trang detail |
| Query 403                                              | Internal                                                            | `ErrorState` "không có quyền"; route bị guard chặn từ trước thì vào `ForbiddenView`                      |
| Mutation 400 / 422 có `fields`                         | **Internal** — form                                                 | `applyApiErrorToForm()` gắn lỗi vào field; trả `false` → toast global                                    |
| Mutation 409 / 422 không `fields`, 403, 429, 5xx, mạng | **Global** — `MutationCache.onError`                                | Toast lỗi theo [§O.2](#mã-lỗi-errorcodets)                                                               |
| Mutation cần xử lý riêng (VD dialog xác nhận khi 409)  | Internal — khai báo `meta: { errorHandling: 'local' }`              | Màn hình tự quyết định                                                                                   |
| Lỗi JS không bắt (render, watcher, promise)            | Global — `app.config.errorHandler`, `unhandledrejection`            | Toast `errors.UNKNOWN` + `console.error` (sau này gửi Sentry)                                            |
| Lỗi tải chunk khi đổi route                            | Global — `router.onError`                                           | Reload trang một lần                                                                                     |

> Nguồn: [`src/shared/lib/query/QueryClient.ts`](../../src/shared/lib/query/QueryClient.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/shared/lib/query/VueQuery.d.ts`](../../src/shared/lib/query/VueQuery.d.ts) — tài liệu không chép lại code, đọc file.

`ErrorHandling.ts` có một interface: `installErrorHandling(app, { router, notifier })` — gắn `app.config.errorHandler`, `unhandledrejection`, `router.onError`. `main.ts` gọi một lần.

`notifier` tạo bằng `createNotifier({ toast, t, te })` trong `UseNotify.ts`, runtime truyền `useToast()` của Nuxt UI và `translate`/`has` của i18n — dùng được ngoài `setup`. Test truyền notifier giả (`createFakeNotifier()` trong `src/test/Render.ts`). `useNotify()` inject đúng instance đó.

Component **không** tự `try/catch` để toast lỗi mutation (đã có global); chỉ toast **thành công** qua `useNotify().success(...)`.

---

## Dialog, toast: global hay internal

| Loại                                                     | Phạm vi                  | Đặt ở                                           | Cách mở                                                                         |
| -------------------------------------------------------- | ------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| Toast (thành công / lỗi)                                 | Global                   | Nuxt UI `UApp` (đã có sẵn)                      | `useNotify()` → `{ success(key), error(e) }`                                    |
| Dialog xác nhận (xoá, huỷ đơn, bỏ thay đổi chưa lưu)     | **Global**, generic      | `shared/components/confirm/ConfirmDialog.vue`   | `await useConfirm()({ title, description, confirmLabel?, color? })` → `boolean` |
| Modal nghiệp vụ (sửa nhanh sản phẩm, chọn ảnh, gán role) | **Internal** của feature | `features/<x>/components/<Entity>Modal.vue`     | `useOverlay().create(Comp)` của Nuxt UI hoặc `<UModal v-model:open>` trong view |
| Slideover chi tiết (xem nhanh đơn hàng)                  | Internal                 | `features/<x>/components/<Entity>Slideover.vue` | Như trên                                                                        |

Quy tắc:

- Dialog global **không** chứa nghiệp vụ, không gọi API, chỉ nhận text / màu qua tham số. Text truyền vào là i18n key đã dịch.
- Feature không đăng ký dialog global mới. Cần dùng lại modal nghiệp vụ ở feature khác → export hàm mở từ `Use<Feature>.ts` (VD `useMedia().pickImages(): Promise<Media[]>`), không import component.
- Một dialog = một Promise: hàm mở trả về kết quả (`boolean`, dữ liệu đã chọn hoặc `null` khi đóng), caller `await`, không dùng event bus / store để điều khiển dialog.
- Rời trang khi form có thay đổi chưa lưu: `onBeforeRouteLeave` + `useConfirm()`.
- Mọi dialog phải đóng được bằng Esc, focus quay về nút mở (Nuxt UI lo sẵn, không tắt).

> Nguồn: [`src/shared/components/confirm/UseConfirm.ts`](../../src/shared/components/confirm/UseConfirm.ts) — tài liệu không chép lại code, đọc file.

```ts
// dùng trong view
const confirm = useConfirm()
const { mutate } = useDeleteProduct()

async function onDelete(id: string) {
  if (!(await confirm({ title: t('products.delete.title'), color: 'error' }))) return
  mutate(id, { onSuccess: () => notify.success('products.delete.done') })
  // lỗi → toast global (§O.4)
}
```

---

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../README.md).
