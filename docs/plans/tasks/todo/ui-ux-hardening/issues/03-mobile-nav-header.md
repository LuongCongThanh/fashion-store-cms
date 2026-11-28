# 03 — Phase 2: drawer mobile + header reflow

Status: done
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

## Comments

- 2026-11-09: Xong trên branch `feat/mobile-nav-drawer`. `SidebarNav` dùng chung cho sidebar + `MobileNavDrawer`. Layout.spec thêm 3 test (mở drawer, Esc trả focus, đóng khi đổi route). Còn kiểm tay ở 375px light/dark.
- 2026-11-09: Mở lại. Làm lại shell bằng `UDashboardGroup` + `UDashboardSidebar` (`mode="slideover"`, collapsible, không resizable, 256/64px) + `UDashboardPanel` + `UDashboardNavbar`; bỏ `MobileNavDrawer` và `AppHeader` tự viết. Store switcher chuyển lên đầu sidebar. Storage `cms.dashboard` (bỏ `cms.sidebarCollapsed`, ghi Migration). Sửa `DESIGN.md` mục Layout trong cùng PR ("slideover từ trái"). 3 test hành vi trong `Layout.spec` giữ nguyên. Xem spec mục Layout shell.
- 2026-11-09: Đã làm lại trên #47. `AppShell` (group + sidebar + panel + navbar) là seam test; `MobileNavDrawer` bị bỏ, việc tự đóng khi đổi route do `autoClose` của `UDashboardSidebar` lo. Nhãn nút dùng locale Nuxt UI ("Mở thanh bên"). Còn kiểm tay 375px light/dark.
- 2026-11-10: Tinh chỉnh shell trên PR #55 (`feat/update-sider-ui`), vẫn theo DESIGN.md mục Layout: header sidebar (store switcher) cao bằng navbar để hai viền thẳng hàng; nút thu gọn ở chân sidebar có nhãn `nav.collapse`; nhãn nhóm `text-xs` uppercase; item active nền `primary/10` + chữ `primary`; viền focus link nav vẽ trên `::before` (Nuxt UI đè `outline`); "Tổng quan" `exact` để không active ở mọi route; breadcrumb rút gọn dưới `lg`; bỏ sticky/blur ở navbar (navbar nằm ngoài vùng cuộn); menu mobile đặt nút đóng bên phải (`toggleSide="right"`); UserMenu có avatar + tên, chỉ chứa theme/ngôn ngữ dưới `lg`. Đã kiểm tay 1440/1024/820/390, light + dark.
