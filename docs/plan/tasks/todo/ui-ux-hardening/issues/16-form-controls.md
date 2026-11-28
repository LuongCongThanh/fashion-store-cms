# 16 — Form: thay control native bằng Nuxt UI

Status: done
Blocked by: none

Nối tiếp #04 (chỉ phủ filter + phân trang). Đổi `<input>`/`<select>`/`<input type="file">` trần trong form sang `UFormField` + `UInput`/`UInputNumber`/`USelect`/`USelectMenu`/`UCheckbox`/`UFileUpload`, lỗi hiện qua prop `error` của `UFormField` (dưới đúng field, không `role="alert"` rời).

Phạm vi: `ProductForm`, `ProductSeoFields`, `ProductVariantTable`, `CategoryForm`, `CategorySelector`, `PromotionForm`, `RoleForm`, `PermissionMatrix`, `UserForm`, `UserRoleSelector`, `UserStoreSelector`, `StoreSettingsForm`, `LocalizationSettingsForm`, `StockAdjustDialog`, `ImageUploader`.

Theo `DESIGN.md`: control mặc định `md`, trong bảng (`ProductVariantTable`, `PermissionMatrix`) dùng `sm`; tiền/số `tabular-nums`; focus ring Nuxt UI.

Nguồn: `audit-taste.md` #3.

Test: spec hiện có vẫn xanh, chỉ cập nhật selector (`@test/Select`); mỗi control lấy được bằng role và tên; lỗi validate gắn `aria-describedby` vào field.

## Comments
- 2026-11-10: Xong trên branch `feat/form-controls`. Text/số/ngày dùng `UInput` (giữ `name`, nên spec `input[name]` không đổi); select dùng `USelect`, chọn nhiều danh mục dùng `USelectMenu`; checkbox (`PermissionMatrix`, chọn Role/Store) dùng `UCheckbox`, checkbox nhóm có trạng thái indeterminate; mô tả dùng `UTextarea`. Lỗi hiện qua `UFormField :error`, `data-error` giữ qua slot `#error`. `ImageUploader` giữ input file native (ẩn) trong vùng chọn có style + `UProgress`. Helper test mới: `findCheckbox`, `setChecked`; `findCombobox`/`chooseOption` nhận cả nút của `USelectMenu`. Bảng biến thể và ma trận quyền dùng style bảng compact (thead `bg-elevated`), phần dính/phím mũi tên vẫn để #11.
- Còn mở: chữ lỗi của `UFormField` dùng `text-error` (bước 500, ≈3.8:1 trên nền trắng) — trái mục tương phản của `DESIGN.md`. Cần quyết định đổi slot `formField.error` trong `Ui.config.ts` (sửa `DESIGN.md` trước).
