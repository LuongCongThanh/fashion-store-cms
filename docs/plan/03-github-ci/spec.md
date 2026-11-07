# Spec 03 — GitHub template và CI

Status: in-progress
Blocked by: 02
Nguồn: Step 2b · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

PR có template, CI chạy lint → typecheck → test → build cho mọi PR.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 2b; mã § và D trỏ vào [scaffold-plan.md](../../archive/scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- PR template, issue templates theo §F.1.
- `.github/workflows/ci.yml`: `npm ci` → `lint` → `typecheck` → `test` → `build` (e2e thêm khi có flow thật).
- Bảo vệ `main` theo §C.4 — **bạn bật tay trên GitHub**.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

mở PR thử thấy template; CI chạy xanh.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 02

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
