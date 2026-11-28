# P02 — Dashboard

> Hồ sơ lịch sử màn hình; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: on-hold
Blocked by: 01
Nguồn: §4.2 trong [danh mục page & component](../catalog/README.md) · Phase: P4 · Spec tổng: [Phạm vi giai đoạn](../screens.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../screens.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Trang chủ hiển thị số liệu kinh doanh, mỗi widget tự ẩn khi thiếu permission.

### Phạm vi (Làm gì)

- Cài `echarts`, `vue-echarts` (import theo module, lazy-load).
- `features/dashboard/`: `Dashboard.routes.ts`, `views/DashboardView.vue` (route ``, không cần perm).
- Components: `StatCard`, `RevenueChart`, `OrderChart`, `RecentOrders` (`order:read`), `TopProducts` (`product:read`), `LowStockList` (`inventory:read`).
- Composable query của feature (`useDashboardQuery`…); component không gọi HTTP.
- Loading / empty / error cho từng widget (`ErrorState`, `EmptyState`).

### Tiêu chí hoàn thành

- Widget ẩn khi thiếu permission tương ứng.
- Lỗi một widget không làm hỏng các widget khác.
- Chart chỉ nằm trong chunk lazy (kiểm bằng `npm run analyze`).
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng dashboard chính, gồm widget bị ẩn theo permission, pass.

### Phụ thuộc

- Blocked by: 01

### Ngoài phạm vi

- Bộ lọc khoảng thời gian dashboard (chờ yêu cầu).
- Những việc của các plan con khác trong [spec tổng](../screens.md#danh-sách-plan-con).

### Trạng thái 2026-11-09

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

| Hạng mục                                        | Tình trạng                    |
| ----------------------------------------------- | ----------------------------- |
| UI component và logic thuần                     | Đã làm, giữ nguyên            |
| Lớp dữ liệu tạm (API/model/HTTP giả trong test) | Có, giữ nguyên đến khi có API |
| Việc chờ API / BE                               | 3 mục                         |
| Vấn đề review cần sửa (không cần API)           | 5 mục                         |

Chi tiết: [Kết quả và review](#review-2026-11-09--đã-làm-và-chưa-làm). Việc còn lại: [Kế hoạch thực hiện](#tiếp-tục-khi-có-api).

### Kế hoạch thực hiện

#### Làm gì

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** Package: `echarts`, `vue-echarts` (§K.2).

**Output:** `features/dashboard/**`.

**Kiểm tra:**

#### Tiếp tục khi có API

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] `StatCard.vue` dùng `toLocaleString()` theo locale trình duyệt, không có VND; giá trị trong list không format (§H).
- [ ] Chart chưa có theme `cms-light` / `cms-dark` theo `useColorMode` (§L.11).
- [ ] `DashboardView.vue` gọi `ensureUser()` để vá lỗi guard của plan 01 — sai tầng, cần sửa ở guard.
- [ ] Loading là `<p>` chữ, chưa phải skeleton (user story 49); link `/inventory?search=<label>` tìm theo tên thay vì id.
- [ ] Hai `it` nằm ngoài `describe`; các component chưa có test riêng.

**Chờ API / BE:**

- [ ] Thay DTO viết tay bằng type sinh từ Swagger.
- [ ] Kiểm chart chỉ nằm trong chunk lazy (`npm run analyze`).
- [ ] E2E dashboard.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [Đặc tả và kế hoạch](#đặc-tả-và-kế-hoạch).

## Kết quả và review

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-02-dashboard`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/25
Base hiện tại: `feat/cms-01-layout-completion`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

### Đã làm

Widget thống kê, chart tải động và lỗi/retry riêng từng widget.

### Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 173 tests / 22 files PASS; +4 so với base PR |
| Coverage dòng                              | 83.64% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 82.0% / 82.31% / 77.73%                      |
| Production build                           | PASS                                         |
| Prettier format check                      | PASS                                         |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics/screens.md).

### Hành vi đã kiểm qua seam được duyệt

- `src/features/dashboard/views/DashboardView.spec.ts` — DashboardView keeps other widgets visible when one fails and can retry it (**passed**)
- `src/features/dashboard/views/DashboardView.spec.ts` — DashboardView hides restricted widgets and never requests their data (**passed**)
- `src/features/dashboard/views/DashboardView.spec.ts` — loads the current user when opening the dashboard directly after a reload (**passed**)
- `src/features/dashboard/views/DashboardView.spec.ts` — links a recent order directly to its detail page (**passed**)

### Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 447.04 kB. Đây không phải kích thước tải ban đầu của riêng feature.

### Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

### Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

### Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #25.

#### Đã làm (giữ nguyên)

- Component chỉ nhận props: `StatCard`, `RevenueChart`, `OrderChart`, `RecentOrders`, `TopProducts`, `LowStockList`.
- Cài `echarts`, `vue-echarts`; ẩn widget theo permission; một widget lỗi không làm hỏng cả dashboard.

#### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `features/dashboard/api/Dashboard.api.ts` (`useDashboardQuery`, `GET /dashboard/*`).
- DTO `DashboardPayload` viết tay trong `types/Dashboard.types.ts`.
- `DashboardView.vue` gọi query trực tiếp; 4 test trong `DashboardView.spec.ts` dùng HTTP giả.

#### Chưa làm — chờ API / BE

- Thay DTO viết tay bằng type sinh từ Swagger.
- Kiểm chart chỉ nằm trong chunk lazy (`npm run analyze`).
- E2E dashboard.

#### Chưa làm — vấn đề review cần sửa (không cần API)

- `StatCard.vue` dùng `toLocaleString()` theo locale trình duyệt, không có VND; giá trị trong list không format (§H).
- Chart chưa có theme `cms-light` / `cms-dark` theo `useColorMode` (§L.11).
- `DashboardView.vue` gọi `ensureUser()` để vá lỗi guard của plan 01 — sai tầng, cần sửa ở guard.
- Loading là `<p>` chữ, chưa phải skeleton (user story 49); link `/inventory?search=<label>` tìm theo tên thay vì id.
- Hai `it` nằm ngoài `describe`; các component chưa có test riêng.
