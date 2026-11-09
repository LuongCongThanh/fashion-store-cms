# 12 — Báo cáo: Users & Roles

Status: in-progress
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
