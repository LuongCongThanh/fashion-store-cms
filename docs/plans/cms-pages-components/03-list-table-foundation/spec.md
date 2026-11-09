# Spec 03 — Nền tảng List & Table

Status: in-progress
Blocked by: 01
Nguồn: §1, §3 (`list/`, `table/`, `feedback/`) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P5 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Một list page mới chỉ cần ráp `PageHeader + FilterBar + DataTable + DataTablePagination` + composable của feature.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- `shared/composables/UseListState.ts`: `useListState(schema)` → `{ params, setFilter, setPage, setSort, reset }`; đồng bộ URL ↔ params, parse bằng Zod, `page/pageSize/sort=-field`, reset page khi đổi filter, debounce search (FE_architecture §6.1, §22, §23).
- `list/ListSearch`, `list/FilterBar`.
- `table/DataTable` (bọc `UTable`, `manualPagination/Sorting/Filtering`, loading/empty/error, selection), `DataTablePagination` (đọc `Paginated<T>.meta`), `DataTableColumnVisibility`, `DataTableBulkActions`, `RowActions` (lọc theo permission).
- `feedback/StatusBadge` (nhận `color` + `label`), `feedback/LoadingState`.
- Cài `dayjs` nếu cần `RelativeTime`.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- `useListState`: back/forward trình duyệt khôi phục đúng state; query sai bị bỏ qua về default.
- `DataTable` không giữ state sort/page riêng (lấy từ `useListState`).
- Shared component không import từ `features/`.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng list: filter, sort, phân trang và back/forward giữ state URL pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 01

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Component chỉ một nơi dùng (`FilterDateRange`, `ActiveFilterTags` → plan 08).
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
