# Giữ, viết lại và bỏ code theo feature

> Kế hoạch API-first; tiến độ là snapshot lịch sử. Giữ quyết định C1–C17, kiểm tracker trước khi triển khai tier tiếp theo.

## Phân loại file feature cũ

`K` giữ · `R` viết lại theo type sinh (trong PR của tier đó) · `D` xoá · `→` chuyển/đổi tên. Code `K` chờ tier sau vẫn compile với api/types cũ cho tới PR nối API của nó; chỉ khi đó mới xoá api/types cũ.

### `orders` (Tier 1; thanh toán/vận đơn Tier 3)

| File                                                                                                                                | Xử lý                                     | Ghi chú                                              |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| `prototype/*`                                                                                                                       | D (Tier 0)                                |                                                      |
| `api/Orders.api.ts`, `types/Order.types.ts`, `UseOrders.ts`                                                                         | R                                         | Type sinh + mapper DTO → view model                  |
| `schemas/OrderStatus.ts`                                                                                                            | D (#76)                                   | Bảng chuyển trạng thái tự suy, trái C8               |
| `components/OrderStatusAction.vue`                                                                                                  | D (#76) → `OrderActions.vue` mới ở Tier 1 | Nút theo `allowedActions[]`, không ô chọn trạng thái |
| `schemas/OrderList.schema.ts`, `OrderFilters.vue`, `OrderTable.vue`                                                                 | K/R                                       | Chỉ giữ filter API hỗ trợ                            |
| `OrderItems.vue`, `OrderSummary.vue`, `OrderTimeline.vue`, `OrderCustomerInfo.vue`, `OrderShippingInfo.vue`, `OrderStatusBadge.vue` | K                                         | Nối lại dữ liệu; `OrderItems` → hiển thị OrderLine   |
| `OrderPaymentInfo.vue`, `PaymentStatusBadge.vue`                                                                                    | K (Tier 3)                                | Tier 1 chỉ hiện COD                                  |
| (mới) Cờ cần xử lý trong chi tiết đơn                                                                                               | N (Tier 3)                                | C15                                                  |

### `inventory` (Tier 1; Kiểm kê Tier 2)

| File                                                                                          | Xử lý                        | Ghi chú                                       |
| --------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------- |
| `api/Inventory.api.ts`, `types/Inventory.types.ts`, `schemas/Inventory.schema.ts`             | R                            |                                               |
| `InventoryTable.vue`, `InventoryFilters.vue`, `StockStatusBadge.vue`, `InventoryListView.vue` | K                            | Thêm cột Hàng chờ xuất, Hàng trên kệ          |
| `StockAdjustDialog.vue`                                                                       | K                            | Điều chỉnh tồn kho có lý do (StockAdjustment) |
| `StockMovementTable.vue`, `StockMovementFilters.vue`, `StockMovementListView.vue`             | → `InventoryMovement*` (#76) | Glossary: sổ là InventoryMovement             |
| (mới) dialog nhập kho                                                                         | N                            |                                               |
| (mới) Kiểm kê                                                                                 | N (Tier 2)                   |                                               |

### `customers` (Tier 2)

Toàn bộ UI `K` chờ Tier 2. `api/`, `types/`, `schemas/` `R` khi có API. `CustomerActivity.vue`, `CustomerAddressList.vue`: nếu API Tier 2 không có dữ liệu tương ứng thì `D` trong PR đó.

### `settings` (Tier 1)

| File                                                                                       | Xử lý      |
| ------------------------------------------------------------------------------------------ | ---------- |
| `LocalizationSettingsView.vue`, `LocalizationSettingsForm.vue`, `UseLocalizationEditor.ts` | D (Tier 0) |
| Logo trong `StoreSettingsForm.vue` / `UseStoreSettingsEditor.ts` (phụ thuộc `useMedia`)    | D (Tier 0) |
| `StoreSettingsForm.vue`, `StoreSettingsView.vue`, `UseStoreSettingsEditor.ts`              | R Tier 1   | Field hiện tại (tên, mô tả, email, điện thoại, địa chỉ) là nội dung tĩnh FE theo US-1002 AC2 → bỏ; form chỉ còn Phí ship dự phòng, ngưỡng miễn phí ship, hạn mức COD |
| `api/Settings.api.ts`, `schemas/Settings.schema.ts`                                        | R Tier 1   |

### `dashboard` (Tier 2)

| File                                                                      | Xử lý                                                                                  |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `prototype/*`                                                             | D (Tier 0)                                                                             |
| Widget `products`                                                         | R (Tier 0): đếm từ API danh sách sản phẩm (`meta.total`) thay vì `/dashboard/products` |
| `StatCard.vue`, `RevenueChart.vue`, `OrderChart.vue`, `DashboardList.vue` | K, nối lại Tier 2 với báo cáo doanh thu (US-1003)                                      |
| `api/Dashboard.api.ts`, `types/Dashboard.types.ts`                        | R Tier 2                                                                               |

### `promotions` → `vouchers` (ngay sau Tier 0)

| File                                                                                                  | Xử lý                                          |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `api/`, `types/`, `schemas/Promotion.schema.ts`, `composables/UsePromotionEditor.ts`                  | R theo `CreateVoucherDto`/`VoucherResponseDto` |
| `PromotionForm.vue`, `PromotionTable.vue`, `PromotionFilters.vue`, `PromotionStatusBadge.vue`, 3 view | → `Voucher*`, nối lại                          |
| Quyền `promotion:*`                                                                                   | → `PRICING_VOUCHER_VIEW/MANAGE`                |
| Route, menu, i18n key `promotion*`                                                                    | → `voucher*`                                   |

### `media` (Tier 0)

| File                                                                                                 | Xử lý                                                                            |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `components/ImageUploader.vue`                                                                       | → `features/products/components/`, nhận hàm upload từ luồng presign của products |
| `api/Media.api.ts`, `MediaUpload.ts`, `types/Media.types.ts`, `UseMedia.ts`, `UseMediaComponents.ts` | D                                                                                |

Tra cứu: [Mục lục chủ đề](map.md) · [Toàn bộ tài liệu](../../../README.md).
