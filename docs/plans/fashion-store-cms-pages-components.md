# Fashion Store CMS — Danh mục Page & Component cần tạo

File gợi ý: **page (view) nào và component nào cần tạo**, đặt ở đâu, làm ở Phase nào.

Không lặp lại kiến trúc. Nguồn chuẩn:

- Cấu trúc thư mục, tên file, chiều import: [CONVENTIONS.md](../CONVENTIONS.md) §A, §B, §E, §Q
- API layer, `useListState`, RBAC, Store scope, Table, URL state: [FE_architecture.md](../FE_architecture.md) §5, §6, §9, §22, §23
- Thứ tự Phase: [FE_architecture.md](../FE_architecture.md) §30
- Thuật ngữ: [GLOSSARY.md](../../GLOSSARY.md)

Stack: Vite + Vue 3 + vue-router + `@nuxt/ui` (chỉ thư viện component, **không phải Nuxt** — không có `pages/` file-based routing, không auto-import component).

---

## 1. Quy tắc đặt component

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

## 4. Feature: page & component

Route ghi tương đối trong layout dashboard (mount ở `/`, không prefix — xem `app/router/Routes.ts`). Cột **Perm** là permission yêu cầu ở route meta.

### 4.1 auth (Phase 2) — đã có

`LoginView` (`/login`). Backlog: `ForgotPasswordView`, `ResetPasswordView`.

### 4.2 dashboard (Phase 4)

| Route | View            | Perm |
| ----- | --------------- | ---- |
| ``    | `DashboardView` | —    |

Components: `StatCard` (revenue, orders, customers, products), `RevenueChart`, `OrderChart`, `RecentOrders`, `TopProducts`, `LowStockList`.
Mỗi widget tự ẩn khi thiếu permission tương ứng (VD `RecentOrders` cần `order:read`).

### 4.3 products (Phase 5)

| Route               | View                | Perm            |
| ------------------- | ------------------- | --------------- |
| `products`          | `ProductListView`   | `product:read`  |
| `products/new`      | `ProductCreateView` | `product:write` |
| `products/:id`      | `ProductDetailView` | `product:read`  |
| `products/:id/edit` | `ProductEditView`   | `product:write` |

List: search, filter (category, status, price), sort, pagination, column visibility, bulk publish/unpublish/delete.

Form (sections):

```text
Basic      Name · Description · Brand
Pricing    Price · Compare price · Cost
Categories (CategorySelector từ feature categories)
Images     (từ feature media)
Variants   Size × Color → SKU · Price · Stock
SEO        Slug · Meta title · Meta description
Actions    Save draft · Publish
```

SKU nằm ở **Variant** (sản phẩm không biến thể có 1 variant mặc định) — không lặp ở Basic/Inventory.

Components: `ProductTable`, `ProductFilters`, `ProductStatusBadge`, `ProductForm`, `ProductVariantTable`, `ProductSeoFields`.

### 4.4 categories (Phase 6)

| Route                 | View                 | Perm             |
| --------------------- | -------------------- | ---------------- |
| `categories`          | `CategoryListView`   | `category:read`  |
| `categories/new`      | `CategoryCreateView` | `category:write` |
| `categories/:id/edit` | `CategoryEditView`   | `category:write` |

Components: `CategoryTree` (kéo thả để move), `CategoryTreeToolbar`, `CategoryForm`, `CategorySelector` (interface công khai cho products).

### 4.5 orders (Phase 7)

| Route        | View              | Perm         |
| ------------ | ----------------- | ------------ |
| `orders`     | `OrderListView`   | `order:read` |
| `orders/:id` | `OrderDetailView` | `order:read` |

List filter: search, date range, order status, payment status, customer, amount.
Detail sections: customer, shipping, payment, items, summary, timeline. Đổi status / huỷ cần `order:write`.

Components: `OrderTable`, `OrderFilters`, `OrderStatusBadge`, `PaymentStatusBadge`, `OrderItems`, `OrderSummary`, `OrderCustomerInfo`, `OrderShippingInfo`, `OrderPaymentInfo`, `OrderTimeline`, `OrderStatusAction`.

### 4.6 customers (Phase 8)

| Route           | View                 | Perm            |
| --------------- | -------------------- | --------------- |
| `customers`     | `CustomerListView`   | `customer:read` |
| `customers/:id` | `CustomerDetailView` | `customer:read` |

Detail tabs: Profile · Addresses · Orders · Activity.

