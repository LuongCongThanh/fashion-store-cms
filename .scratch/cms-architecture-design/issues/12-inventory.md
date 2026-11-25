# Phân loại và chuyển inventory theo contract hiện có

Type: task
Status: needs-triage
Blocked by: 11

## Mục tiêu và owner

Inventory list/movements/adjustment/query/schema và permission gates.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Phân Stock/Reservation/AwaitingDispatch/StockCount theo contract; migrate source hiện hữu, không tự thêm Kiểm kê hoặc tính authoritative từ frontend.

## Gate chung

Áp dụng đủ bốn mục của [gate chung cho slice](../spec.md#gate-chung-cho-slice): mọi dòng có Slice = 12 trong [checklist operation](../api-contract-checklist.md) đạt trạng thái đích, owner docs/rules đồng bộ, public entry được ghi và lint, refetch không ghi đè draft dirty.

## Tiêu chí hoàn tất

Pending gating giữ; typed operations chỉ API release; form/URL/error tests và build pass; gap business theo ticket riêng.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/cms-structure-migration.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
