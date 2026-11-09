# 03 — Nền tảng List & Table

Status: on-hold
Blocked by: 01
Nguồn: §1, §3 (`list/`, `table/`, `feedback/`) trong [danh mục page & component](../fashion-store-cms-pages-components.md) · Phase P5 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- `shared/composables/UseListState.ts`: `useListState(schema)` → `{ params, setFilter, setPage, setSort, reset }`; đồng bộ URL ↔ params, parse bằng Zod, `page/pageSize/sort=-field`, reset page khi đổi filter, debounce search (FE_architecture §6.1, §22, §23).
- `list/ListSearch`, `list/FilterBar`.
- `table/DataTable` (bọc `UTable`, `manualPagination/Sorting/Filtering`, loading/empty/error, selection), `DataTablePagination` (đọc `Paginated<T>.meta`), `DataTableColumnVisibility`, `DataTableBulkActions`, `RowActions` (lọc theo permission).
- `feedback/StatusBadge` (nhận `color` + `label`), `feedback/LoadingState`.
- Cài `dayjs` nếu cần `RelativeTime`.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** `UTable` đã chạy trên `@tanstack/vue-table` → không cài `useVueTable` riêng.

**Output:** `shared/composables/UseListState.ts`, `shared/components/{list,table,feedback}/**`.

**Kiểm tra:**

- `useListState`: back/forward trình duyệt khôi phục đúng state; query sai bị bỏ qua về default.
- `DataTable` không giữ state sort/page riêng (lấy từ `useListState`).
- Shared component không import từ `features/`.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng list: filter, sort, phân trang và back/forward giữ state URL pass.

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] `UseListState.ts:21` — `schema.parse` throw khi field bắt buộc không có default, trang crash thay vì quay về mặc định.
- [ ] Debounce tìm kiếm không bị hủy khi bấm Back, đẩy thêm một mục history.
- [ ] `pageSize` hợp lệ nhưng không nằm trong `[10, 20, 50, 100]` làm select trống; hiện `1 / 0` khi không có dữ liệu; `page` vượt quá không bị kẹp.
- [ ] Selection không xóa khi đổi trang/filter; không bỏ sort được (luôn quay về default).
- [ ] Ghép chuỗi `count + t(...)` thay vì i18n plural và `n()`; 7 key i18n không dùng; `DataTable` không dùng `LoadingState`.
- [ ] `TableFoundationView.spec.ts` không có file nguồn tương ứng (§B.1).

**Chờ API / BE:**

- [ ] E2E luồng list (filter, sort, phân trang, back/forward giữ state URL): hoãn.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
