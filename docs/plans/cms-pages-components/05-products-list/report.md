# 05 — Báo cáo: Products — List

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-05-products-list`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/28
Base hiện tại: `feat/cms-04-form-media-foundation`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

Danh sách sản phẩm với category/status/price filter, sort, pagination và bulk có xác nhận.

Category lookup được đặt tại products/api để PR này không phụ thuộc plan 06 chưa tồn tại; plan 06 thay bằng interface công khai của Categories.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 182 tests / 26 files PASS; +3 so với base PR |
| Coverage dòng                              | 82.04% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 80.19% / 78.63% / 74.87%                     |
| Production build                           | PASS                                         |
| Prettier format check                      | PASS                                         |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/features/products/views/ProductListView.spec.ts` — renders server products and changes filters, sort and page through the URL (**passed**)
- `src/features/products/views/ProductListView.spec.ts` — asks for confirmation before deleting selected products (**passed**)
- `src/features/products/views/ProductListView.spec.ts` — filters products using category options from the category feature (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 490.44 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #28.

### Đã làm (giữ nguyên)

- `ProductFilters`, `ProductStatusBadge`, `ProductTable`, `ProductListView` (tìm, lọc, sort, phân trang, bulk action).

### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api/Products.api.ts` (`useProductsQuery`, `useProductBulkMutation`), `types/Product.types.ts`.
- `views/ProductListView.spec.ts` dùng HTTP giả cho `/products`, `/products/bulk`, `/categories`.

### Chưa làm — chờ API / BE

- E2E danh sách sản phẩm; `Products.api.spec.ts` khi có contract thật.

### Chưa làm — vấn đề review cần sửa (không cần API)

- Test 'ẩn bulk action khi thiếu `product:write`' luôn pass dù bỏ kiểm quyền; chưa test row action khi thiếu quyền.
- Lọc giá chưa kiểm `minPrice ≤ maxPrice`; lọc danh mục là danh sách phẳng.
- Xóa hết dòng ở trang cuối để lại trang rỗng; không có toast thành công.
- Danh sách trạng thái khai báo ở 4 nơi; `ProductTable` dùng `<a href>` cứng; `titleKey: 'dashboard.products'`.
