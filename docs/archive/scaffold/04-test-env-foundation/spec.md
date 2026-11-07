# Spec 04 — Env và nền tảng test

Status: done
Blocked by: 02
Nguồn: Step 3a (phần 1) · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Có Env validate bằng Zod và Vitest sẵn sàng để các plan sau viết test ngay.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 3a (phần 1); mã § và D trỏ vào [scaffold-plan.md](../../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- Tạo `app/`, `config/Env.config.ts`, `layouts/`, `App.vue`, `main.ts` với nội dung tối thiểu.
- `Env.config.ts`: đọc và validate `VITE_*` bằng Zod.
- Vitest theo §I: `vitest.config.ts`, `src/test/Setup.ts`, `src/test/Render.ts` (cài sớm để các step sau viết test ngay).

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

app chạy thấy `DashboardLayout.vue` rỗng; `npm test` pass; `Env.config.ts` báo lỗi rõ khi thiếu biến `VITE_*` bắt buộc.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 02

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
