# Phân loại và chuyển customers

Type: task
Status: needs-triage
Blocked by: 12

## Mục tiêu và owner

Customer list/detail/API/query/test hiện hữu.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Giữ permission/data lifecycle; không thêm anonymization/audit request giả khi thiếu API.

## Gate chung

Áp dụng đủ bốn mục của [gate chung cho slice](../spec.md#gate-chung-cho-slice): mọi dòng có Slice = 13 trong [checklist operation](../api-contract-checklist.md) đạt trạng thái đích, owner docs/rules đồng bộ, public entry được ghi và lint, refetch không ghi đè draft dirty.

## Tiêu chí hoàn tất

Không lộ route/data do gate đổi; list/detail/error behavior tests/build pass; audit cần contract được ghi riêng.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/structure-migration/README.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
