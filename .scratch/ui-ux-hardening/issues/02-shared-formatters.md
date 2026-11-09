# 02 — Formatter tiền / số / ngày dùng chung

Status: done
Blocked by: —

Tạo `shared/lib/format/`:

- `formatMoney(value)` → `1.890.000 ₫` (vi) / `₫1,890,000` (en), theo `useLocale()`.
- `formatNumber`.
- `formatDateTime` (`Intl.DateTimeFormat`).
- Composable `useFormat()`.

Thay toàn bộ `toLocaleString()` trần và số thô ở: `StatCard`, `OrderSummary`, `ProductDetailView`, `RecentOrders`, `TopProducts`, `LowStockList`, `OrderTimeline` (thêm `<time datetime>`), cột giá của `ProductTable` (căn phải). Sửa plural "1 results" trong `DataTablePagination`.

Nguồn: break-ui #1, #4, #5, #6, #10.

Test: Format.spec theo bảng vi/en, 0, số âm, null; view spec kiểm chuỗi đã format.

## Comments

- 2026-11-10: Đã xác nhận phần triển khai nằm trong PR #44 và đã merge vào `dev`.
