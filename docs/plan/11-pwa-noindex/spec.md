# Spec 11 — Chặn index và PWA

Status: ready-for-agent
Blocked by: 09
Nguồn: Step 5b (phần 1) · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi *làm gì và thế nào là xong*. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

App chặn công cụ tìm kiếm index, cài được như PWA và hoạt động offline ở mức app shell.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 5b (phần 1); mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- Chặn index theo §R.1 (meta, `robots.txt`; header ghi vào checklist deploy).
- PWA theo §R: `vite-plugin-pwa`, `pwa-assets.config.ts`, `UsePwa.ts`, `OfflineBanner.vue`.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

`curl /robots.txt` trả `Disallow: /`, HTML có meta `noindex`; `npm run build && npm run preview` → Chrome báo cài được, Lighthouse PWA "installable"; build lại → tab cũ hiện toast Tải lại; DevTools Offline → hiện banner, app shell vẫn mở.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 09

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
