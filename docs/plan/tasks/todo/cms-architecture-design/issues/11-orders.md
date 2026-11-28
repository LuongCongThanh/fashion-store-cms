# Phân loại và chuyển orders theo contract hiện có

Type: task
Status: needs-triage
Blocked by: 10

## Mục tiêu và owner

Orders UI/api/query/types/permission gate/tests hiện có.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Xác minh operation đã release; migrate source hiện hữu và giữ pending gating khi API chưa có. Business state/actions theo Backend; không dựng lại state machine hoặc refund flow mới.

## Gate chung

Áp dụng đủ bốn mục của [gate chung cho slice](../spec.md#gate-chung-cho-slice): mọi dòng có Slice = 11 trong [checklist operation](../api-contract-checklist.md) đạt trạng thái đích, owner docs/rules đồng bộ, public entry được ghi và lint, refetch không ghi đè draft dirty.

## Tiêu chí hoàn tất

allowedActions theo contract nếu có; không guess DTO; pending không bị enable; old behavior/UI/URL, tests/build giữ; follow-up feature spec riêng.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../../initiatives/structure-migration/map.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
