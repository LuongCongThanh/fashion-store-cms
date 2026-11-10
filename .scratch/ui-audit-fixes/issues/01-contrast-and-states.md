# 01 — Tương phản và trạng thái

Status: completed
Blocked by: —

Xem `../spec.md`, lát 1 (story 1–9).

- Banner offline: `variant="subtle"`.
- Icon Caps Lock: `text-default`.
- Phân trang ẩn khi list pending/error/không có `meta` (9 list).
- Dashboard: không render lưới khi không có widget.

Test: banner spec; Order list spec (pending/lỗi → không có phân trang; có dữ liệu → có); DashboardView spec (không widget → chỉ EmptyState).

## Comments

### 2026-11-10 — Implementation

Đã sửa banner warning/subtle, icon Caps Lock, lưới dashboard rỗng và 9 vị trí phân trang (8 list + danh sách Order trong chi tiết Customer; Category dùng cây, không có phân trang).

TDD: test banner đỏ vì variant solid; test Order đỏ khi refresh lỗi vẫn giữ meta cũ; test dashboard đỏ vì lưới trống vẫn tồn tại. Các vòng sửa đều chạy lại xanh.

Kiểm Chromium phát hiện chỉ đổi subtle vẫn có tương phản chữ 1,96:1 ở light. Bổ sung text-default cho title/icon; đo lại trên nền render thực: light 9,51:1, dark 12,12:1, ở cả 375px và 1280px.

Validation: 58 file / 277 unit test qua; build (gồm vue-tsc), ESLint và Prettier qua; 4 cấu hình Chromium qua.
