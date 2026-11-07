# 06 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/errors-toast-dialog` (stacked trên `feat/session-http-runtime`)
Ngày hoàn thành: 2026-11-07

## Đã làm

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

## Kết quả kiểm tra

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

## Lệch so với plan / quyết định mới

- `createNotifier` nhận `{ toast, t, te }`, không gọi `createNotifier()` không tham số. Lý do: toast của Nuxt UI là state global của module, nếu dùng thẳng thì test sẽ rò state giữa các ca. Plan 08 sẽ truyền `t` và `te` của i18n vào. Trước đó toast hiển thị key thô.
- `installErrorHandling` có thêm tham số `reload` (tuỳ chọn, chỉ test dùng) và trả về hàm gỡ listener.
- Plugin `ui()` được thêm vào Vite ngay ở plan này, vì toast và overlay cần các module ảo `#imports`. Phần theme và CSS vẫn để plan 07.
- Text cố định tạm thời: "Huỷ", "Xác nhận", "Thử lại", và tiêu đề `ErrorState` đang hiển thị key. Plan 08 sẽ chuyển sang i18n.
- Ca Huỷ của UseConfirm pass ngay từ lần chạy đầu, vì phần cài đặt ở slice trước đã xử lý luôn trường hợp này.

## Việc còn tồn

- Token usage: chưa điền.
