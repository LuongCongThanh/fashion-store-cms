# 15 — Command palette (⌘K)

Status: done
Blocked by: 03

Thêm `UDashboardSearch` + `UDashboardSearchButton` vào shell, mở bằng ⌘K/Ctrl+K (`defineShortcuts`), theo cách ghép trong `layouts/default.vue` của template [nuxt-ui-templates/dashboard](https://github.com/nuxt-ui-templates/dashboard).

- Dữ liệu lấy từ `command` meta của route qua `Navigation.ts`, đã lọc theo quyền. Không tự đọc route meta trong component.
- Nhãn đi qua i18n.
- Chọn mục → điều hướng bằng router, palette đóng.

Test: Layout.spec cho mở bằng phím tắt, chỉ hiện route có quyền, chọn mục thì điều hướng.

## Comments

- 2026-11-10: Thêm `UDashboardSearch` trong AppShell và search button trong navbar.
  Command lấy duy nhất từ `useNavigation()`, dịch nhãn, lọc quyền và điều hướng qua
  router. `meta_k` tự ánh xạ ⌘K trên macOS, Ctrl+K trên nền tảng khác. Layout và
  Navigation có 12 tests pass.