Components: `CustomerTable`, `CustomerFilters`, `CustomerProfile`, `CustomerAddressList`, `CustomerOrderTable` (dùng `useOrdersQuery` công khai của orders), `CustomerActivity`.

### 4.7 inventory (Phase 9)

| Route                 | View                    | Perm             |
| --------------------- | ----------------------- | ---------------- |
| `inventory`           | `InventoryListView`     | `inventory:read` |
| `inventory/movements` | `StockMovementListView` | `inventory:read` |

Cột inventory: Variant/SKU · Current · Reserved · Available · Stock status.
Cột movement: SKU · Type · Quantity · Reason · Reference · Created at/by.

Components: `InventoryTable`, `InventoryFilters`, `StockStatusBadge`, `StockAdjustDialog` (`inventory:write`), `StockMovementTable`, `StockMovementFilters`.

### 4.8 promotions (Phase 10)

Coupon là một loại Promotion (có mã), không tách module.

| Route                 | View                  | Perm              |
| --------------------- | --------------------- | ----------------- |
| `promotions`          | `PromotionListView`   | `promotion:read`  |
| `promotions/new`      | `PromotionCreateView` | `promotion:write` |
| `promotions/:id/edit` | `PromotionEditView`   | `promotion:write` |

Form: Type (coupon / auto) · Code · Discount type & value · Minimum order · Usage limit · Start/End · Status.

Components: `PromotionTable`, `PromotionFilters`, `PromotionForm`, `PromotionStatusBadge`.

### 4.9 users & roles (Phase 10)

| Route            | View             | Perm         |
| ---------------- | ---------------- | ------------ |
| `users`          | `UserListView`   | `user:read`  |
| `users/new`      | `UserCreateView` | `user:write` |
| `users/:id/edit` | `UserEditView`   | `user:write` |
| `roles`          | `RoleListView`   | `role:read`  |
| `roles/new`      | `RoleCreateView` | `role:write` |
| `roles/:id/edit` | `RoleEditView`   | `role:write` |

Role (ví dụ, do BE quản lý): Master Store Manager · Store Manager · Order Staff.
Permission dạng `<resource>:<action>` (`product:read`, `product:write`, `order:read`…) — danh sách lấy từ BE, không hard-code.

Components: `UserTable`, `UserFilters`, `UserForm`, `UserRoleSelector`, `UserStoreSelector` (gán Store), `RoleTable`, `RoleForm`, `PermissionMatrix` (hàng = resource, cột = action).

### 4.10 media (Phase 5, cùng products)

Không có route. Interface `useMedia()` + component:
`ImageUploader` (chọn → validate → preview → upload → progress → kết quả), `ImageGallery` (xoá, sắp xếp, đặt ảnh chính).

### 4.11 settings (Phase 10)

| Route                   | View                        | Perm             |
| ----------------------- | --------------------------- | ---------------- |
| `settings`              | → redirect `settings/store` | `settings:read`  |
| `settings/store`        | `StoreSettingsView`         | `settings:write` |
| `settings/localization` | `LocalizationSettingsView`  | `settings:write` |

Store: name, logo, description, contact email, phone, address.
Localization: languages, default language, timezone, currency, date/number format.

---

## 5. Backlog — ngoài phạm vi hiện tại

Chưa có trong FE_architecture; chỉ làm khi BE và yêu cầu rõ:

- **Content**: Banners, Content Page (`content-pages`), Blog → cần `RichTextEditor`, preview
- **Settings**: payment (VNPay, MoMo, COD), shipping (GHN), email (SMTP/SES, templates)
- `AppNotifications`, `ActivityTimeline` dùng chung (audit log)
- Page builder, media library, translation manager, bulk import/export

---

## 6. Thứ tự build

| Phase | Tạo                                                                                       |
| ----- | ----------------------------------------------------------------------------------------- |
| P3    | `AppBreadcrumb`, `LanguageSwitcher`, `ThemeSwitcher`, `PageContainer`                     |
| P4    | dashboard                                                                                 |
| P5    | shared `list/`, `table/`, `form/`, `StatusBadge`, `LoadingState`; feature media; products |
| P6    | categories (`CategoryTree`, `CategorySelector`)                                           |
| P7    | `FilterDateRange`, `ActiveFilterTags`; orders                                             |
| P8    | `PageTabs`; customers                                                                     |
| P9    | inventory                                                                                 |
| P10   | promotions, users & roles, settings                                                       |

Mục tiêu: một list page mới chỉ cần ráp `PageHeader + FilterBar + DataTable + DataTablePagination` + composable của feature.
