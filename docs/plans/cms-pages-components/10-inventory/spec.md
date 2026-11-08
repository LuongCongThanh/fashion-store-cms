# Spec 10 — Inventory

Status: ready-for-agent
Blocked by: 08
Nguồn: §4.7 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P9 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Theo dõi tồn kho, điều chỉnh và lịch sử biến động.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- Routes `inventory`, `inventory/movements` (`inventory:read`).
- Cột inventory: Variant/SKU · Current · Reserved · Available · Stock status.
- Cột movement: SKU · Type · Quantity · Reason · Reference · Created at/by.
- Components: `InventoryTable`, `InventoryFilters`, `StockStatusBadge`, `StockAdjustDialog` (`inventory:write`), `StockMovementTable`, `StockMovementFilters` (dùng `FilterDateRange`).

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Adjust bắt buộc có reason, cập nhật list sau khi lưu.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng xem tồn kho, điều chỉnh có reason và kiểm tra lịch sử movement pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 08

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Nhập kho từ nhà cung cấp.
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
