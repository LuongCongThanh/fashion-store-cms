# 03 — LoginView + redirect an toàn

Status: resolved
Blocked by: 01, 02

Spec: Q1–Q4. Viết lại `LoginView.vue` (xoá chữ thừa `qwqweqwe`): UForm + zod, email, mật khẩu có nút hiện/ẩn, checkbox remember (mặc định tick), link quên mật khẩu, alert 401, nút loading. Hàm thuần `safeRedirect(raw): string` (chỉ nhận path `/admin…`, từ chối `//`, scheme, `/login`). i18n vi + en.

Test: LoginView.spec — lỗi validation; submit gọi login với remember; 401 hiện alert; thành công thì push đến redirect. safeRedirect.spec theo bảng các trường hợp.

## Comments
- 2026-11-10: Bổ sung Q11–Q13 vào spec (PR #55, `feat/update-sider-ui`): cảnh báo Caps Lock + chữ "Đang đăng nhập…", nút điền tài khoản demo qua `LoginForm.fill()`, AuthLayout 2 cột có panel thương hiệu. Còn thiếu test LoginView.spec cho Caps Lock (hiện/ẩn) và nút demo (điền sẵn, không submit).
