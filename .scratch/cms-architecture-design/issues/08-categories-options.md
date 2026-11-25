# Chuyển categories, sizes và colors

Type: task
Status: needs-triage
Blocked by: 07

## Mục tiêu và owner

Ba module owner, endpoints/query/schema/tests và products public consumers.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Giữ nghiệp vụ cây Danh mục, size/màu; không thêm bản dịch/media/hidden-subtree mới khi contract/behavior hiện tại chưa có. Đồng bộ public options dùng bởi products.

## Gate chung

Áp dụng đủ bốn mục của [gate chung cho slice](../spec.md#gate-chung-cho-slice): mọi dòng có Slice = 08 trong [checklist operation](../api-contract-checklist.md) đạt trạng thái đích, owner docs/rules đồng bộ, public entry được ghi và lint, refetch không ghi đè draft dirty.

## Tiêu chí hoàn tất

CRUD/editor/filter và dependency products pass; không private cross imports; typecheck/build/E2E ảnh hưởng; gaps business→contract ghi riêng.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/cms-structure-migration.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
