# Phân loại và chuyển inventory theo contract hiện có

Type: task
Status: needs-triage
Blocked by: 11

## Mục tiêu và owner

Inventory list/movements/adjustment/query/schema và permission gates.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Phân Stock/Reservation/AwaitingDispatch/StockCount theo contract; migrate source hiện hữu, không tự thêm Kiểm kê hoặc tính authoritative từ frontend.

## Coverage API Contract bắt buộc

Áp dụng typed boundary từ issue 06 cho **mọi Backend operation đã phát hành thuộc slice**, không chỉ operation mẫu. Cập nhật [checklist operation](../api-contract-checklist.md) với normalized method/path, generated request/response, mọi call site/consumer và evidence. Rà direct HTTP/casts/wrappers còn lại; pending API giữ gating và ticket riêng, storage external phân loại riêng.

## Tiêu chí hoàn tất

Pending gating giữ; typed operations chỉ API release; form/URL/error tests và build pass; gap business theo ticket riêng.

Không đóng slice khi còn operation đã phát hành thuộc scope ở trạng thái unverified/legacy-untyped. Evidence checking phải phủ method/path/path params/query/body/success response; cast hoặc annotation DTO đơn thuần không đủ.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/cms-structure-migration.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
