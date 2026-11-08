# Spec 11 — Promotions

Status: ready-for-agent
Blocked by: 03, 04
Nguồn: §4.8 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P10 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Tạo và quản lý khuyến mãi (Coupon là Promotion có mã).

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- Routes: `promotions` (`promotion:read`); `promotions/new` và `promotions/:id/edit` (`promotion:write`).
- Form: Type (coupon / auto) · Code · Discount type & value · Minimum order · Usage limit · Start/End · Status.
- Components: `PromotionTable`, `PromotionFilters`, `PromotionForm`, `PromotionStatusBadge`.
- Cài `@internationalized/date` nếu DatePicker cần import trực tiếp.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Code bắt buộc khi type = coupon; End > Start; % ≤ 100.
- Route read/write bị chặn đúng theo `promotion:read` / `promotion:write`.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng tạo coupon/automatic promotion và validate input pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 03, 04

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Module coupon riêng.
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
