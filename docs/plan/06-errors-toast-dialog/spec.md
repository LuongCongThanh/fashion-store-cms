# Spec 06 — Lỗi, toast, dialog

Status: ready-for-agent
Blocked by: 05
Nguồn: Step 3a+ · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi *làm gì và thế nào là xong*. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong `guide.md`.

## Lưu ý bắt buộc

- **Không commit hoặc mở PR dưới tên Claude.** Không thêm `Co-Authored-By: Claude …`, không ghi "Generated with Claude Code", không đặt author/committer là Claude.
- Dùng một nhánh và một PR riêng, squash merge; chỉ commit hoặc push khi được đồng ý.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Mọi lỗi API thành ApiError; chính sách toast global/local thống nhất; có dialog xác nhận và state lỗi/rỗng.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 3a+; mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- ESLint `perfectionist` nhóm import theo danh sách alias §N (alias đã cấu hình ở Step 1).
- `shared/lib/api/errors/` + hàm `toApiError` trong `HttpClient.ts` theo §O; thêm vào `HttpClient.spec.ts` đủ các ca ở bảng §O.3 (test qua interface).
- `ErrorPolicy.ts` + `ErrorPolicy.spec.ts` (mỗi dòng bảng §O.4 một ca), `shared/lib/query/QueryClient.ts`, `ErrorHandling.ts` theo §O.4; `UseNotify.ts`, `UseConfirm.ts`, `ConfirmDialog.vue`, `ErrorState.vue`, `EmptyState.vue` theo §P.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

mutation lỗi 500 → toast global; mutation có `meta.errorHandling: 'local'` → không toast; query lỗi → `ErrorState` có Retry; mất mạng → `ApiError` mã `NETWORK_ERROR`; `useConfirm()` trả `true`/`false` đúng nút bấm; `ErrorPolicy.spec.ts` có đủ mỗi dòng bảng §O.4; không còn chỗ nào tự kiểm `status === 5xx` hay tự tra `errors.*` (§V.4).

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 05

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [metric.md](./metric.md).
