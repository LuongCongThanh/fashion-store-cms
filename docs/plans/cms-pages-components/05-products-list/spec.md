# Spec 05 — Products — List

Status: ready-for-agent
Blocked by: 03
Nguồn: §4.3 (List) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P5 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Quản lý xem, tìm, lọc, thao tác hàng loạt trên danh sách sản phẩm.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- `features/products/Products.routes.ts` route `products` (`product:read`).
- `api/`, `useProductsQuery`, schema list params.
- `ProductListView`: search, filter (category, status, price), sort, pagination, column visibility, bulk publish/unpublish/delete (`product:write`).
- Components: `ProductTable` (`ColumnDef<T>`), `ProductFilters`, `ProductStatusBadge` (map status → màu ở feature).
- Delete dùng `useConfirm()` preset danger.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Filter/sort/page nằm trên URL, chia sẻ link mở đúng trạng thái.
- Bulk action ẩn khi thiếu `product:write`.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng danh sách sản phẩm: tìm, lọc, sort, phân trang và bulk action pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 03

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Form tạo/sửa (plan 07).
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
