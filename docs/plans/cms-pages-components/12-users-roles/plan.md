# 12 — Users & Roles

Status: on-hold
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

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] **Ưu tiên cao:** UI cho người có `user:write` gán mọi role, kể cả cho chính mình.
- [ ] **Ưu tiên cao:** tự vô hiệu hóa tài khoản / tự gỡ `role:write` khỏi role mình đang giữ mà không cảnh báo.
- [ ] Form user luôn gọi `/roles`, `/stores` — thiếu `role:read` thì cả form thành ErrorState.
- [ ] `pageSize: 100` cắt bớt role; `UserTable` hiện ID thay vì tên; lọc role phải gõ ID.
- [ ] Action/resource trong ma trận chưa dịch; email sai báo 'Required'; query key không bắt đầu bằng tên feature; hai selector trùng nhau.

**Chờ API / BE:**

- [ ] Spec yêu cầu 'Danh sách permission lấy từ BE' — chỉ hoàn thành được khi có API.
- [ ] BE phải chặn leo thang đặc quyền (gán role cao hơn quyền của người sửa).
- [ ] Làm mới quyền của user hiện tại sau khi sửa role; E2E user/role.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
