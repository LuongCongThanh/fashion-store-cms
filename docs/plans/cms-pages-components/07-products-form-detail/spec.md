# Spec 07 — Products — Create / Edit / Detail

Status: in-progress
Blocked by: 04, 05, 06
Nguồn: §4.3 (Form, Detail) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P5 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Tạo, sửa và xem chi tiết sản phẩm với variants, ảnh, SEO.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- Routes `products/new`, `products/:id`, `products/:id/edit`.
- Views: `ProductCreateView`, `ProductDetailView`, `ProductEditView`.
- Form sections: Basic · Pricing · Categories (`CategorySelector`) · Images (`features/media`) · Variants (Size × Color → SKU · Price · Stock) · SEO · Actions (Save draft / Publish).
- SKU nằm ở Variant; sản phẩm không biến thể có 1 variant mặc định.
- Components: `ProductForm`, `ProductVariantTable` (field array), `ProductSeoFields`.
- Mô tả rich text: cài `@tiptap/*` + `dompurify` khi bắt đầu.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Sinh tổ hợp variant đúng, không trùng SKU.
- Save draft không bắt buộc đủ field publish.
- HTML mô tả được sanitize trước khi render.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng tạo/sửa sản phẩm, biến thể, ảnh và lưu draft pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 04, 05, 06

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Bulk import/export.
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
