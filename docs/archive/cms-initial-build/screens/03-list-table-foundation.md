# P03 — Nền tảng List & Table

> Hồ sơ lịch sử màn hình; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: on-hold
Blocked by: 01
Nguồn: §1, §3 (`list/`, `table/`, `feedback/`) trong [danh mục page & component](../catalog/README.md) · Phase: P5 · Spec tổng: [Phạm vi giai đoạn](../screens.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../screens.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Một list page mới chỉ cần ráp `PageHeader + FilterBar + DataTable + DataTablePagination` + composable của feature.

### Phạm vi (Làm gì)

- `shared/composables/UseListState.ts`: `useListState(schema)` → `{ params, setFilter, setPage, setSort, reset }`; đồng bộ URL ↔ params, parse bằng Zod, `page/pageSize/sort=-field`, reset page khi đổi filter, debounce search (FE_architecture §6.1, §22, §23).
- `list/ListSearch`, `list/FilterBar`.
- `table/DataTable` (bọc `UTable`, `manualPagination/Sorting/Filtering`, loading/empty/error, selection), `DataTablePagination` (đọc `Paginated<T>.meta`), `DataTableColumnVisibility`, `DataTableBulkActions`, `RowActions` (lọc theo permission).
- `feedback/StatusBadge` (nhận `color` + `label`), `feedback/LoadingState`.
- Cài `dayjs` nếu cần `RelativeTime`.

### Tiêu chí hoàn thành

- `useListState`: back/forward trình duyệt khôi phục đúng state; query sai bị bỏ qua về default.
- `DataTable` không giữ state sort/page riêng (lấy từ `useListState`).
- Shared component không import từ `features/`.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng list: filter, sort, phân trang và back/forward giữ state URL pass.

### Phụ thuộc

- Blocked by: 01

### Ngoài phạm vi

- Component chỉ một nơi dùng (`FilterDateRange`, `ActiveFilterTags` → plan 08).
- Những việc của các plan con khác trong [spec tổng](../screens.md#danh-sách-plan-con).

### Trạng thái 2026-11-09

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

| Hạng mục                                        | Tình trạng         |
| ----------------------------------------------- | ------------------ |
| UI component và logic thuần                     | Đã làm, giữ nguyên |
| Lớp dữ liệu tạm (API/model/HTTP giả trong test) | Không có           |
| Việc chờ API / BE                               | 1 mục              |
| Vấn đề review cần sửa (không cần API)           | 6 mục              |

Chi tiết: [Kết quả và review](#review-2026-11-09--đã-làm-và-chưa-làm). Việc còn lại: [Kế hoạch thực hiện](#tiếp-tục-khi-có-api).

### Kế hoạch thực hiện

#### Làm gì

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** `UTable` đã chạy trên `@tanstack/vue-table` → không cài `useVueTable` riêng.

**Output:** `shared/composables/UseListState.ts`, `shared/components/{list,table,feedback}/**`.

**Kiểm tra:**

#### Tiếp tục khi có API

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] `UseListState.ts:21` — `schema.parse` throw khi field bắt buộc không có default, trang crash thay vì quay về mặc định.
- [ ] Debounce tìm kiếm không bị hủy khi bấm Back, đẩy thêm một mục history.
- [ ] `pageSize` hợp lệ nhưng không nằm trong `[10, 20, 50, 100]` làm select trống; hiện `1 / 0` khi không có dữ liệu; `page` vượt quá không bị kẹp.
- [ ] Selection không xóa khi đổi trang/filter; không bỏ sort được (luôn quay về default).
- [ ] Ghép chuỗi `count + t(...)` thay vì i18n plural và `n()`; 7 key i18n không dùng; `DataTable` không dùng `LoadingState`.
- [ ] `TableFoundationView.spec.ts` không có file nguồn tương ứng (§B.1).

**Chờ API / BE:**

- [ ] E2E luồng list (filter, sort, phân trang, back/forward giữ state URL): hoãn.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [Đặc tả và kế hoạch](#đặc-tả-và-kế-hoạch).

## Kết quả và review

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-03-list-table-foundation`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/26
Base hiện tại: `feat/cms-02-dashboard`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

### Đã làm

URL là nguồn state list; bảng server-side, selection, pagination và pattern dùng lại.

### Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 177 tests / 24 files PASS; +4 so với base PR |
| Coverage dòng                              | 84.8% (toàn nhánh tại checkpoint)            |
| Coverage statements / branches / functions | 83.11% / 83.5% / 78.44%                      |
| Production build                           | PASS                                         |
| Prettier format check                      | PASS                                         |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics/screens.md).

### Hành vi đã kiểm qua seam được duyệt

- `src/shared/composables/UseListState.spec.ts` — restores validated URL state and resets page when a filter changes (**passed**)
- `src/shared/composables/UseListState.spec.ts` — debounces search without dropping it when another filter changes (**passed**)
- `src/shared/components/table/TableFoundationView.spec.ts` — lets a list View sort, paginate, select and hide columns using controlled table state (**passed**)
- `src/shared/components/table/TableFoundationView.spec.ts` — shows a list error with retry, then renders an empty table and loading placeholder (**passed**)

### Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 447.33 kB. Đây không phải kích thước tải ban đầu của riêng feature.

### Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

### Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

### Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #26.

#### Đã làm (giữ nguyên)

- `ListSearch`, `FilterBar`, `DataTable`, `DataTablePagination`, `DataTableBulkActions`, ẩn/hiện cột, `RowActions`, `StatusBadge`, `LoadingState`.
- `useListState` (URL ↔ params, Zod, reset page, debounce) và `Pagination.types.ts`. Không có lớp API.

#### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- Không có.

#### Chưa làm — chờ API / BE

- E2E luồng list (filter, sort, phân trang, back/forward giữ state URL): hoãn.

#### Chưa làm — vấn đề review cần sửa (không cần API)

- `UseListState.ts:21` — `schema.parse` throw khi field bắt buộc không có default, trang crash thay vì quay về mặc định.
- Debounce tìm kiếm không bị hủy khi bấm Back, đẩy thêm một mục history.
- `pageSize` hợp lệ nhưng không nằm trong `[10, 20, 50, 100]` làm select trống; hiện `1 / 0` khi không có dữ liệu; `page` vượt quá không bị kẹp.
- Selection không xóa khi đổi trang/filter; không bỏ sort được (luôn quay về default).
- Ghép chuỗi `count + t(...)` thay vì i18n plural và `n()`; 7 key i18n không dùng; `DataTable` không dùng `LoadingState`.
- `TableFoundationView.spec.ts` không có file nguồn tương ứng (§B.1).
