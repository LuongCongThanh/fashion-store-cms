# 06 — Categories

Status: on-hold
Blocked by: 03, 04
Nguồn: §4.4 trong [danh mục page & component](../fashion-store-cms-pages-components.md) · Phase P6 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Routes: `categories` (`category:read`); `categories/new` và `categories/:id/edit` (`category:write`).
- Views: `CategoryListView`, `CategoryCreateView`, `CategoryEditView`.
- Components: `CategoryTree` (kéo thả để move), `CategoryTreeToolbar`, `CategoryForm` (SEO, localization theo FE_architecture), `CategorySelector` (interface công khai cho products).

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** Cần BE xác nhận format localized data trước (FE_architecture dòng ~591).

**Output:** `features/categories/**`.

**Kiểm tra:**

- Move bằng kéo thả gọi API và cập nhật cây; lỗi thì rollback.
- `CategorySelector` import được từ feature khác qua interface công khai.
- Route read/write bị chặn đúng theo `category:read` / `category:write`.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng category tree: tạo hoặc sửa, kéo thả và lưu pass.

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] Mọi lỗi validate đều hiện 'Không được để trống' (kể cả slug sai định dạng).
- [ ] `CategorySelector` gắn `:value` mảng vào `<select multiple>`, có thể không hiện giá trị đã chọn (cần kiểm); đang multi-select trong khi `Product.categoryId` là một giá trị.
- [ ] Merge `translations` nông; thả vào đúng chỗ cũ vẫn gửi PATCH; chưa có cách di chuyển bằng bàn phím.
- [ ] Query key `['categories', id]` có thể trùng key list; `UseCategories.ts` export component; view Create/Edit giống hệt nhau.

**Chờ API / BE:**

- [ ] BE chưa xác nhận format dữ liệu đa ngôn ngữ, nhưng `translations.{vi,en}` đã được làm — cần đối chiếu lại khi có API.
- [ ] E2E kéo thả và lưu.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
