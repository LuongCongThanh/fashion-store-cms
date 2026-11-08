# Spec 14 — Đối chiếu và chốt

Status: ready-for-agent
Blocked by: 01–13
Nguồn: §6 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: — · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Mọi page/component trong danh mục đã có hoặc có lý do bỏ; tài liệu khớp code.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- Đối chiếu từng mục trong file nguồn với code; ghi lệch vào report.
- Chạy `knip` bỏ code thừa; `npm run analyze` ghi bundle size.
- Cập nhật `FE_architecture.md`, `CONVENTIONS.md`, `GLOSSARY.md`, `navigation-flow.md` nếu lệch.
- Điền đủ `metrics.md`; chuyển folder sang `docs/archive/`.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Definition of Done (FE_architecture §31) đạt cho từng feature.
- `test:e2e` pass toàn bộ.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 01–13

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Backlog §5.
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
