# 08 — Báo cáo: Orders

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-08-orders`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/31
Base hiện tại: `feat/cms-07-products-form-detail`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

List filter ngày/thanh toán và chi tiết đơn với chuyển trạng thái hợp lệ, xác nhận hủy.

## Kết quả kiểm tra

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

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/features/orders/views/OrderDetailView.spec.ts` — offers only valid next statuses and changes the order through its public action (**passed**)
- `src/features/orders/views/OrderDetailView.spec.ts` — requires confirmation before cancelling an order (**passed**)
- `src/features/orders/views/OrderListView.spec.ts` — keeps date and payment filters in the URL and can clear active filters (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 661.06 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #31.

### Đã làm (giữ nguyên)

- `OrderTable`, `OrderFilters`, `OrderStatusBadge`, `PaymentStatusBadge`, `OrderItems`, `OrderSummary`, `OrderCustomerInfo`, `OrderShippingInfo`, `OrderPaymentInfo`, `OrderTimeline`, `OrderStatusAction`; bảng chuyển trạng thái `OrderStatus.ts`.
- Shared: `FilterDateRange`, `ActiveFilterTags`.

### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api/Orders.api.ts`, `UseOrders.ts`; `types/Order.types.ts` (giữ làm type cho props).
- 2 test view dùng HTTP giả.

### Chưa làm — chờ API / BE

- BE xác nhận quy tắc hủy/hoàn tiền theo trạng thái thanh toán.
- E2E danh sách và chi tiết đơn.

### Chưa làm — vấn đề review cần sửa (không cần API)

- `delivered → refunded` và hủy đơn đã thanh toán không xét payment status.
- `minAmount ≤ maxAmount`, `from ≤ to` chỉ chặn bằng thuộc tính HTML, chưa có trong schema.
- Danh sách trạng thái lặp 5 nơi (§B.2 yêu cầu `as const` object); tiền/ngày hiển thị thô; chip filter chưa dịch.
- Chi tiết thiếu Empty state; chưa test ẩn action khi thiếu `order:write`; chưa unit test bảng chuyển trạng thái; không toast thành công.
