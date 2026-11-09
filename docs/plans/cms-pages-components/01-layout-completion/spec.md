# Spec 01 — Hoàn thiện Layout

Status: in-progress
Blocked by: —
Nguồn: §2, §3 (`PageContainer`) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P3 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Khung dashboard đầy đủ: breadcrumb, đổi ngôn ngữ, đổi theme, container trang thống nhất.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- `layouts/components/AppBreadcrumb.vue`: dựng từ route meta `titleKey` qua `Navigation.ts`.
- `layouts/components/LanguageSwitcher.vue`: đổi locale vue-i18n, lưu lựa chọn (`useLocalStorage`), không đổi URL.
- `layouts/components/ThemeSwitcher.vue`: Light / Dark / System qua `UseTheme`.
- `shared/components/page/PageContainer.vue`: max-width + padding.
- Sidebar nhóm theo domain (Dashboard · STORE · CUSTOMERS · MARKETING · SYSTEM), item lọc theo permission từ route meta.
- Gắn các component vào `AppHeader` / `DashboardLayout`; thêm key i18n vi/en.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Breadcrumb đúng với route lồng nhau, dịch theo locale.
- Đổi ngôn ngữ giữ nguyên URL, reload vẫn giữ locale.
- Theme System theo `prefers-color-scheme`.
- Sidebar ẩn item khi thiếu permission.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng breadcrumb, đổi locale/theme và sidebar theo permission pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: —

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- `AppNotifications` (backlog — chờ API).
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
