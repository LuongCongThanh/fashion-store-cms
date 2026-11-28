# 4. Feature: page & component

> Lịch sử prototype; giữ tiêu chí màn hình, không dùng API/quyền/Store switching mẫu như contract hiện hành.

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

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần trước](catalog-01.md) · [Phần tiếp](catalog-03.md)
