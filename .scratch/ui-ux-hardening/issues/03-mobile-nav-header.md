# 03 — Phase 2: drawer mobile + header reflow

Status: ready-for-agent
Blocked by: —

Dưới `lg`: sidebar thành drawer (`USlideover`), mở bằng nút trong `AppHeader`. Drawer phải:

- có focus trap;
- đóng bằng Esc;
- trả focus về nút mở khi đóng;
- tự đóng khi đổi route.

Header ở 375px chỉ giữ: nút menu, Store switcher, breadcrumb rút gọn (`truncate`), User menu. Locale và theme chuyển vào User menu.

Header và page dùng `px-4 lg:px-6`. Trang không được cuộn ngang ở 320–414px.

Nguồn: hallmark #3, #4.

Test: Layout.spec cho mở/đóng drawer, focus trở về nút, đóng khi đổi route. Kiểm tay ở 375px, cả light và dark.
