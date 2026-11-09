# 12 — Báo cáo: Users & Roles

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-12-users-roles`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/35
Base hiện tại: `feat/cms-11-promotions`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

Tạo/sửa user, gán role/Store và ma trận quyền lấy resource/action từ backend.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 209 tests / 49 files PASS; +6 so với base PR |
| Coverage dòng                              | 85.0% (toàn nhánh tại checkpoint)            |
| Coverage statements / branches / functions | 82.99% / 81.3% / 74.05%                      |
| Production build                           | PASS                                         |
| E2E                                        | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/features/roles/views/RoleCreateView.spec.ts` — builds the permission matrix from backend resources/actions and toggles rows and columns (**passed**)
- `src/features/roles/views/RoleEditView.spec.ts` — loads an existing role and saves a renamed role with its permissions removed (**passed**)
- `src/features/roles/views/RoleListView.spec.ts` — lets role writers open the role editor from the server list (**passed**)
- `src/features/users/views/UserCreateView.spec.ts` — creates a user with explicitly selected role and Store assignments (**passed**)
- `src/features/users/views/UserEditView.spec.ts` — replaces role/Store assignments and changes account status when editing a user (**passed**)
- `src/features/users/views/UserListView.spec.ts` — shows users but hides edit and create links without user:write (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 686.77 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #35.

### Đã làm (giữ nguyên)

- `PermissionMatrix` (bật/tắt theo hàng/cột), `RoleForm`, `RoleTable`, `UserForm`, `UserTable`, `UserFilters`, `UserRoleSelector`, `UserStoreSelector`.

### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `roles/api/Roles.api.ts`, `users/api/Users.api.ts`, `roles/UseRoles.ts`, type `Role`/`User`, `UseRoleEditor`, `UseUserEditor`.
- 6 test view dùng HTTP giả.

### Chưa làm — chờ API / BE

- Spec yêu cầu 'Danh sách permission lấy từ BE' — chỉ hoàn thành được khi có API.
- BE phải chặn leo thang đặc quyền (gán role cao hơn quyền của người sửa).
- Làm mới quyền của user hiện tại sau khi sửa role; E2E user/role.

### Chưa làm — vấn đề review cần sửa (không cần API)

- **Ưu tiên cao:** UI cho người có `user:write` gán mọi role, kể cả cho chính mình.
- **Ưu tiên cao:** tự vô hiệu hóa tài khoản / tự gỡ `role:write` khỏi role mình đang giữ mà không cảnh báo.
- Form user luôn gọi `/roles`, `/stores` — thiếu `role:read` thì cả form thành ErrorState.
- `pageSize: 100` cắt bớt role; `UserTable` hiện ID thay vì tên; lọc role phải gõ ID.
- Action/resource trong ma trận chưa dịch; email sai báo 'Required'; query key không bắt đầu bằng tên feature; hai selector trùng nhau.
