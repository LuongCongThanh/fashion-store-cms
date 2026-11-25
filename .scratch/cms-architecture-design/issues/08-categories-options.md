# Chuyển categories, sizes và colors

Type: task
Status: needs-triage
Blocked by: 07

## Mục tiêu và owner

Ba module owner, endpoints/query/schema/tests và products public consumers.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Giữ nghiệp vụ cây Danh mục, size/màu; không thêm bản dịch/media/hidden-subtree mới khi contract/behavior hiện tại chưa có. Đồng bộ public options dùng bởi products.

## Coverage API Contract bắt buộc

Áp dụng typed boundary từ issue 06 cho **mọi Backend operation đã phát hành thuộc slice**, không chỉ operation mẫu. Cập nhật [checklist operation](../api-contract-checklist.md) với normalized method/path, generated request/response, mọi call site/consumer và evidence. Rà direct HTTP/casts/wrappers còn lại; pending API giữ gating và ticket riêng, storage external phân loại riêng.

## Tiêu chí hoàn tất

CRUD/editor/filter và dependency products pass; không private cross imports; typecheck/build/E2E ảnh hưởng; gaps business→contract ghi riêng.

Không đóng slice khi còn operation đã phát hành thuộc scope ở trạng thái unverified/legacy-untyped. Evidence checking phải phủ method/path/path params/query/body/success response; cast hoặc annotation DTO đơn thuần không đủ.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/cms-structure-migration.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
