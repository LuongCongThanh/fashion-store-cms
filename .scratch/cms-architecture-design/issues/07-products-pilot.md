# Chuyển products làm mẫu theo chức năng

Type: task
Status: needs-triage
Blocked by: 06

## Mục tiêu và owner

products list/create/editor/variants/images/sale-prices, endpoints/mapping/queries cùng consumers categories/colors/sizes public hiện hữu.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Tách endpoint+mapper vào integration, query/cache vào modules; form schema/type/utility theo owner. Upload service chỉ khi seam có giá trị, storage không gắn auth Backend. Giữ các public dependencies cũ tạm đến ticket owner; không import private file bên module mới.

## Coverage API Contract bắt buộc

Áp dụng typed boundary từ issue 06 cho **mọi Backend operation đã phát hành thuộc slice**, không chỉ operation mẫu. Cập nhật [checklist operation](../api-contract-checklist.md) với normalized method/path, generated request/response, mọi call site/consumer và evidence. Rà direct HTTP/casts/wrappers còn lại; pending API giữ gating và ticket riêng, storage external phân loại riêng.

## Tiêu chí hoàn tất

List/filter/URL/create/edit/variant/image/sale price tests và flow E2E bị tác động pass; không hứa nhiều request atomic; giữ dirty draft, image cancel/progress, payload/permissions/URL/UI. Review mẫu trước mở rộng.

Không đóng slice khi còn operation đã phát hành thuộc scope ở trạng thái unverified/legacy-untyped. Evidence checking phải phủ method/path/path params/query/body/success response; cast hoặc annotation DTO đơn thuần không đủ.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/cms-structure-migration.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
