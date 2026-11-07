# Spec 10 — E2E và coverage

Status: ready-for-agent
Blocked by: 09
Nguồn: Step 5 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi *làm gì và thế nào là xong*. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong `guide.md`.

## Lưu ý bắt buộc

- **Không commit hoặc mở PR dưới tên Claude.** Không thêm `Co-Authored-By: Claude …`, không ghi "Generated with Claude Code", không đặt author/committer là Claude.
- Dùng một nhánh và một PR riêng, squash merge; chỉ commit hoặc push khi được đồng ý.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Có Playwright smoke test và báo cáo coverage.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 5; mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- Playwright + `e2e/Smoke.spec.ts`.
- Bật `test:coverage`; thêm job e2e vào CI khi có flow thật.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

`npm test`, `npm run test:coverage` và `npm run test:e2e` đều pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 09

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [metric.md](./metric.md).
