# Spec 02 — Dashboard

Status: ready-for-agent
Blocked by: 01
Nguồn: §4.2 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P4 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Trang chủ hiển thị số liệu kinh doanh, mỗi widget tự ẩn khi thiếu permission.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- Cài `echarts`, `vue-echarts` (import theo module, lazy-load).
- `features/dashboard/`: `Dashboard.routes.ts`, `views/DashboardView.vue` (route ``, không cần perm).
- Components: `StatCard`, `RevenueChart`, `OrderChart`, `RecentOrders` (`order:read`), `TopProducts` (`product:read`), `LowStockList` (`inventory:read`).
- Composable query của feature (`useDashboardQuery`…); component không gọi HTTP.
- Loading / empty / error cho từng widget (`ErrorState`, `EmptyState`).

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Widget ẩn khi thiếu permission tương ứng.
- Lỗi một widget không làm hỏng các widget khác.
- Chart chỉ nằm trong chunk lazy (kiểm bằng `npm run analyze`).
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng dashboard chính, gồm widget bị ẩn theo permission, pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 01

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Bộ lọc khoảng thời gian dashboard (chờ yêu cầu).
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
