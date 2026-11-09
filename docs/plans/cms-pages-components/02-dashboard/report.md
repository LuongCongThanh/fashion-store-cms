# 02 — Báo cáo: Dashboard

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-02-dashboard`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/25
Base hiện tại: `feat/cms-01-layout-completion`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

Widget thống kê, chart tải động và lỗi/retry riêng từng widget.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 173 tests / 22 files PASS; +4 so với base PR |
| Coverage dòng                              | 83.64% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 82.0% / 82.31% / 77.73%                      |
| Production build                           | PASS                                         |
| E2E                                        | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/features/dashboard/views/DashboardView.spec.ts` — DashboardView keeps other widgets visible when one fails and can retry it (**passed**)
- `src/features/dashboard/views/DashboardView.spec.ts` — DashboardView hides restricted widgets and never requests their data (**passed**)
- `src/features/dashboard/views/DashboardView.spec.ts` — loads the current user when opening the dashboard directly after a reload (**passed**)
- `src/features/dashboard/views/DashboardView.spec.ts` — links a recent order directly to its detail page (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 447.04 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #25.

### Đã làm (giữ nguyên)

- Component chỉ nhận props: `StatCard`, `RevenueChart`, `OrderChart`, `RecentOrders`, `TopProducts`, `LowStockList`.
- Cài `echarts`, `vue-echarts`; ẩn widget theo permission; một widget lỗi không làm hỏng cả dashboard.

### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `features/dashboard/api/Dashboard.api.ts` (`useDashboardQuery`, `GET /dashboard/*`).
- DTO `DashboardPayload` viết tay trong `types/Dashboard.types.ts`.
- `DashboardView.vue` gọi query trực tiếp; 4 test trong `DashboardView.spec.ts` dùng HTTP giả.

### Chưa làm — chờ API / BE

- Thay DTO viết tay bằng type sinh từ Swagger.
- Kiểm chart chỉ nằm trong chunk lazy (`npm run analyze`).
- E2E dashboard.

### Chưa làm — vấn đề review cần sửa (không cần API)

- `StatCard.vue` dùng `toLocaleString()` theo locale trình duyệt, không có VND; giá trị trong list không format (§H).
- Chart chưa có theme `cms-light` / `cms-dark` theo `useColorMode` (§L.11).
- `DashboardView.vue` gọi `ensureUser()` để vá lỗi guard của plan 01 — sai tầng, cần sửa ở guard.
- Loading là `<p>` chữ, chưa phải skeleton (user story 49); link `/inventory?search=<label>` tìm theo tên thay vì id.
- Hai `it` nằm ngoài `describe`; các component chưa có test riêng.
