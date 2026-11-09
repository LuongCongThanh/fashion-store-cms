# 09 — Báo cáo: Customers

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-09-customers`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/32
Base hiện tại: `feat/cms-08-orders`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

List khách hàng và detail tabs theo URL; lịch sử đơn theo customer ID có phân trang.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 197 tests / 37 files PASS; +2 so với base PR |
| Coverage dòng                              | 85.26% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 83.11% / 80.57% / 74.8%                      |
| Production build                           | PASS                                         |
| E2E                                        | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/features/customers/views/CustomerDetailView.spec.ts` — restores the selected customer tab from the URL and scopes order history to that customer (**passed**)
- `src/features/customers/views/CustomerListView.spec.ts` — opens customer records from a filtered server list (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 665.54 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #32.

### Đã làm (giữ nguyên)

- `CustomerTable`, `CustomerFilters`, `CustomerProfile`, `CustomerAddressList`, `CustomerActivity`, `CustomerOrderTable`; shared `PageTabs` (tab giữ trên URL).

### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api/Customers.api.ts`, `types/Customer.types.ts`; `CustomerDetailView` gọi `useOrdersQuery`.
- 2 test view dùng HTTP giả.

### Chưa làm — chờ API / BE

- Tách type list/detail theo contract thật (list không trả `addresses`, `activity`).
- Quyết định sản phẩm về che email/số điện thoại (PII).
- E2E danh sách và chi tiết khách hàng.

### Chưa làm — vấn đề review cần sửa (không cần API)

- Tổng tiền hiện số thô, `createdAt` hiện chuỗi ISO (§H).
- Mượn key i18n của feature khác (`auth.login.email`, `nav.orders`, `dashboard.customers`).
- Thiếu cột trạng thái; số điện thoại rỗng render `<dd>` trống; `PageTabs` thiếu `aria-controls` và điều hướng bằng phím mũi tên.
- Chưa test ẩn tab Orders khi thiếu `order:read`.
