# 12 — Users & Roles

Status: ready-for-agent
Blocked by: 03, 04
Nguồn: §4.9 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P10 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Routes: `users` (`user:read`), `users/new` và `users/:id/edit` (`user:write`); `roles` (`role:read`), `roles/new` và `roles/:id/edit` (`role:write`).
- Components: `UserTable`, `UserFilters`, `UserForm`, `UserRoleSelector`, `UserStoreSelector`, `RoleTable`, `RoleForm`, `PermissionMatrix` (hàng = resource, cột = action).
- Danh sách permission lấy từ BE, không hard-code.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** `features/users/**`, `features/roles/**`.

**Kiểm tra:**

- `PermissionMatrix` chọn/bỏ cả hàng/cột đúng.
- Không có so sánh tên role trong code.
- Route read/write bị chặn đúng theo permission đã khai báo.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng tạo/sửa user, gán role/Store và sửa role permission pass.
