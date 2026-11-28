# 1. Quy tắc đặt component

> Lịch sử prototype; giữ tiêu chí màn hình, không dùng API/quyền/Store switching mẫu như contract hiện hành.

| Loại                                                        | Đặt ở                          | Ví dụ                                  |
| ----------------------------------------------------------- | ------------------------------ | -------------------------------------- |
| Primitive (Button, Input, Table, Modal…)                    | **Không tạo** — dùng Nuxt UI   | `UButton`, `UTable`                    |
| Khung app (sidebar, header, menu)                           | `layouts/components/`          | `AppSidebar.vue`                       |
| Pattern UI dùng lại, **không** chứa nghiệp vụ, ≥ 2 nơi dùng | `shared/components/<nhóm>/`    | `PageHeader.vue`, `ConfirmDialog.vue`  |
| UI của một nghiệp vụ                                        | `features/<x>/components/`     | `ProductForm.vue`, `OrderTimeline.vue` |
| Màn hình (route)                                            | `features/<x>/views/*View.vue` | `ProductListView.vue`                  |
| Route                                                       | `features/<x>/<X>.routes.ts`   | `Products.routes.ts`                   |

Nguyên tắc:

- Component không gọi HTTP. View → composable của feature (`useProductsQuery`…) → truyền data xuống component.
- State list (search, filter, sort, page, debounce, đồng bộ URL) do `useListState` giữ; component search/filter chỉ hiển thị và emit.
- Component nghiệp vụ dùng ở feature khác (VD chọn category trong Product form) → interface công khai của feature sở hữu, không đưa vào `shared/`.
- Không tạo trước: một shared component chỉ ra đời khi có nơi dùng thứ hai.
- Ẩn/hiện theo **permission** (`useAuth().can('product:write')`), không theo tên role.

---

## 2. Layout (Phase 3) — `layouts/`

Đã có: `AuthLayout`, `DashboardLayout`, `AppSidebar`, `AppHeader`, `StoreSwitcher`, `UserMenu`.

Còn cần:

| Component          | Ghi chú                                             |
| ------------------ | --------------------------------------------------- |
| `AppBreadcrumb`    | Dựng từ route meta (`titleKey`) qua `Navigation.ts` |
| `LanguageSwitcher` | Đổi locale vue-i18n + lưu lựa chọn; không đổi URL   |
| `ThemeSwitcher`    | Light / Dark / System, dùng `UseTheme`              |
| `AppNotifications` | Backlog — chờ BE có API thông báo                   |

Sidebar nhóm theo domain, item lọc theo permission (nguồn: route meta):

```text
Dashboard
STORE      Products · Categories · Inventory · Orders
CUSTOMERS  Customers
MARKETING  Promotions
SYSTEM     Users · Roles · Settings
```

---

## 3. Shared components — `shared/components/`

Đã có: `page/PageHeader`, `confirm/ConfirmDialog` (+ `UseConfirm`), `feedback/EmptyState`, `feedback/ErrorState`, `feedback/OfflineBanner`.

| Nhóm        | Component                   | Phase | Ghi chú                                                                                                          |
| ----------- | --------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------- |
| `page/`     | `PageContainer`             | P3    | max-width, padding                                                                                               |
| `page/`     | `PageTabs`                  | P8    | Tab đồng bộ query `?tab=` (Customer detail là nơi dùng thứ hai)                                                  |
| `list/`     | `ListSearch`                | P5    | Ô search; nhận `modelValue`, debounce nằm ở `useListState`                                                       |
| `list/`     | `FilterBar`                 | P5    | Slot chứa các filter                                                                                             |
| `list/`     | `FilterDateRange`           | P7    | Orders, Inventory movements                                                                                      |
| `list/`     | `ActiveFilterTags`          | P7    | Chip filter đang bật + "Clear all"                                                                               |
| `table/`    | `DataTable`                 | P5    | Bọc `UTable`: loading/empty/error, sort, selection; props `data, columns, sort, selection`; không biết nghiệp vụ |
| `table/`    | `DataTablePagination`       | P5    | Đọc `Paginated<T>.meta`                                                                                          |
| `table/`    | `DataTableColumnVisibility` | P5    | Lưu cột ẩn/hiện                                                                                                  |
| `table/`    | `DataTableBulkActions`      | P5    | "3 selected" + slot action                                                                                       |
| `table/`    | `RowActions`                | P5    | Dropdown View/Edit/Delete, lọc theo permission                                                                   |
| `form/`     | `FormSection`               | P5    | Tiêu đề + mô tả + slot                                                                                           |
| `form/`     | `FormActions`               | P5    | Sticky footer: Cancel / Save draft / Save                                                                        |
| `feedback/` | `StatusBadge`               | P5    | Nhận `color` + `label`; **map status → màu nằm ở feature**, không ở shared                                       |
| `feedback/` | `LoadingState`              | P5    | Skeleton page/table/card                                                                                         |
| `media/`    | —                           | P5    | Upload ảnh là nghiệp vụ → `features/media` (`useMedia()`), xem §4.10                                             |

**Table = TanStack qua `UTable`.** `UTable` (Nuxt UI v4) đã chạy trên `@tanstack/vue-table` → không cài/gọi `useVueTable` riêng. `DataTable` bật `manualPagination` / `manualSorting` / `manualFiltering` (server-side, FE_architecture §22); state sort/page/filter lấy từ `useListState` (URL), không để TanStack giữ. Cột khai báo bằng `ColumnDef<T>` trong feature (VD `ProductTable.vue`).

`DeleteDialog` không cần riêng — là `useConfirm()` với preset danger.
`FormGrid` không cần — dùng class Tailwind trực tiếp.

---

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần tiếp](catalog-02.md)
