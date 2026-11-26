# P07 — Products — Create / Edit / Detail

> Hồ sơ lịch sử màn hình; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: on-hold
Blocked by: 04, 05, 06
Nguồn: §4.3 (Form, Detail) trong [danh mục page & component](../catalog/README.md) · Phase: P5 · Spec tổng: [Phạm vi giai đoạn](../screens.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../screens.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Tạo, sửa và xem chi tiết sản phẩm với variants, ảnh, SEO.

### Phạm vi (Làm gì)

- Routes `products/new`, `products/:id`, `products/:id/edit`.
- Views: `ProductCreateView`, `ProductDetailView`, `ProductEditView`.
- Form sections: Basic · Pricing · Categories (`CategorySelector`) · Images (`features/media`) · Variants (Size × Color → SKU · Price · Stock) · SEO · Actions (Save draft / Publish).
- SKU nằm ở Variant; sản phẩm không biến thể có 1 variant mặc định.
- Components: `ProductForm`, `ProductVariantTable` (field array), `ProductSeoFields`.
- Mô tả rich text: cài `@tiptap/*` + `dompurify` khi bắt đầu.

### Tiêu chí hoàn thành

- Sinh tổ hợp variant đúng, không trùng SKU.
- Save draft không bắt buộc đủ field publish.
- HTML mô tả được sanitize trước khi render.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng tạo/sửa sản phẩm, biến thể, ảnh và lưu draft pass.

### Phụ thuộc

- Blocked by: 04, 05, 06

### Ngoài phạm vi

- Bulk import/export.
- Những việc của các plan con khác trong [spec tổng](../screens.md#danh-sách-plan-con).

### Trạng thái 2026-11-09

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

| Hạng mục                                        | Tình trạng                    |
| ----------------------------------------------- | ----------------------------- |
| UI component và logic thuần                     | Đã làm, giữ nguyên            |
| Lớp dữ liệu tạm (API/model/HTTP giả trong test) | Có, giữ nguyên đến khi có API |
| Việc chờ API / BE                               | 1 mục                         |
| Vấn đề review cần sửa (không cần API)           | 6 mục                         |

Chi tiết: [Kết quả và review](#review-2026-11-09--đã-làm-và-chưa-làm). Việc còn lại: [Kế hoạch thực hiện](#tiếp-tục-khi-có-api).

### Kế hoạch thực hiện

#### Làm gì

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** Lệch thứ tự Phase: làm sau Categories vì form cần `CategorySelector`.

**Output:** `features/products/**` (phần form/detail).

**Kiểm tra:**

#### Tiếp tục khi có API

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] **Ưu tiên cao:** nhấn Enter trong ô bất kỳ là publish sản phẩm (`ProductForm.vue:40`).
- [ ] **Ưu tiên cao:** 'Lưu nháp' trên sản phẩm đã publish gửi `status: 'draft'`, gỡ publish không báo.
- [ ] **Ưu tiên cao:** 'Generate' thay toàn bộ biến thể, tồn kho về 0, không hỏi xác nhận.
- [ ] **Bảo mật:** `v-html` mô tả không qua DOMPurify (CONVENTIONS §E).
- [ ] SKU trùng chỉ chặn khi publish; `Number('')` thành 0; giá chưa ép số nguyên VND; chưa so `comparePrice` với `price`; `:key` theo SKU có thể trùng.
- [ ] Giá dùng `toLocaleString()`; 'SKU' hard-code; thiếu `@tiptap/pm`; view Create/Edit giống hệt nhau.

**Chờ API / BE:**

- [ ] E2E tạo/sửa/xem sản phẩm; luồng upload ảnh trong form với storage thật.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [Đặc tả và kế hoạch](#đặc-tả-và-kế-hoạch).

## Kết quả và review

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-07-products-form-detail`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/30
Base hiện tại: `feat/cms-06-categories`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

### Đã làm

Tạo/sửa/chi tiết sản phẩm, Size × Color/SKU, ảnh, SEO, draft/publish và sanitize HTML.

### Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 192 tests / 33 files PASS; +7 so với base PR |
| Coverage dòng                              | 85.9% (toàn nhánh tại checkpoint)            |
| Coverage statements / branches / functions | 83.59% / 79.82% / 77.05%                     |
| Production build                           | PASS                                         |
| Prettier format check                      | PASS                                         |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics/screens.md).

### Hành vi đã kiểm qua seam được duyệt

- `src/features/products/schemas/Variants.spec.ts` — generates unique Size × Color SKUs and preserves the default variant for products without options (**passed**)
- `src/features/products/views/ProductCreateView.spec.ts` — saves a draft with one default variant without requiring publish fields (**passed**)
- `src/features/products/views/ProductCreateView.spec.ts` — rejects publishing a product with incomplete variants and SEO (**passed**)
- `src/features/products/views/ProductCreateView.spec.ts` — publishes a categorized product with pricing, SEO and generated size/color variants (**passed**)
- `src/features/products/views/ProductDetailView.spec.ts` — sanitizes product descriptions before rendering and hides edit without write permission (**passed**)
- `src/features/products/views/ProductEditView.spec.ts` — preserves unsaved edits when a background refresh returns changed server data (**passed**)
- `src/features/products/views/ProductEditView.spec.ts` — warns before switching records and then hydrates the newly chosen product (**passed**)

### Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 654.8 kB. Đây không phải kích thước tải ban đầu của riêng feature.

### Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

### Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

### Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #30.

#### Đã làm (giữ nguyên)

- `ProductForm`, `ProductVariantTable`, `ProductSeoFields`, `ProductDescriptionEditor` (Tiptap), generator biến thể `Variants.ts` (+ spec), markup `ProductDetailView`.

#### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api/ProductEditor.api.ts`, `composables/UseProductEditor.ts` (gồm upload qua `useMedia`).
- 3 test view dùng HTTP giả.

#### Chưa làm — chờ API / BE

- E2E tạo/sửa/xem sản phẩm; luồng upload ảnh trong form với storage thật.

#### Chưa làm — vấn đề review cần sửa (không cần API)

- **Ưu tiên cao:** nhấn Enter trong ô bất kỳ là publish sản phẩm (`ProductForm.vue:40`).
- **Ưu tiên cao:** 'Lưu nháp' trên sản phẩm đã publish gửi `status: 'draft'`, gỡ publish không báo.
- **Ưu tiên cao:** 'Generate' thay toàn bộ biến thể, tồn kho về 0, không hỏi xác nhận.
- **Bảo mật:** `v-html` mô tả không qua DOMPurify (CONVENTIONS §E).
- SKU trùng chỉ chặn khi publish; `Number('')` thành 0; giá chưa ép số nguyên VND; chưa so `comparePrice` với `price`; `:key` theo SKU có thể trùng.
- Giá dùng `toLocaleString()`; 'SKU' hard-code; thiếu `@tiptap/pm`; view Create/Edit giống hệt nhau.
