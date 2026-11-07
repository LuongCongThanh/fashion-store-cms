# Spec 12 — Navigation và tool dev

Status: ready-for-agent
Blocked by: 09
Nguồn: Step 5b (phần 2) · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi *làm gì và thế nào là xong*. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong `guide.md`.

## Lưu ý bắt buộc

- **Không commit hoặc mở PR dưới tên Claude.** Không thêm `Co-Authored-By: Claude …`, không ghi "Generated with Claude Code", không đặt author/committer là Claude.
- Dùng một nhánh và một PR riêng, squash merge; chỉ commit hoặc push khi được đồng ý.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Sidebar và document.title sinh từ route meta qua một module Navigation; có bộ tool dev.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 5b (phần 2); mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- `RouteMeta.d.ts`, `layouts/Navigation.ts` + `Navigation.spec.ts` (sidebar lọc theo `can()`, title, commands/shortcuts sinh đúng từ meta), `AppSidebar` render từ Navigation, `document.title` theo §S.1. Command palette và phím tắt **hoãn tới P5** (D38).
- Tool dev theo §S.2 (checker, query devtools, dependabot, knip, `analyze`).

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

sidebar chỉ hiện route có quyền; `Navigation.spec.ts` pass; chỉ `Navigation.ts` đọc `route.meta` (trừ `Guards.ts` đọc `requiresAuth`) (§V.3); `npm run knip` và `npm run analyze` chạy được.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 09

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [metric.md](./metric.md).
