# Spec 08 — Orders

Status: ready-for-agent
Blocked by: 03
Nguồn: §4.5, §3 (`FilterDateRange`, `ActiveFilterTags`) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P7 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Xem, lọc và xử lý trạng thái đơn hàng.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- Shared: `list/FilterDateRange`, `list/ActiveFilterTags` (+ "Clear all").
- Routes `orders`, `orders/:id` (`order:read`).
- List filter: search, date range, order status, payment status, customer, amount.
- Detail: customer, shipping, payment, items, summary, timeline; đổi status/huỷ cần `order:write`.
- Components: `OrderTable`, `OrderFilters`, `OrderStatusBadge`, `PaymentStatusBadge`, `OrderItems`, `OrderSummary`, `OrderCustomerInfo`, `OrderShippingInfo`, `OrderPaymentInfo`, `OrderTimeline`, `OrderStatusAction`.
- Export `useOrdersQuery` làm interface công khai (customers dùng).

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Chỉ hiện action chuyển status hợp lệ theo trạng thái hiện tại.
- Huỷ đơn có confirm.
- `typecheck`, `lint`, `test` pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 03

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Tạo đơn thủ công, in hoá đơn.
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
