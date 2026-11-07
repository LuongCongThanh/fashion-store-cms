# 08 — Orders

Status: ready-for-agent
Blocked by: 03
Nguồn: §4.5, §3 (`FilterDateRange`, `ActiveFilterTags`) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P7 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Shared: `list/FilterDateRange`, `list/ActiveFilterTags` (+ "Clear all").
- Routes `orders`, `orders/:id` (`order:read`).
- List filter: search, date range, order status, payment status, customer, amount.
- Detail: customer, shipping, payment, items, summary, timeline; đổi status/huỷ cần `order:write`.
- Components: `OrderTable`, `OrderFilters`, `OrderStatusBadge`, `PaymentStatusBadge`, `OrderItems`, `OrderSummary`, `OrderCustomerInfo`, `OrderShippingInfo`, `OrderPaymentInfo`, `OrderTimeline`, `OrderStatusAction`.
- Export `useOrdersQuery` làm interface công khai (customers dùng).

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** `features/orders/**`, `shared/components/list/{FilterDateRange,ActiveFilterTags}.vue`.

**Kiểm tra:**

- Chỉ hiện action chuyển status hợp lệ theo trạng thái hiện tại.
- Huỷ đơn có confirm.
- `typecheck`, `lint`, `test` pass.
