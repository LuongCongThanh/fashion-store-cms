# Spec 09 — Customers

Status: ready-for-agent
Blocked by: 08
Nguồn: §4.6, §3 (`PageTabs`) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P8 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Xem khách hàng, địa chỉ, lịch sử đơn và hoạt động.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- Shared: `page/PageTabs` (đồng bộ `?tab=`).
- Routes `customers`, `customers/:id` (`customer:read`).
- Detail tabs: Profile · Addresses · Orders · Activity.
- Components: `CustomerTable`, `CustomerFilters`, `CustomerProfile`, `CustomerAddressList`, `CustomerOrderTable` (dùng `useOrdersQuery` của orders), `CustomerActivity`.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Reload giữ đúng tab.
- Không import nội bộ của `features/orders` ngoài interface công khai.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng danh sách khách hàng, mở chi tiết và giữ tab trên URL pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 08

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Sửa thông tin khách hàng (chưa có yêu cầu).
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
