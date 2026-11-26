# F06 — Lỗi, toast, dialog

> Hồ sơ lịch sử nền tảng; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: done
Blocked by: 05
Nguồn: Step 3a+ · Spec tổng: [Phạm vi giai đoạn](../foundation.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../foundation.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Mọi lỗi API thành ApiError; chính sách toast global/local thống nhất; có dialog xác nhận và state lỗi/rỗng.

### Phạm vi (Làm gì)

- ESLint `perfectionist` nhóm import theo danh sách alias §N (alias đã cấu hình ở Step 1).
- `shared/lib/api/errors/` + hàm `toApiError` trong `HttpClient.ts` theo §O; thêm vào `HttpClient.spec.ts` đủ các ca ở bảng §O.3 (test qua interface).
- `ErrorPolicy.ts` + `ErrorPolicy.spec.ts` (mỗi dòng bảng §O.4 một ca), `shared/lib/query/QueryClient.ts`, `ErrorHandling.ts` theo §O.4; `UseNotify.ts`, `UseConfirm.ts`, `ConfirmDialog.vue`, `ErrorState.vue`, `EmptyState.vue` theo §P.

### Tiêu chí hoàn thành

mutation lỗi 500 → toast global; mutation có `meta.errorHandling: 'local'` → không toast; query lỗi → `ErrorState` có Retry; mất mạng → `ApiError` mã `NETWORK_ERROR`; `useConfirm()` trả `true`/`false` đúng nút bấm; `ErrorPolicy.spec.ts` có đủ mỗi dòng bảng §O.4; không còn chỗ nào tự kiểm `status === 5xx` hay tự tra `errors.*` (§V.4).

### Phụ thuộc

- Blocked by: 05

### Ngoài phạm vi

- Những việc của các plan con khác trong [spec tổng](../foundation.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

### Kế hoạch thực hiện

#### Step 3a+ — Lỗi, toast, dialog, alias

**Làm gì**

**Kiểm tra:** mutation lỗi 500 → toast global; mutation có `meta.errorHandling: 'local'` → không toast; query lỗi → `ErrorState` có Retry; mất mạng → `ApiError` mã `NETWORK_ERROR`; `useConfirm()` trả `true`/`false` đúng nút bấm; `ErrorPolicy.spec.ts` có đủ mỗi dòng bảng §O.4; không còn chỗ nào tự kiểm `status === 5xx` hay tự tra `errors.*` (§V.4).

### Phần tham chiếu

Các đoạn dùng chung được giữ một lần ở scaffold plan; đây là tài liệu lịch sử, không phải quy tắc hiện hành.

- [Scaffold — o-lỗi-api-mã-lỗi-xử-lý-trong-httpclient](../reference/errors.md#o-lỗi-api-mã-lỗi-xử-lý-trong-httpclient)
- [Scaffold — p-dialog-toast-global-hay-internal](../reference/feedback.md#p-dialog-toast-global-hay-internal)

## Kết quả và review

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/errors-toast-dialog` (stacked trên `feat/session-http-runtime`)
Ngày hoàn thành: 2026-11-07

### Đã làm

Làm theo TDD, mỗi slice viết 1 test và thấy đỏ trước khi viết code. Chỉ test ở các seam đã chốt.

- **ErrorPolicy** (`isRetryable`, `messageKeyOf`, `isSilent`, `routeMutationError`). `ErrorPolicy.spec.ts` có 27 ca. Mỗi dòng mutation của bảng §O.4 có một ca, kèm các ca `meta.errorHandling: 'local'` và request bị huỷ.
- **QueryClient** (`createAppQueryClient`) và `VueQuery.d.ts` (kiểu cho `mutationMeta`). Hai file này chỉ chuyển tiếp sang ErrorPolicy. Phần wiring được test trong `Runtime.spec.ts`:
  - Mutation lỗi 500 thì `notifier.error` được gọi.
  - Có `meta.errorHandling: 'local'` thì không toast.
  - Query lỗi thì không toast.
- **UseNotify** (`createNotifier({ toast, t, te })`, `useNotify`, `NOTIFIER_KEY`). Spec có 3 ca:
  - Toast lỗi dùng text đã dịch theo `messageKeyOf`.
  - Request bị huỷ thì không toast.
  - `success(key)` hiện toast thành công.
- **ErrorHandling** (`installErrorHandling(app, { router, notifier, reload? })`). Spec có 3 ca:
  - Lỗi khi render thì toast và `console.error`.
  - `unhandledrejection` thì toast, trừ request bị huỷ.
  - Lỗi tải chunk khi đổi route thì reload đúng 1 lần, nhờ cờ trong `sessionStorage`.
- **UseConfirm và ConfirmDialog** (dùng `useOverlay` của Nuxt UI). Spec có 2 ca: bấm nút xác nhận trả `true`, bấm Huỷ trả `false`. Test bấm nút thật trong dialog đã render.
- **ErrorState** (có nút Retry, không hiển thị message thô của BE; spec 2 ca) và **EmptyState**.
- Nối vào Runtime: notifier (toast của Nuxt UI), `createAppQueryClient`, `installErrorHandling`, plugin `@nuxt/ui/vue-plugin`. `App.vue` bọc `UApp`. `Render.ts` cũng bọc `UApp` giống prod và nhận thêm `props`.
- `vite.config.ts` thêm `ui({ autoImport: false, components: false })`, theo quy định import tường minh (§K.5).

Các ca §O.3 của HttpClient (gồm mất mạng → `NETWORK_ERROR`) đã có trong `HttpClient.spec.ts` từ plan 05.

### Kết quả kiểm tra

| Mục kiểm tra                                                    | Kết quả | Ghi chú                                                     |
| --------------------------------------------------------------- | ------- | ----------------------------------------------------------- |
| Mutation lỗi 500 → toast global                                 | Pass    | `Runtime.spec.ts`                                           |
| Mutation có `meta.errorHandling: 'local'` → không toast         | Pass    | `Runtime.spec.ts`                                           |
| Query lỗi → `ErrorState` có Retry                               | Pass    | `ErrorState.spec.ts`; query không toast (`Runtime.spec.ts`) |
| Mất mạng → `ApiError NETWORK_ERROR`                             | Pass    | `HttpClient.spec.ts`                                        |
| `useConfirm()` trả `true`/`false` đúng nút bấm                  | Pass    | `UseConfirm.spec.ts`                                        |
| `ErrorPolicy.spec.ts` có đủ mỗi dòng bảng §O.4                  | Pass    | 27 ca                                                       |
| Không có chỗ nào tự kiểm `status === 5xx` hay tự tra `errors.*` | Pass    | grep: chỉ `codeFromStatus` (§O.2) và `ErrorPolicy`          |
| `npm test`, lint, typecheck, build                              | Pass    | 96/96                                                       |

### Lệch so với plan / quyết định mới

- `createNotifier` nhận `{ toast, t, te }`, không gọi `createNotifier()` không tham số. Lý do: toast của Nuxt UI là state global của module, nếu dùng thẳng thì test sẽ rò state giữa các ca. Plan 08 sẽ truyền `t` và `te` của i18n vào. Trước đó toast hiển thị key thô.
- `installErrorHandling` có thêm tham số `reload` (tuỳ chọn, chỉ test dùng) và trả về hàm gỡ listener.
- Plugin `ui()` được thêm vào Vite ngay ở plan này, vì toast và overlay cần các module ảo `#imports`. Phần theme và CSS vẫn để plan 07.
- Text cố định tạm thời: "Huỷ", "Xác nhận", "Thử lại", và tiêu đề `ErrorState` đang hiển thị key. Plan 08 sẽ chuyển sang i18n.
- Ca Huỷ của UseConfirm pass ngay từ lần chạy đầu, vì phần cài đặt ở slice trước đã xử lý luôn trường hợp này.

### Việc còn tồn

- Token usage: chưa điền.
