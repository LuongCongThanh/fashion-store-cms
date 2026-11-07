# Spec 07 — CSS, design system, theme

Status: ready-for-agent
Blocked by: 05
Nguồn: Step 3b · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Có design system token CSS, Ui.config.ts là nguồn màu duy nhất, theme Sáng/Tối/Hệ thống không nháy.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 3b; mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- CSS theo §J và §L: token, font, `main.css` (§L.9).
- `Ui.config.ts` là nguồn duy nhất map màu + mặc định component (D26).
- Theme theo §L.11: `useTheme()` với `storageKey: 'cms.colorMode'`, script chống nháy trong `index.html`, nút chuyển Sáng/Tối/Hệ thống.
- Trang dev `/admin/design-system` hiển thị token (§L.10).

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

đúng màu primary; chọn Tối rồi F5 không nháy trắng; `localStorage` chỉ có key `cms.colorMode`.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 05

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
