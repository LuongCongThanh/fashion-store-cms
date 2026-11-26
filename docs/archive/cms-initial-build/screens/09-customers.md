# P09 — Customers

> Hồ sơ lịch sử màn hình; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: on-hold
Blocked by: 08
Nguồn: §4.6, §3 (`PageTabs`) trong [danh mục page & component](../catalog/README.md) · Phase: P8 · Spec tổng: [Phạm vi giai đoạn](../screens.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../screens.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Xem khách hàng, địa chỉ, lịch sử đơn và hoạt động.

### Phạm vi (Làm gì)

- Shared: `page/PageTabs` (đồng bộ `?tab=`).
- Routes `customers`, `customers/:id` (`customer:read`).
- Detail tabs: Profile · Addresses · Orders · Activity.
- Components: `CustomerTable`, `CustomerFilters`, `CustomerProfile`, `CustomerAddressList`, `CustomerOrderTable` (dùng `useOrdersQuery` của orders), `CustomerActivity`.

### Tiêu chí hoàn thành

- Reload giữ đúng tab.
- Không import nội bộ của `features/orders` ngoài interface công khai.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng danh sách khách hàng, mở chi tiết và giữ tab trên URL pass.

### Phụ thuộc

- Blocked by: 08

### Ngoài phạm vi

- Sửa thông tin khách hàng (chưa có yêu cầu).
- Những việc của các plan con khác trong [spec tổng](../screens.md#danh-sách-plan-con).

### Trạng thái 2026-11-09

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

| Hạng mục                                        | Tình trạng                    |
| ----------------------------------------------- | ----------------------------- |
| UI component và logic thuần                     | Đã làm, giữ nguyên            |
| Lớp dữ liệu tạm (API/model/HTTP giả trong test) | Có, giữ nguyên đến khi có API |
| Việc chờ API / BE                               | 3 mục                         |
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

**Output:** `features/customers/**`, `shared/components/page/PageTabs.vue`.

**Kiểm tra:**

#### Tiếp tục khi có API

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] Tổng tiền hiện số thô, `createdAt` hiện chuỗi ISO (§H).
- [ ] Mượn key i18n của feature khác (`auth.login.email`, `nav.orders`, `dashboard.customers`).
- [ ] Thiếu cột trạng thái; số điện thoại rỗng render `<dd>` trống; `PageTabs` thiếu `aria-controls` và điều hướng bằng phím mũi tên.
- [ ] Chưa test ẩn tab Orders khi thiếu `order:read`.

**Chờ API / BE:**

- [ ] Tách type list/detail theo contract thật (list không trả `addresses`, `activity`).
- [ ] Quyết định sản phẩm về che email/số điện thoại (PII).
- [ ] E2E danh sách và chi tiết khách hàng.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [Đặc tả và kế hoạch](#đặc-tả-và-kế-hoạch).

## Kết quả và review

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-09-customers`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/32
Base hiện tại: `feat/cms-08-orders`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

### Đã làm

List khách hàng và detail tabs theo URL; lịch sử đơn theo customer ID có phân trang.

### Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 197 tests / 37 files PASS; +2 so với base PR |
| Coverage dòng                              | 85.26% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 83.11% / 80.57% / 74.8%                      |
| Production build                           | PASS                                         |
| Prettier format check                      | PASS                                         |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics/screens.md).

### Hành vi đã kiểm qua seam được duyệt

- `src/features/customers/views/CustomerDetailView.spec.ts` — restores the selected customer tab from the URL and scopes order history to that customer (**passed**)
- `src/features/customers/views/CustomerListView.spec.ts` — opens customer records from a filtered server list (**passed**)

### Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 665.54 kB. Đây không phải kích thước tải ban đầu của riêng feature.

### Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

### Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

### Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #32.

#### Đã làm (giữ nguyên)

- `CustomerTable`, `CustomerFilters`, `CustomerProfile`, `CustomerAddressList`, `CustomerActivity`, `CustomerOrderTable`; shared `PageTabs` (tab giữ trên URL).

#### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api/Customers.api.ts`, `types/Customer.types.ts`; `CustomerDetailView` gọi `useOrdersQuery`.
- 2 test view dùng HTTP giả.

#### Chưa làm — chờ API / BE

- Tách type list/detail theo contract thật (list không trả `addresses`, `activity`).
- Quyết định sản phẩm về che email/số điện thoại (PII).
- E2E danh sách và chi tiết khách hàng.

#### Chưa làm — vấn đề review cần sửa (không cần API)

- Tổng tiền hiện số thô, `createdAt` hiện chuỗi ISO (§H).
- Mượn key i18n của feature khác (`auth.login.email`, `nav.orders`, `dashboard.customers`).
- Thiếu cột trạng thái; số điện thoại rỗng render `<dd>` trống; `PageTabs` thiếu `aria-controls` và điều hướng bằng phím mũi tên.
- Chưa test ẩn tab Orders khi thiếu `order:read`.
