# 03 — Nền tảng List & Table

Status: ready-for-agent
Blocked by: 01
Nguồn: §1, §3 (`list/`, `table/`, `feedback/`) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P5 · Spec: [spec.md](./spec.md)

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
