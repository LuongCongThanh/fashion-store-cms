# 06 — Categories

Status: ready-for-agent
Blocked by: 03, 04
Nguồn: §4.4 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P6 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Routes `categories`, `categories/new`, `categories/:id/edit`.
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
- `typecheck`, `lint`, `test` pass.
