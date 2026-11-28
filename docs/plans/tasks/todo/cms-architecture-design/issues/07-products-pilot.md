# Chuyển products làm mẫu theo chức năng

Type: task
Status: needs-triage
Blocked by: 06

## Mục tiêu và owner

products list/create/editor/variants/images/sale-prices, endpoints/mapping/queries cùng consumers categories/colors/sizes public hiện hữu.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Tách endpoint+mapper vào integration, query/cache vào modules; form schema/type/utility theo owner. Upload service chỉ khi seam có giá trị, storage không gắn auth Backend. Giữ các public dependencies cũ tạm đến ticket owner; không import private file bên module mới.

## Gate chung

Áp dụng đủ bốn mục của [gate chung cho slice](../spec.md#gate-chung-cho-slice): mọi dòng có Slice = 07 trong [checklist operation](../api-contract-checklist.md) đạt trạng thái đích, owner docs/rules đồng bộ, public entry được ghi và lint, refetch không ghi đè draft dirty.

## Tiêu chí hoàn tất

List/filter/URL/create/edit/variant/image/sale price tests và flow E2E bị tác động pass; không hứa nhiều request atomic; giữ dirty draft, image cancel/progress, payload/permissions/URL/UI. Review mẫu trước mở rộng.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../../structure-migration/README.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
