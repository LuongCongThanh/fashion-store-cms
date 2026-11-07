# 04 — Trang quên mật khẩu

Status: resolved
Blocked by: 02

Spec: Q8. Route `auth.forgot-password` `/forgot-password` trong AuthLayout. Form email → `forgotPassword()` qua `useAuth()` → luôn hiện thông báo trung lập (kể cả khi lỗi 4xx). Có link quay lại login. i18n vi + en.

Test: ForgotPasswordView.spec — validation, thành công và 404 đều hiện cùng một thông báo.
