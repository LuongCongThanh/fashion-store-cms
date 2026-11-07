# 03 — LoginView + redirect an toàn

Status: resolved
Blocked by: 01, 02

Spec: Q1–Q4. Viết lại `LoginView.vue` (xoá chữ thừa `qwqweqwe`): UForm + zod, email, mật khẩu có nút hiện/ẩn, checkbox remember (mặc định tick), link quên mật khẩu, alert 401, nút loading. Hàm thuần `safeRedirect(raw): string` (chỉ nhận path `/admin…`, từ chối `//`, scheme, `/login`). i18n vi + en.

Test: LoginView.spec — lỗi validation; submit gọi login với remember; 401 hiện alert; thành công thì push đến redirect. safeRedirect.spec theo bảng các trường hợp.
