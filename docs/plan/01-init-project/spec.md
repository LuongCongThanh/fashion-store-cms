# Spec 01 — Khởi tạo dự án

Status: in-progress
Blocked by: —
Nguồn: Step 1 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Có project Vite + Vue + TS chạy được, strict TS, alias, đủ package Foundation.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 1; mã § và D trỏ vào [scaffold-plan.md](../../archive/scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- Tạo Vite + Vue + TypeScript ở thư mục gốc; đổi tên file sinh sẵn theo §B.1.
- Cài dependency theo §K.1 và devDependency theo §K.3 (K.2 cài khi tới Phase).
- TypeScript `strict`, `noUncheckedIndexedAccess`, alias theo §N (`paths` trong `tsconfig.app.json` + `vite-tsconfig-paths`).
- `.nvmrc`, `engines`, `.editorconfig`, `.gitignore`, `.env.example`.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

`npm run dev` mở được trang; `npm run typecheck` pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: —

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
