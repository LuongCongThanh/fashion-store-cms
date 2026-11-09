# 08 — Orders

Status: on-hold
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
- E2E (Playwright) cho luồng danh sách, mở chi tiết và đổi hoặc huỷ trạng thái đơn hàng pass.

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] `delivered → refunded` và hủy đơn đã thanh toán không xét payment status.
- [ ] `minAmount ≤ maxAmount`, `from ≤ to` chỉ chặn bằng thuộc tính HTML, chưa có trong schema.
- [ ] Danh sách trạng thái lặp 5 nơi (§B.2 yêu cầu `as const` object); tiền/ngày hiển thị thô; chip filter chưa dịch.
- [ ] Chi tiết thiếu Empty state; chưa test ẩn action khi thiếu `order:write`; chưa unit test bảng chuyển trạng thái; không toast thành công.

**Chờ API / BE:**

- [ ] BE xác nhận quy tắc hủy/hoàn tiền theo trạng thái thanh toán.
- [ ] E2E danh sách và chi tiết đơn.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
