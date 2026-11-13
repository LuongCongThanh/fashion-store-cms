# Kế hoạch tái cấu trúc CMS

> Trạng thái: **approved — grill 2026-11-14** · Tiến độ: Tier 0 xong (#70–#73), Voucher xong (#74, `openapi-v0.7.0`). Tier 1 prep xong (#76). Tiếp theo: Tier 1, chờ API (§7, issue 07).
> Nguồn: [`THREE-REPO-RESTRUCTURE-PLAN.md`](../../../THREE-REPO-RESTRUCTURE-PLAN.md) (re-plan API-first theo tier, 2026-11-14), [`THREE-REPO-RESTRUCTURE-SPEC.md`](../../../THREE-REPO-RESTRUCTURE-SPEC.md), [`TARGET-REPOSITORY-TREE.md`](../../../TARGET-REPOSITORY-TREE.md) §2, [`GLOSSARY-MAP.md`](../../../GLOSSARY-MAP.md).
> Thuật ngữ nghiệp vụ theo `be-demo/GLOSSARY.md`; thuật ngữ kỹ thuật theo [`GLOSSARY.md`](../../GLOSSARY.md).
> Issue con: `.scratch/three-repo-restructure/issues/`, tạo khi bắt đầu từng tier.

## 1. Mục tiêu

CMS là back-office duy nhất. Mọi màn hình gọi API thật qua `Api.generated.ts` (pin tag OpenAPI của `be-demo`), guard theo `permissions[]` từ `auth/me`, chỉ hiện hành động API cho phép. Không còn code prototype, type viết tay hay path API không tồn tại.

## 2. Hiện trạng (dev @ `f84de56`, PR #68)

| Nhóm | Feature | Trạng thái |
| --- | --- | --- |
| Đã nối API | `auth`, `accounts`, `roles`, `categories`, `sizes`, `colors`, `products` (+ Giá khuyến mãi) | Dùng type sinh, quyền thật. **Giữ.** |
| Cũ, ẩn sau `PendingPermission` | `orders`, `inventory`, `customers`, `settings`, `dashboard`, `promotions` | Type viết tay, path không tồn tại (`/orders`, `/promotions`, `/dashboard/*`…). |
| Cũ, sai mô hình | `media` | Gọi `/media/presign` không tồn tại; API upload qua `admin/products/:id/images/presign`, không có bảng media. |
| Đánh dấu xoá | `*/prototype/`, `shared/components/prototype/`, `DesignSystemView`, `scripts/CodexUsage.ts` | Chỉ chạy ở dev, dữ liệu giả. |

Pin hiện tại: `openapi-v0.6.0`; API đã phát hành `openapi-v0.7.0` (Voucher CRUD).

## 3. Quyết định (grill 2026-11-14)

| # | Quyết định |
| --- | --- |
| C1 | Plan ở file này; `TARGET-REPOSITORY-TREE.md` §2 sửa theo; issue con tạo theo tier trong `.scratch/three-repo-restructure/issues/`. |
| C2 | Tên thư mục feature phải là **một từ thường** (lint `check-file/folder-naming-convention`). Danh sách cuối: `auth`, `dashboard`, `accounts`, `roles`, `products`, `categories`, `sizes`, `colors`, `vouchers` (← `promotions`), `orders`, `inventory`, `customers`, `settings`, `returns` (Đổi trả + Hoàn tiền), `audit`, `compliance`. Không gộp `access-control` / `product-options`. |
| C3 | Feature cũ: viết lại `api/`, `types/`, mapper từ `Api.generated.ts`; giữ view/component còn khớp; bỏ phần API không có. Không viết lại cả feature. |
| C4 | Giải thể `media`: `ImageUploader` chuyển vào `products` (consumer thật duy nhất); chỉ lên `shared/` khi có consumer thật thứ hai. |
| C5 | Dọn dẹp không phụ thuộc API làm ngay (Tier 0), không đợi cleanup cuối. Không gộp `table/` + `list/` (tên `data-table` vi phạm lint, không có lợi). |
| C6 | Màn hình Voucher làm ngay sau Tier 0 (API đã xong, `openapi-v0.7.0`). |
| C7 | Menu theo feature, 3 nhóm: **Hàng hoá** (products, categories, sizes, colors, vouchers) · **Vận hành** (orders, inventory, customers, returns) · **Quản trị** (accounts, roles, settings, audit, compliance). Tiền tố `Permission` (`CATALOG_*`, `PRICING_*`, `OPERATIONS_*`, `ADMINISTRATION_*`) không ánh xạ 1–1 với nhóm menu. |
| C8 | Chi tiết đơn chỉ render hành động API trả trong DTO đơn (`allowedActions[]`); CMS không tự suy từ state machine. |
| C9 | `customers` và `dashboard` thuộc Tier 2. Trước đó `home` chỉ hiện widget có dữ liệu thật. |
| C10 | `settings` Tier 1 chỉ hiện thiết lập API định nghĩa (US-1002); bỏ Localization và logo cửa hàng. |
| C11 | Spec: xoá code thì xoá spec của nó; view viết lại mà spec test hành vi không còn thì xoá spec; spec chỉ gãy vì tên/đường dẫn thì sửa tối thiểu để CI xanh. **Không viết test mới trước Phase 7.** |
| C12 | Mỗi feature CMS bắt đầu ngay khi module API tương ứng có tag OpenAPI; thứ tự giữa các feature vẫn theo tier. |
| C13 | `inventory` Tier 1: danh sách theo Biến thể (Tồn kho, Hàng chờ xuất, Hàng trên kệ), nhập kho, điều chỉnh có lý do, sổ biến động. Kiểm kê sang Tier 2. |
| C14 | `orders` Tier 1: danh sách + lọc theo filter API có; chi tiết (dòng đơn snapshot, phân bổ Voucher, lịch sử trạng thái, hành động gồm huỷ); chỉ COD; Staff không tạo đơn. Thanh toán online/vận đơn Tier 3; Đổi trả/Hoàn tiền Tier 4. |
| C15 | ~~Cờ ở Tier 1~~ → sửa 2026-11-14: Cờ cần xử lý đi cùng **Tier 3** (API và CMS), vì mọi loại Cờ đều phát sinh từ GHN hoặc cổng thanh toán; Tier 1 COD không có nguồn sinh Cờ. |
| C16 | **Quy tắc giữ/xoá:** feature đã nối API → giữ. Code cũ không map được với API (api/types viết tay, logic tự suy, prototype, form cho dữ liệu API không có) → xoá. UI đã dựng mà API sắp tích hợp cần (bảng, filter, badge, form, chart) → giữ tới tier của nó, nối lại thay vì dựng mới. |
| C17 | Khi API chưa có hợp đồng: CMS **không** code `api/`/`types/`/mapper/màn hình theo DTO đoán, **không** dựng mock/MSW. Chỉ làm việc dựa trên glossary và `be-demo/docs/business` (Tier 1 prep, #76) và ghi nhu cầu hợp đồng cho be-demo (issue 07). |

## 4. Phân loại file feature cũ

`K` giữ · `R` viết lại theo type sinh (trong PR của tier đó) · `D` xoá · `→` chuyển/đổi tên. Code `K` chờ tier sau vẫn compile với api/types cũ cho tới PR nối API của nó; chỉ khi đó mới xoá api/types cũ.

### `orders` (Tier 1; thanh toán/vận đơn Tier 3)

| File | Xử lý | Ghi chú |
| --- | --- | --- |
| `prototype/*` | D (Tier 0) | |
| `api/Orders.api.ts`, `types/Order.types.ts`, `UseOrders.ts` | R | Type sinh + mapper DTO → view model |
| `schemas/OrderStatus.ts` | D (#76) | Bảng chuyển trạng thái tự suy, trái C8 |
| `components/OrderStatusAction.vue` | D (#76) → `OrderActions.vue` mới ở Tier 1 | Nút theo `allowedActions[]`, không ô chọn trạng thái |
| `schemas/OrderList.schema.ts`, `OrderFilters.vue`, `OrderTable.vue` | K/R | Chỉ giữ filter API hỗ trợ |
| `OrderItems.vue`, `OrderSummary.vue`, `OrderTimeline.vue`, `OrderCustomerInfo.vue`, `OrderShippingInfo.vue`, `OrderStatusBadge.vue` | K | Nối lại dữ liệu; `OrderItems` → hiển thị OrderLine |
| `OrderPaymentInfo.vue`, `PaymentStatusBadge.vue` | K (Tier 3) | Tier 1 chỉ hiện COD |
| (mới) Cờ cần xử lý trong chi tiết đơn | N (Tier 3) | C15 |

### `inventory` (Tier 1; Kiểm kê Tier 2)

| File | Xử lý | Ghi chú |
| --- | --- | --- |
| `api/Inventory.api.ts`, `types/Inventory.types.ts`, `schemas/Inventory.schema.ts` | R | |
| `InventoryTable.vue`, `InventoryFilters.vue`, `StockStatusBadge.vue`, `InventoryListView.vue` | K | Thêm cột Hàng chờ xuất, Hàng trên kệ |
| `StockAdjustDialog.vue` | K | Điều chỉnh tồn kho có lý do (StockAdjustment) |
| `StockMovementTable.vue`, `StockMovementFilters.vue`, `StockMovementListView.vue` | → `InventoryMovement*` (#76) | Glossary: sổ là InventoryMovement |
| (mới) dialog nhập kho | N | |
| (mới) Kiểm kê | N (Tier 2) | |

### `customers` (Tier 2)

Toàn bộ UI `K` chờ Tier 2. `api/`, `types/`, `schemas/` `R` khi có API. `CustomerActivity.vue`, `CustomerAddressList.vue`: nếu API Tier 2 không có dữ liệu tương ứng thì `D` trong PR đó.

### `settings` (Tier 1)

| File | Xử lý |
| --- | --- |
| `LocalizationSettingsView.vue`, `LocalizationSettingsForm.vue`, `UseLocalizationEditor.ts` | D (Tier 0) |
| Logo trong `StoreSettingsForm.vue` / `UseStoreSettingsEditor.ts` (phụ thuộc `useMedia`) | D (Tier 0) |
| `StoreSettingsForm.vue`, `StoreSettingsView.vue`, `UseStoreSettingsEditor.ts` | R Tier 1 | Field hiện tại (tên, mô tả, email, điện thoại, địa chỉ) là nội dung tĩnh FE theo US-1002 AC2 → bỏ; form chỉ còn Phí ship dự phòng, ngưỡng miễn phí ship, hạn mức COD |
| `api/Settings.api.ts`, `schemas/Settings.schema.ts` | R Tier 1 |

### `dashboard` (Tier 2)

| File | Xử lý |
| --- | --- |
| `prototype/*` | D (Tier 0) |
| Widget `products` | R (Tier 0): đếm từ API danh sách sản phẩm (`meta.total`) thay vì `/dashboard/products` |
| `StatCard.vue`, `RevenueChart.vue`, `OrderChart.vue`, `DashboardList.vue` | K, nối lại Tier 2 với báo cáo doanh thu (US-1003) |
| `api/Dashboard.api.ts`, `types/Dashboard.types.ts` | R Tier 2 |

### `promotions` → `vouchers` (ngay sau Tier 0)

| File | Xử lý |
| --- | --- |
| `api/`, `types/`, `schemas/Promotion.schema.ts`, `composables/UsePromotionEditor.ts` | R theo `CreateVoucherDto`/`VoucherResponseDto` |
| `PromotionForm.vue`, `PromotionTable.vue`, `PromotionFilters.vue`, `PromotionStatusBadge.vue`, 3 view | → `Voucher*`, nối lại |
| Quyền `promotion:*` | → `PRICING_VOUCHER_VIEW/MANAGE` |
| Route, menu, i18n key `promotion*` | → `voucher*` |

### `media` (Tier 0)

| File | Xử lý |
| --- | --- |
| `components/ImageUploader.vue` | → `features/products/components/`, nhận hàm upload từ luồng presign của products |
| `api/Media.api.ts`, `MediaUpload.ts`, `types/Media.types.ts`, `UseMedia.ts`, `UseMediaComponents.ts` | D |

## 5. Cây thư mục đích

```text
cms/src/
├── app/            App.vue (← src/App.vue), Runtime.ts, config/, providers/, router/ (guard theo permissions[]),
│                   views/ ForbiddenView, NotFoundView        (DesignSystemView xoá)
├── layouts/        AuthLayout, DashboardLayout, Navigation (3 nhóm menu C7)
├── shared/
│   ├── components/ confirm/ feedback/ form/ list/ page/ table/   (prototype/ xoá)
│   ├── composables/ (UsePrototypeVariant xoá nếu còn)
│   ├── lib/api/    client/ errors/ Permission.ts Api.generated.ts (← shared/types/)
│   ├── lib/        session/ form/ format/ i18n/ query/
│   └── types/Pagination.types.ts
└── features/
    auth  dashboard  accounts  roles
    products  categories  sizes  colors  vouchers
    orders  inventory  customers  returns
    settings  audit  compliance
```

Mỗi feature: `api/ components/ composables/ schemas/ stores/ types/ views/` khi cần + `<Feature>.routes.ts`. Không có `pricing/`, `fulfillment/`, `flags/`, `media/`.

## 6. Thứ tự giao

Mỗi PR target `dev`, squash. Kiểm chứng: `typecheck`, `lint`, `knip`, `build`, `gen:api` không lệch, CI xanh, chạy tay trên API thật. Mỗi feature nối API: bỏ chuỗi `PendingPermission` của nó, dùng `Permission` thật, xoá i18n key và spec chết (C11).

### Tier 0 — dọn dẹp (không phụ thuộc API)

| PR | Nội dung |
| --- | --- |
| 0.1 | Xoá `dashboard/prototype`, `orders/prototype`, `shared/components/prototype`, `UsePrototypeVariant`, `DesignSystemView`, dev routes, `scripts/CodexUsage.ts`, i18n key liên quan. |
| 0.2 | Chuyển `shared/types/Api.generated.ts` → `shared/lib/api/Api.generated.ts`; sửa `GenApi.ts`, import, CI check, alias, `GLOSSARY.md` mục Generated API, `docs/CONVENTIONS.md`. |
| 0.3 | Giải thể `media` (§4); bỏ logo và Localization khỏi `settings`. |
| 0.4 | Widget `products` của dashboard đọc API danh sách sản phẩm; menu 3 nhóm C7. |

Thoát: grep `prototype`, `DesignSystem`, `features/media`, `/media/` sạch; `knip` sạch.

### Voucher (ngay sau Tier 0)

| PR | Nội dung |
| --- | --- |
| V.1 | Nâng pin `openapi-v0.7.0`, sinh lại type. `promotions` → `vouchers` theo §4. Mã Voucher không đổi sau tạo; Voucher đã dùng chỉ sửa giờ kết thúc, giới hạn tổng (≥ đã dùng), giới hạn mỗi người mua, trạng thái active (theo quyết định B2). |

Thoát: Admin tạo/sửa/vô hiệu hoá Voucher trên CMS; Staff không thấy menu.

### Tier 1 — bán COD (sau khi module API có tag, C12)

| PR | Phụ thuộc API | Nội dung |
| --- | --- | --- |
| 1.1 | `inventory` | C13 + §4 inventory. |
| 1.2 | `settings` (US-1002) | Form theo field API: Phí ship dự phòng, ngưỡng miễn phí ship, hạn mức COD (Admin). |
| 1.3 | `ordering` (+ `allowedActions[]`) | C14 + §4 orders. Cờ ở Tier 3 (C15). |

Thoát: Staff thấy đơn COD Khách vãng lai vừa đặt, đi hết hành động API cho phép tới bàn giao/huỷ; tồn kho trên CMS khớp Giữ hàng/Hàng chờ xuất.

### Tier 2 — tài khoản và vận hành

| PR | Phụ thuộc API | Nội dung |
| --- | --- | --- |
| 2.1 | danh sách Khách hàng, sổ địa chỉ | `customers` (§4). |
| 2.2 | StockCount (US-703) | Kiểm kê trong `inventory`. |
| 2.3 | báo cáo doanh thu (US-1003) | `dashboard` widget doanh thu/đơn/khách. |
| 2.4 | — | Xoá type `PendingPermission` (không còn chuỗi nào). |

### Tier 3 — tích hợp

Chi tiết đơn: trạng thái thanh toán VNPay/MoMo, thu COD, tạo và theo dõi vận đơn GHN, Cờ cần xử lý (xem, lọc theo loại, gỡ — US-601 AC2) (giữ `OrderPaymentInfo`, `PaymentStatusBadge`, `OrderShippingInfo`).

### Tier 4 — sau bán hàng và pháp lý

Feature mới `returns` (Đổi trả theo dòng đơn, Hoàn tiền thủ công), `audit` (chỉ đọc, lọc theo người thực hiện/loại thao tác), `compliance` (yêu cầu xoá dữ liệu, log truy cập dữ liệu cá nhân). Kiểm duyệt đánh giá sản phẩm (slice R) grill riêng.

### Cleanup cuối và Phase 7

Grep `StoreScope`, `X-Store-Id`, `prototype`, `Promotion`, `Coupon`, `PendingPermission` sạch; `knip`, `tsc` sạch. Sau đó Phase 7: CMS component + API integration test, Playwright cho các dòng Verification matrix.

## 7. Phụ thuộc chặn sang `be-demo`

| Cần | Tier | Dùng cho |
| --- | --- | --- |
| Nhu cầu hợp đồng Tier 1 (inventory, orders, settings, quyền) | 1 | issue 07 |
| `allowedActions[]` trong DTO đơn admin | 1 | C8 |
| `OrderFlag` | 3 | C15 |
| Quyền `OPERATIONS_*` cho inventory/order/settings | 1 | Thay `PendingPermission` |
| API danh sách Khách hàng cho back-office | 2 | `customers` |
| Báo cáo doanh thu | 2 | `dashboard` |

## 8. Rủi ro

- Code `K` chờ tier sau vẫn dựa vào type viết tay; nếu `knip` báo export không dùng thì giữ nguyên tới tier của nó, không xoá sớm.
- Xoá spec theo C11 làm giảm coverage; ngưỡng coverage CI (nếu có) có thể cần hạ tạm, ghi lại để khôi phục ở Phase 7.
- Mỗi lần nâng pin OpenAPI có thể làm gãy feature đã nối; nâng pin trong PR riêng hoặc cùng PR feature cần nó, chạy lại `typecheck` toàn repo.
