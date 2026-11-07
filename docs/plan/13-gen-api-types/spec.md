# Spec 13 — Script sinh API types

Status: ready-for-agent
Blocked by: 05
Nguồn: Step 6 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi *làm gì và thế nào là xong*. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Có script gen:api sinh type từ Swagger (hoặc placeholder).

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 6; mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- Script `gen:api` dùng `openapi-typescript`, đọc `OPENAPI_URL` từ env (không có tiền tố `VITE_`, không expose ra browser).
- Nếu BE chưa có Swagger: `src/shared/types/Api.generated.ts` placeholder.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

`npm run gen:api` chạy được (hoặc báo rõ thiếu URL).

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 05

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
