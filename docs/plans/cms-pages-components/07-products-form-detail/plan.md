# 07 — Products — Create / Edit / Detail

Status: on-hold
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
- E2E (Playwright) cho luồng tạo/sửa sản phẩm, biến thể, ảnh và lưu draft pass.

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] **Ưu tiên cao:** nhấn Enter trong ô bất kỳ là publish sản phẩm (`ProductForm.vue:40`).
- [ ] **Ưu tiên cao:** 'Lưu nháp' trên sản phẩm đã publish gửi `status: 'draft'`, gỡ publish không báo.
- [ ] **Ưu tiên cao:** 'Generate' thay toàn bộ biến thể, tồn kho về 0, không hỏi xác nhận.
- [ ] **Bảo mật:** `v-html` mô tả không qua DOMPurify (CONVENTIONS §E).
- [ ] SKU trùng chỉ chặn khi publish; `Number('')` thành 0; giá chưa ép số nguyên VND; chưa so `comparePrice` với `price`; `:key` theo SKU có thể trùng.
- [ ] Giá dùng `toLocaleString()`; 'SKU' hard-code; thiếu `@tiptap/pm`; view Create/Edit giống hệt nhau.

**Chờ API / BE:**

- [ ] E2E tạo/sửa/xem sản phẩm; luồng upload ảnh trong form với storage thật.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
