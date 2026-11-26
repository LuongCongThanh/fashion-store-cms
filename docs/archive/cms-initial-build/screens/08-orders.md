# P08 — Orders

> Hồ sơ lịch sử màn hình; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: on-hold
Blocked by: 03
Nguồn: §4.5, §3 (`FilterDateRange`, `ActiveFilterTags`) trong [danh mục page & component](../catalog/README.md) · Phase: P7 · Spec tổng: [Phạm vi giai đoạn](../screens.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../screens.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Xem, lọc và xử lý trạng thái đơn hàng.

### Phạm vi (Làm gì)

- Shared: `list/FilterDateRange`, `list/ActiveFilterTags` (+ "Clear all").
- Routes `orders`, `orders/:id` (`order:read`).
- List filter: search, date range, order status, payment status, customer, amount.
- Detail: customer, shipping, payment, items, summary, timeline; đổi status/huỷ cần `order:write`.
- Components: `OrderTable`, `OrderFilters`, `OrderStatusBadge`, `PaymentStatusBadge`, `OrderItems`, `OrderSummary`, `OrderCustomerInfo`, `OrderShippingInfo`, `OrderPaymentInfo`, `OrderTimeline`, `OrderStatusAction`.
- Export `useOrdersQuery` làm interface công khai (customers dùng).

### Tiêu chí hoàn thành

- Chỉ hiện action chuyển status hợp lệ theo trạng thái hiện tại.
- Huỷ đơn có confirm.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng danh sách, mở chi tiết và đổi hoặc huỷ trạng thái đơn hàng pass.

### Phụ thuộc

- Blocked by: 03

### Ngoài phạm vi

- Tạo đơn thủ công, in hoá đơn.
- Những việc của các plan con khác trong [spec tổng](../screens.md#danh-sách-plan-con).

### Trạng thái 2026-11-09

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

| Hạng mục                                        | Tình trạng                    |
| ----------------------------------------------- | ----------------------------- |
| UI component và logic thuần                     | Đã làm, giữ nguyên            |
| Lớp dữ liệu tạm (API/model/HTTP giả trong test) | Có, giữ nguyên đến khi có API |
| Việc chờ API / BE                               | 2 mục                         |
| Vấn đề review cần sửa (không cần API)           | 4 mục                         |

Chi tiết: [Kết quả và review](#review-2026-11-09--đã-làm-và-chưa-làm). Việc còn lại: [Kế hoạch thực hiện](#tiếp-tục-khi-có-api).

### Kế hoạch thực hiện

#### Làm gì

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** `features/orders/**`, `shared/components/list/{FilterDateRange,ActiveFilterTags}.vue`.

**Kiểm tra:**

#### Tiếp tục khi có API

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] `delivered → refunded` và hủy đơn đã thanh toán không xét payment status.
- [ ] `minAmount ≤ maxAmount`, `from ≤ to` chỉ chặn bằng thuộc tính HTML, chưa có trong schema.
- [ ] Danh sách trạng thái lặp 5 nơi (§B.2 yêu cầu `as const` object); tiền/ngày hiển thị thô; chip filter chưa dịch.
- [ ] Chi tiết thiếu Empty state; chưa test ẩn action khi thiếu `order:write`; chưa unit test bảng chuyển trạng thái; không toast thành công.

**Chờ API / BE:**

- [ ] BE xác nhận quy tắc hủy/hoàn tiền theo trạng thái thanh toán.
- [ ] E2E danh sách và chi tiết đơn.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [Đặc tả và kế hoạch](#đặc-tả-và-kế-hoạch).

## Kết quả và review

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-08-orders`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/31
Base hiện tại: `feat/cms-07-products-form-detail`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

### Đã làm

List filter ngày/thanh toán và chi tiết đơn với chuyển trạng thái hợp lệ, xác nhận hủy.

### Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 195 tests / 35 files PASS; +3 so với base PR |
| Coverage dòng                              | 85.6% (toàn nhánh tại checkpoint)            |
| Coverage statements / branches / functions | 83.44% / 80.53% / 75.84%                     |
| Production build                           | PASS                                         |
| Prettier format check                      | PASS                                         |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics/screens.md).

### Hành vi đã kiểm qua seam được duyệt

- `src/features/orders/views/OrderDetailView.spec.ts` — offers only valid next statuses and changes the order through its public action (**passed**)
- `src/features/orders/views/OrderDetailView.spec.ts` — requires confirmation before cancelling an order (**passed**)
- `src/features/orders/views/OrderListView.spec.ts` — keeps date and payment filters in the URL and can clear active filters (**passed**)

### Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 661.06 kB. Đây không phải kích thước tải ban đầu của riêng feature.

### Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

### Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

### Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #31.

#### Đã làm (giữ nguyên)

- `OrderTable`, `OrderFilters`, `OrderStatusBadge`, `PaymentStatusBadge`, `OrderItems`, `OrderSummary`, `OrderCustomerInfo`, `OrderShippingInfo`, `OrderPaymentInfo`, `OrderTimeline`, `OrderStatusAction`; bảng chuyển trạng thái `OrderStatus.ts`.
- Shared: `FilterDateRange`, `ActiveFilterTags`.

#### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api/Orders.api.ts`, `UseOrders.ts`; `types/Order.types.ts` (giữ làm type cho props).
- 2 test view dùng HTTP giả.

#### Chưa làm — chờ API / BE

- BE xác nhận quy tắc hủy/hoàn tiền theo trạng thái thanh toán.
- E2E danh sách và chi tiết đơn.

#### Chưa làm — vấn đề review cần sửa (không cần API)

- `delivered → refunded` và hủy đơn đã thanh toán không xét payment status.
- `minAmount ≤ maxAmount`, `from ≤ to` chỉ chặn bằng thuộc tính HTML, chưa có trong schema.
- Danh sách trạng thái lặp 5 nơi (§B.2 yêu cầu `as const` object); tiền/ngày hiển thị thô; chip filter chưa dịch.
- Chi tiết thiếu Empty state; chưa test ẩn action khi thiếu `order:write`; chưa unit test bảng chuyển trạng thái; không toast thành công.
