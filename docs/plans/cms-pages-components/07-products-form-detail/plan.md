# 07 — Products — Create / Edit / Detail

Status: ready-for-agent
Blocked by: 04, 05, 06
Nguồn: §4.3 (Form, Detail) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P5 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Routes `products/new`, `products/:id`, `products/:id/edit`.
- Views: `ProductCreateView`, `ProductDetailView`, `ProductEditView`.
- Form sections: Basic · Pricing · Categories (`CategorySelector`) · Images (`features/media`) · Variants (Size × Color → SKU · Price · Stock) · SEO · Actions (Save draft / Publish).
- SKU nằm ở Variant; sản phẩm không biến thể có 1 variant mặc định.
- Components: `ProductForm`, `ProductVariantTable` (field array), `ProductSeoFields`.
- Mô tả rich text: cài `@tiptap/*` + `dompurify` khi bắt đầu.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** Lệch thứ tự Phase: làm sau Categories vì form cần `CategorySelector`.

**Output:** `features/products/**` (phần form/detail).

**Kiểm tra:**

- Sinh tổ hợp variant đúng, không trùng SKU.
- Save draft không bắt buộc đủ field publish.
- HTML mô tả được sanitize trước khi render.
- `typecheck`, `lint`, `test` pass.
