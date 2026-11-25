# Kiểm kê tĩnh CMS trước migration

Ngày: 26/11/2026. Checkout: `dev` tại `aa5fa92`; remote-tracking hiện báo behind 3, chưa fetch/pull. Chỉ đọc source, không xác nhận remote/CI hoặc behavior runtime.

Tổng số file dưới `src`: **295**, gồm **43** file `.spec.ts`. Bao gồm generated, JSON, CSS và assets; không phải toàn bộ là production code.

## Theo nghiệp vụ

| Module hiện tại | Số file gồm test | Đích owner               |
| --------------- | ---------------: | ------------------------ |
| accounts        |               14 | `src/modules/accounts`   |
| auth            |               19 | `src/modules/auth`       |
| categories      |               17 | `src/modules/categories` |
| colors          |               11 | `src/modules/colors`     |
| customers       |               14 | `src/modules/customers`  |
| dashboard       |               10 | `src/modules/dashboard`  |
| inventory       |               14 | `src/modules/inventory`  |
| orders          |               19 | `src/modules/orders`     |
| products        |               30 | `src/modules/products`   |
| roles           |               16 | `src/modules/roles`      |
| settings        |                7 | `src/modules/settings`   |
| sizes           |               11 | `src/modules/sizes`      |
| vouchers        |               13 | `src/modules/vouchers`   |

## Dependency chéo module quan sát từ alias

Trích dẫn tĩnh các chuỗi alias `@features/...` trong source (có thể gồm test/comment); không phải AST/import graph đầy đủ. Inventory delivery phải kiểm import tương đối, dynamic import, exports và cycle trước khi dùng làm allowlist.

### accounts → auth

- `src/features/accounts/composables/UseInternalAccountEditor.ts:11` → `UseAuth`
- `src/features/accounts/views/InternalAccountListView.vue:7` → `UseAuth`

### accounts → roles

- `src/features/accounts/components/InternalAccountRoles.vue:6` → `types/Role.types`
- `src/features/accounts/composables/UseInternalAccountEditor.ts:12` → `UseRoles`

### app → accounts

- `src/app/router/Routes.ts:3` → `InternalAccounts.routes`

### app → auth

- `src/app/router/Guards.spec.ts:14` → `UseAuth`
- `src/app/router/Guards.ts:3` → `UseAuth`
- `src/app/router/Routes.ts:4` → `Auth.routes`
- `src/app/views/Layout.spec.ts:8` → `UseAuth`

### app → categories

- `src/app/router/Routes.ts:5` → `Categories.routes`

### app → colors

- `src/app/router/Routes.ts:6` → `Colors.routes`

### app → customers

- `src/app/router/Routes.ts:7` → `Customers.routes`

### app → dashboard

- `src/app/router/Routes.ts:9` → `Dashboard.routes`

### app → inventory

- `src/app/router/Routes.ts:10` → `Inventory.routes`

### app → orders

- `src/app/router/Routes.ts:11` → `Orders.routes`

### app → products

- `src/app/router/Routes.ts:12` → `Products.routes`

### app → roles

- `src/app/router/Routes.ts:13` → `Roles.routes`

### app → settings

- `src/app/router/Routes.ts:14` → `Settings.routes`

### app → sizes

- `src/app/router/Routes.ts:15` → `Sizes.routes`

### app → vouchers

- `src/app/router/Routes.ts:16` → `Vouchers.routes`

### categories → auth

- `src/features/categories/composables/UseCategoryEditor.ts:5` → `UseAuth`
- `src/features/categories/views/CategoryListView.vue:2` → `UseAuth`

### colors → auth

- `src/features/colors/composables/UseColorEditor.ts:5` → `UseAuth`
- `src/features/colors/views/ColorListView.vue:4` → `UseAuth`

### customers → auth

- `src/features/customers/views/CustomerDetailView.vue:6` → `UseAuth`

### customers → orders

- `src/features/customers/components/CustomerOrderTable.vue:10` → `types/Order.types`
- `src/features/customers/views/CustomerDetailView.vue:12` → `UseOrders`

### dashboard → auth

- `src/features/dashboard/views/DashboardView.spec.ts:5` → `UseAuth`
- `src/features/dashboard/views/DashboardView.vue:4` → `UseAuth`

### inventory → auth

- `src/features/inventory/views/InventoryListView.vue:5` → `UseAuth`

### layouts → auth

- `src/layouts/Navigation.ts:7` → `UseAuth`
- `src/layouts/components/UserMenu.vue:8` → `UseAuth`

### products → auth

- `src/features/products/composables/UseProductCreate.ts:5` → `UseAuth`
- `src/features/products/composables/UseProductEditor.ts:5` → `UseAuth`
- `src/features/products/composables/UseProductSalePrices.ts:5` → `UseAuth`
- `src/features/products/views/ProductListView.vue:4` → `UseAuth`

### products → categories

- `src/features/products/components/ProductFilters.vue:11` → `types/Category.types`
- `src/features/products/components/ProductInfoForm.vue:14` → `types/Category.types`
- `src/features/products/components/ProductTable.vue:11` → `types/Category.types`
- `src/features/products/composables/UseProductCreate.ts:6` → `UseCategories`
- `src/features/products/composables/UseProductEditor.ts:6` → `UseCategories`
- `src/features/products/views/ProductListView.vue:5` → `UseCategories`

### products → colors

- `src/features/products/components/ProductVariants.vue:13` → `types/Color.types`
- `src/features/products/composables/UseProductVariants.ts:5` → `UseColors`

### products → sizes

- `src/features/products/components/ProductVariants.vue:16` → `types/Size.types`
- `src/features/products/composables/UseProductVariants.ts:8` → `UseSizes`

### roles → auth

- `src/features/roles/composables/UseRoleEditor.ts:5` → `UseAuth`
- `src/features/roles/views/RoleListView.vue:4` → `UseAuth`

### settings → auth

- `src/features/settings/composables/UseStoreSettingsEditor.ts:4` → `UseAuth`

### sizes → auth

- `src/features/sizes/composables/UseSizeEditor.ts:5` → `UseAuth`
- `src/features/sizes/views/SizeListView.vue:4` → `UseAuth`

### test → auth

- `src/test/Render.ts:15` → `types/Auth.types`
- `src/test/RenderFeature.ts:7` → `UseAuth`
- `src/test/factories/User.factory.ts:3` → `types/Auth.types`

### vouchers → auth

- `src/features/vouchers/composables/UseVoucherEditor.ts:5` → `UseAuth`
- `src/features/vouchers/views/VoucherListView.vue:4` → `UseAuth`

## Mapping cấu hình cần sửa cùng slice

| Owner                     | Đường dẫn/config phải rà                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Naming và module boundary | `eslint.config.ts`, `eslint.config.spec.ts`, `tsconfig.app.json`, import-sort internalPattern               |
| Generated output          | `scripts/GenApi.ts`, `.github/workflows/ci.yml` openapi-contract, `vitest.config.ts` coverage, ignore rules |
| Testing                   | `vitest.config.ts` setupFiles/PWA stub, `@test`, source test imports và ESLint production/test exemptions   |
| UI config/style           | `vite.config.ts` import Ui.config, `.prettierrc.json` tailwindStylesheet, `src/assets/styles/main.css`      |
| i18n                      | `src/shared/lib/i18n/I18n.ts`, `src/locales/*.json`, mọi consumer locale và header Accept-Language          |
| PWA/theme                 | vite PWA config, registration stub, logo path, theme storage key/script `index.html`                        |
| Tooling/E2E               | `knip.json`, `playwright.config.ts`, root e2e imports/mock routes, CI/hook commands                         |

Snapshot aa5fa92 chưa có `.github/workflows/contract-bump.yml`. Khi chuẩn bị PR đã chuyển task branch lên origin/dev tại 4f44bb7: workflow này và `scripts/contract-bump.sh` đã có. Script còn hard-code generated output ở phần PR body và git add; issue 03 phải cập nhật các references này cùng generator/CI. Đối chiếu `git diff aa5fa92 origin/dev` ngày 26/11/2026: `src/` không đổi (vẫn 295 file), nên danh sách file bên dưới còn đúng tại 4f44bb7. Ngoài `src/`, các thay đổi ảnh hưởng mapping config:

- `vite.config.ts`: thêm `server.port: 3001` và `strictPort: true`. Khi chuyển UI config sang `app/config` phải giữ hai giá trị này.
- `docs/CONVENTIONS.md`: thêm mục contract-bump (`contract-bump.yml`, `scripts/contract-bump.sh`, nhãn `breaking-contract`). Mục này phải đổi đường dẫn generated cùng issue 03.
- `docs/CONVENTIONS.md` mô tả upload ảnh dùng `MediaUpload.ts` + `fetch` presigned PUT, nhưng source dùng XHR presigned POST trong `ProductImages.api.ts:postToStorage`. Issue 07 sửa lại doc theo source.

Issue 01 vẫn refresh lại trên source mới nhất trước khi implementation. Không đổi Contract Version khi chỉ di chuyển source.

## Danh sách mọi file và owner đích sơ bộ

Bảng chỉ phân owner cấp vùng; chưa phải mapping tên file/chức năng cuối cùng. Cụ thể file có nhiều trách nhiệm như `*.api.ts` phải tách request/mapping sang integration và Vue Query sang module; không thể move 1:1 theo bảng này. File test đi theo source sau khi tách.

| Source                                                           | Owner/vùng đích sơ bộ                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/App.vue`                                                    | src entry                                                               |
| `src/app/Runtime.spec.ts`                                        | app                                                                     |
| `src/app/Runtime.ts`                                             | app                                                                     |
| `src/app/config/Env.config.spec.ts`                              | app/config                                                              |
| `src/app/config/Env.config.ts`                                   | app/config                                                              |
| `src/app/config/Ui.config.ts`                                    | app/config                                                              |
| `src/app/providers/ErrorHandling.spec.ts`                        | app/providers                                                           |
| `src/app/providers/ErrorHandling.ts`                             | app/providers                                                           |
| `src/app/router/Guards.spec.ts`                                  | app/router                                                              |
| `src/app/router/Guards.ts`                                       | app/router                                                              |
| `src/app/router/RouteMeta.d.ts`                                  | app/router                                                              |
| `src/app/router/Router.ts`                                       | app/router                                                              |
| `src/app/router/Routes.ts`                                       | app/router                                                              |
| `src/app/views/CmsRouting.spec.ts`                               | app/views                                                               |
| `src/app/views/ForbiddenView.vue`                                | app/views                                                               |
| `src/app/views/Layout.spec.ts`                                   | app/views                                                               |
| `src/app/views/NotFoundView.vue`                                 | app/views                                                               |
| `src/assets/images/Logo.svg`                                     | assets/images                                                           |
| `src/assets/styles/main.css`                                     | styles                                                                  |
| `src/env.d.ts`                                                   | src entry                                                               |
| `src/features/accounts/InternalAccounts.routes.ts`               | modules/accounts                                                        |
| `src/features/accounts/api/InternalAccount.mapper.ts`            | modules/accounts + integrations/backend (phân loại/tách API và query)   |
| `src/features/accounts/api/InternalAccounts.api.ts`              | modules/accounts + integrations/backend (phân loại/tách API và query)   |
| `src/features/accounts/components/InternalAccountForm.vue`       | modules/accounts                                                        |
| `src/features/accounts/components/InternalAccountRoles.vue`      | modules/accounts                                                        |
| `src/features/accounts/components/InternalAccountTable.vue`      | modules/accounts                                                        |
| `src/features/accounts/composables/UseInternalAccountCreate.ts`  | modules/accounts                                                        |
| `src/features/accounts/composables/UseInternalAccountEditor.ts`  | modules/accounts                                                        |
| `src/features/accounts/schemas/InternalAccount.schema.ts`        | modules/accounts                                                        |
| `src/features/accounts/types/InternalAccount.types.ts`           | modules/accounts                                                        |
| `src/features/accounts/views/InternalAccountCreateView.vue`      | modules/accounts                                                        |
| `src/features/accounts/views/InternalAccountEditView.vue`        | modules/accounts                                                        |
| `src/features/accounts/views/InternalAccountListView.spec.ts`    | modules/accounts                                                        |
| `src/features/accounts/views/InternalAccountListView.vue`        | modules/accounts                                                        |
| `src/features/auth/Auth.routes.ts`                               | modules/auth                                                            |
| `src/features/auth/SafeRedirect.spec.ts`                         | modules/auth                                                            |
| `src/features/auth/SafeRedirect.ts`                              | modules/auth                                                            |
| `src/features/auth/UseAuth.spec.ts`                              | modules/auth                                                            |
| `src/features/auth/UseAuth.ts`                                   | modules/auth                                                            |
| `src/features/auth/api/Auth.api.ts`                              | modules/auth + integrations/backend (phân loại/tách API và query)       |
| `src/features/auth/api/Auth.mapper.spec.ts`                      | modules/auth + integrations/backend (phân loại/tách API và query)       |
| `src/features/auth/api/Auth.mapper.ts`                           | modules/auth + integrations/backend (phân loại/tách API và query)       |
| `src/features/auth/components/LoginForm.vue`                     | modules/auth                                                            |
| `src/features/auth/schemas/Login.schema.spec.ts`                 | modules/auth                                                            |
| `src/features/auth/schemas/Login.schema.ts`                      | modules/auth                                                            |
| `src/features/auth/stores/Auth.store.ts`                         | modules/auth                                                            |
| `src/features/auth/types/Auth.types.ts`                          | modules/auth                                                            |
| `src/features/auth/views/ForgotPasswordView.spec.ts`             | modules/auth                                                            |
| `src/features/auth/views/ForgotPasswordView.vue`                 | modules/auth                                                            |
| `src/features/auth/views/LoginView.spec.ts`                      | modules/auth                                                            |
| `src/features/auth/views/LoginView.vue`                          | modules/auth                                                            |
| `src/features/auth/views/ResetPasswordView.spec.ts`              | modules/auth                                                            |
| `src/features/auth/views/ResetPasswordView.vue`                  | modules/auth                                                            |
| `src/features/categories/Categories.routes.ts`                   | modules/categories                                                      |
| `src/features/categories/UseCategories.ts`                       | modules/categories                                                      |
| `src/features/categories/api/Categories.api.ts`                  | modules/categories + integrations/backend (phân loại/tách API và query) |
| `src/features/categories/api/Category.mapper.ts`                 | modules/categories + integrations/backend (phân loại/tách API và query) |
| `src/features/categories/api/CategoryEditor.api.ts`              | modules/categories + integrations/backend (phân loại/tách API và query) |
| `src/features/categories/components/CategoryForm.vue`            | modules/categories                                                      |
| `src/features/categories/components/CategoryTree.vue`            | modules/categories                                                      |
| `src/features/categories/components/CategoryTreeToolbar.vue`     | modules/categories                                                      |
| `src/features/categories/composables/UseCategoryEditor.ts`       | modules/categories                                                      |
| `src/features/categories/schemas/Category.schema.ts`             | modules/categories                                                      |
| `src/features/categories/schemas/CategoryTree.ts`                | modules/categories                                                      |
| `src/features/categories/types/Category.types.ts`                | modules/categories                                                      |
| `src/features/categories/views/CategoryCreateView.vue`           | modules/categories                                                      |
| `src/features/categories/views/CategoryEditView.spec.ts`         | modules/categories                                                      |
| `src/features/categories/views/CategoryEditView.vue`             | modules/categories                                                      |
| `src/features/categories/views/CategoryListView.spec.ts`         | modules/categories                                                      |
| `src/features/categories/views/CategoryListView.vue`             | modules/categories                                                      |
| `src/features/colors/Colors.routes.ts`                           | modules/colors                                                          |
| `src/features/colors/UseColors.ts`                               | modules/colors                                                          |
| `src/features/colors/api/Color.mapper.ts`                        | modules/colors + integrations/backend (phân loại/tách API và query)     |
| `src/features/colors/api/Colors.api.ts`                          | modules/colors + integrations/backend (phân loại/tách API và query)     |
| `src/features/colors/components/ColorForm.vue`                   | modules/colors                                                          |
| `src/features/colors/components/ColorTable.vue`                  | modules/colors                                                          |
| `src/features/colors/composables/UseColorEditor.ts`              | modules/colors                                                          |
| `src/features/colors/schemas/Color.schema.ts`                    | modules/colors                                                          |
| `src/features/colors/types/Color.types.ts`                       | modules/colors                                                          |
| `src/features/colors/views/ColorEditView.vue`                    | modules/colors                                                          |
| `src/features/colors/views/ColorListView.vue`                    | modules/colors                                                          |
| `src/features/customers/Customers.routes.ts`                     | modules/customers                                                       |
| `src/features/customers/api/Customers.api.ts`                    | modules/customers + integrations/backend (phân loại/tách API và query)  |
| `src/features/customers/components/CustomerActivity.vue`         | modules/customers                                                       |
| `src/features/customers/components/CustomerAddressList.vue`      | modules/customers                                                       |
| `src/features/customers/components/CustomerFilters.vue`          | modules/customers                                                       |
| `src/features/customers/components/CustomerOrderTable.vue`       | modules/customers                                                       |
| `src/features/customers/components/CustomerProfile.vue`          | modules/customers                                                       |
| `src/features/customers/components/CustomerTable.vue`            | modules/customers                                                       |
| `src/features/customers/schemas/CustomerList.schema.ts`          | modules/customers                                                       |
| `src/features/customers/types/Customer.types.ts`                 | modules/customers                                                       |
| `src/features/customers/views/CustomerDetailView.spec.ts`        | modules/customers                                                       |
| `src/features/customers/views/CustomerDetailView.vue`            | modules/customers                                                       |
| `src/features/customers/views/CustomerListView.spec.ts`          | modules/customers                                                       |
| `src/features/customers/views/CustomerListView.vue`              | modules/customers                                                       |
| `src/features/dashboard/Dashboard.routes.ts`                     | modules/dashboard                                                       |
| `src/features/dashboard/api/Dashboard.api.ts`                    | modules/dashboard + integrations/backend (phân loại/tách API và query)  |
| `src/features/dashboard/components/DashboardList.vue`            | modules/dashboard                                                       |
| `src/features/dashboard/components/OrderChart.vue`               | modules/dashboard                                                       |
| `src/features/dashboard/components/RevenueChart.vue`             | modules/dashboard                                                       |
| `src/features/dashboard/components/StatCard.spec.ts`             | modules/dashboard                                                       |
| `src/features/dashboard/components/StatCard.vue`                 | modules/dashboard                                                       |
| `src/features/dashboard/types/Dashboard.types.ts`                | modules/dashboard                                                       |
| `src/features/dashboard/views/DashboardView.spec.ts`             | modules/dashboard                                                       |
| `src/features/dashboard/views/DashboardView.vue`                 | modules/dashboard                                                       |
| `src/features/inventory/Inventory.routes.ts`                     | modules/inventory                                                       |
| `src/features/inventory/api/Inventory.api.ts`                    | modules/inventory + integrations/backend (phân loại/tách API và query)  |
| `src/features/inventory/components/InventoryFilters.vue`         | modules/inventory                                                       |
| `src/features/inventory/components/InventoryMovementFilters.vue` | modules/inventory                                                       |
| `src/features/inventory/components/InventoryMovementTable.vue`   | modules/inventory                                                       |
| `src/features/inventory/components/InventoryTable.vue`           | modules/inventory                                                       |
| `src/features/inventory/components/StockAdjustDialog.vue`        | modules/inventory                                                       |
| `src/features/inventory/components/StockStatusBadge.vue`         | modules/inventory                                                       |
| `src/features/inventory/schemas/Inventory.schema.ts`             | modules/inventory                                                       |
| `src/features/inventory/types/Inventory.types.ts`                | modules/inventory                                                       |
| `src/features/inventory/views/InventoryListView.spec.ts`         | modules/inventory                                                       |
| `src/features/inventory/views/InventoryListView.vue`             | modules/inventory                                                       |
| `src/features/inventory/views/InventoryMovementListView.spec.ts` | modules/inventory                                                       |
| `src/features/inventory/views/InventoryMovementListView.vue`     | modules/inventory                                                       |
| `src/features/orders/Orders.routes.ts`                           | modules/orders                                                          |
| `src/features/orders/UseOrders.ts`                               | modules/orders                                                          |
| `src/features/orders/api/Orders.api.ts`                          | modules/orders + integrations/backend (phân loại/tách API và query)     |
| `src/features/orders/components/OrderCustomerInfo.vue`           | modules/orders                                                          |
| `src/features/orders/components/OrderFilters.vue`                | modules/orders                                                          |
| `src/features/orders/components/OrderItems.vue`                  | modules/orders                                                          |
| `src/features/orders/components/OrderPaymentInfo.vue`            | modules/orders                                                          |
| `src/features/orders/components/OrderShippingInfo.vue`           | modules/orders                                                          |
| `src/features/orders/components/OrderStatusBadge.vue`            | modules/orders                                                          |
| `src/features/orders/components/OrderSummary.vue`                | modules/orders                                                          |
| `src/features/orders/components/OrderTable.vue`                  | modules/orders                                                          |
| `src/features/orders/components/OrderTimeline.vue`               | modules/orders                                                          |
| `src/features/orders/components/PaymentStatusBadge.vue`          | modules/orders                                                          |
| `src/features/orders/schemas/OrderList.schema.ts`                | modules/orders                                                          |
| `src/features/orders/types/Order.types.ts`                       | modules/orders                                                          |
| `src/features/orders/views/OrderDetailView.spec.ts`              | modules/orders                                                          |
| `src/features/orders/views/OrderDetailView.vue`                  | modules/orders                                                          |
| `src/features/orders/views/OrderListView.spec.ts`                | modules/orders                                                          |
| `src/features/orders/views/OrderListView.vue`                    | modules/orders                                                          |
| `src/features/products/Products.routes.ts`                       | modules/products                                                        |
| `src/features/products/api/Product.mapper.ts`                    | modules/products + integrations/backend (phân loại/tách API và query)   |
| `src/features/products/api/ProductEditor.api.ts`                 | modules/products + integrations/backend (phân loại/tách API và query)   |
| `src/features/products/api/ProductImages.api.ts`                 | modules/products + integrations/backend (phân loại/tách API và query)   |
| `src/features/products/api/Products.api.ts`                      | modules/products + integrations/backend (phân loại/tách API và query)   |
| `src/features/products/api/SalePrices.api.ts`                    | modules/products + integrations/backend (phân loại/tách API và query)   |
| `src/features/products/components/ImageUploader.vue`             | modules/products                                                        |
| `src/features/products/components/ProductFilters.vue`            | modules/products                                                        |
| `src/features/products/components/ProductImages.vue`             | modules/products                                                        |
| `src/features/products/components/ProductInfoForm.vue`           | modules/products                                                        |
| `src/features/products/components/ProductSalePrices.vue`         | modules/products                                                        |
| `src/features/products/components/ProductStatusBadge.vue`        | modules/products                                                        |
| `src/features/products/components/ProductTable.vue`              | modules/products                                                        |
| `src/features/products/components/ProductVariants.vue`           | modules/products                                                        |
| `src/features/products/composables/UseProductCreate.ts`          | modules/products                                                        |
| `src/features/products/composables/UseProductEditor.ts`          | modules/products                                                        |
| `src/features/products/composables/UseProductImages.ts`          | modules/products                                                        |
| `src/features/products/composables/UseProductSalePrices.ts`      | modules/products                                                        |
| `src/features/products/composables/UseProductVariants.ts`        | modules/products                                                        |
| `src/features/products/schemas/Product.schema.ts`                | modules/products                                                        |
| `src/features/products/schemas/ProductList.schema.ts`            | modules/products                                                        |
| `src/features/products/schemas/SalePrice.schema.ts`              | modules/products                                                        |
| `src/features/products/types/Product.types.ts`                   | modules/products                                                        |
| `src/features/products/types/SalePrice.types.ts`                 | modules/products                                                        |
| `src/features/products/types/SalePriceView.types.ts`             | modules/products                                                        |
| `src/features/products/views/ProductCreateView.vue`              | modules/products                                                        |
| `src/features/products/views/ProductEditView.spec.ts`            | modules/products                                                        |
| `src/features/products/views/ProductEditView.vue`                | modules/products                                                        |
| `src/features/products/views/ProductListView.spec.ts`            | modules/products                                                        |
| `src/features/products/views/ProductListView.vue`                | modules/products                                                        |
| `src/features/roles/Roles.routes.ts`                             | modules/roles                                                           |
| `src/features/roles/UseRoles.ts`                                 | modules/roles                                                           |
| `src/features/roles/api/Role.mapper.ts`                          | modules/roles + integrations/backend (phân loại/tách API và query)      |
| `src/features/roles/api/Roles.api.ts`                            | modules/roles + integrations/backend (phân loại/tách API và query)      |
| `src/features/roles/components/PermissionMatrix.vue`             | modules/roles                                                           |
| `src/features/roles/components/RoleForm.vue`                     | modules/roles                                                           |
| `src/features/roles/components/RoleTable.vue`                    | modules/roles                                                           |
| `src/features/roles/composables/UseRoleEditor.ts`                | modules/roles                                                           |
| `src/features/roles/schemas/Role.schema.ts`                      | modules/roles                                                           |
| `src/features/roles/types/Role.types.ts`                         | modules/roles                                                           |
| `src/features/roles/views/RoleCreateView.spec.ts`                | modules/roles                                                           |
| `src/features/roles/views/RoleCreateView.vue`                    | modules/roles                                                           |
| `src/features/roles/views/RoleEditView.spec.ts`                  | modules/roles                                                           |
| `src/features/roles/views/RoleEditView.vue`                      | modules/roles                                                           |
| `src/features/roles/views/RoleListView.spec.ts`                  | modules/roles                                                           |
| `src/features/roles/views/RoleListView.vue`                      | modules/roles                                                           |
| `src/features/settings/Settings.routes.ts`                       | modules/settings                                                        |
| `src/features/settings/api/Settings.api.ts`                      | modules/settings + integrations/backend (phân loại/tách API và query)   |
| `src/features/settings/components/StoreSettingsForm.vue`         | modules/settings                                                        |
| `src/features/settings/composables/UseStoreSettingsEditor.ts`    | modules/settings                                                        |
| `src/features/settings/schemas/Settings.schema.ts`               | modules/settings                                                        |
| `src/features/settings/views/StoreSettingsView.spec.ts`          | modules/settings                                                        |
| `src/features/settings/views/StoreSettingsView.vue`              | modules/settings                                                        |
| `src/features/sizes/Sizes.routes.ts`                             | modules/sizes                                                           |
| `src/features/sizes/UseSizes.ts`                                 | modules/sizes                                                           |
| `src/features/sizes/api/Size.mapper.ts`                          | modules/sizes + integrations/backend (phân loại/tách API và query)      |
| `src/features/sizes/api/Sizes.api.ts`                            | modules/sizes + integrations/backend (phân loại/tách API và query)      |
| `src/features/sizes/components/SizeForm.vue`                     | modules/sizes                                                           |
| `src/features/sizes/components/SizeTable.vue`                    | modules/sizes                                                           |
| `src/features/sizes/composables/UseSizeEditor.ts`                | modules/sizes                                                           |
| `src/features/sizes/schemas/Size.schema.ts`                      | modules/sizes                                                           |
| `src/features/sizes/types/Size.types.ts`                         | modules/sizes                                                           |
| `src/features/sizes/views/SizeEditView.vue`                      | modules/sizes                                                           |
| `src/features/sizes/views/SizeListView.vue`                      | modules/sizes                                                           |
| `src/features/vouchers/Vouchers.routes.ts`                       | modules/vouchers                                                        |
| `src/features/vouchers/api/Voucher.mapper.ts`                    | modules/vouchers + integrations/backend (phân loại/tách API và query)   |
| `src/features/vouchers/api/Vouchers.api.ts`                      | modules/vouchers + integrations/backend (phân loại/tách API và query)   |
| `src/features/vouchers/components/VoucherFilters.vue`            | modules/vouchers                                                        |
| `src/features/vouchers/components/VoucherForm.vue`               | modules/vouchers                                                        |
| `src/features/vouchers/components/VoucherStatusBadge.vue`        | modules/vouchers                                                        |
| `src/features/vouchers/components/VoucherTable.vue`              | modules/vouchers                                                        |
| `src/features/vouchers/composables/UseVoucherEditor.ts`          | modules/vouchers                                                        |
| `src/features/vouchers/schemas/Voucher.schema.ts`                | modules/vouchers                                                        |
| `src/features/vouchers/types/Voucher.types.ts`                   | modules/vouchers                                                        |
| `src/features/vouchers/views/VoucherCreateView.vue`              | modules/vouchers                                                        |
| `src/features/vouchers/views/VoucherEditView.vue`                | modules/vouchers                                                        |
| `src/features/vouchers/views/VoucherListView.vue`                | modules/vouchers                                                        |
| `src/layouts/AuthLayout.vue`                                     | layouts                                                                 |
| `src/layouts/DashboardLayout.vue`                                | layouts                                                                 |
| `src/layouts/Navigation.spec.ts`                                 | layouts                                                                 |
| `src/layouts/Navigation.ts`                                      | layouts                                                                 |
| `src/layouts/components/AppBreadcrumb.vue`                       | layouts/components                                                      |
| `src/layouts/components/AppHeader.vue`                           | layouts/components                                                      |
| `src/layouts/components/AppShell.vue`                            | layouts/components                                                      |
| `src/layouts/components/AppSidebar.vue`                          | layouts/components                                                      |
| `src/layouts/components/LanguageSwitcher.vue`                    | layouts/components                                                      |
| `src/layouts/components/SidebarNav.vue`                          | layouts/components                                                      |
| `src/layouts/components/ThemeSwitcher.vue`                       | layouts/components                                                      |
| `src/layouts/components/UserMenu.vue`                            | layouts/components                                                      |
| `src/locales/en.json`                                            | i18n                                                                    |
| `src/locales/vi.json`                                            | i18n                                                                    |
| `src/main.ts`                                                    | src entry                                                               |
| `src/shared/components/confirm/ConfirmDialog.vue`                | shared/components/confirm                                               |
| `src/shared/components/confirm/UseConfirm.spec.ts`               | shared/components/confirm                                               |
| `src/shared/components/confirm/UseConfirm.ts`                    | shared/components/confirm                                               |
| `src/shared/components/feedback/EmptyState.vue`                  | shared/components/feedback                                              |
| `src/shared/components/feedback/ErrorState.spec.ts`              | shared/components/feedback                                              |
| `src/shared/components/feedback/ErrorState.vue`                  | shared/components/feedback                                              |
| `src/shared/components/feedback/LoadingState.vue`                | shared/components/feedback                                              |
| `src/shared/components/feedback/OfflineBanner.spec.ts`           | shared/components/feedback                                              |
| `src/shared/components/feedback/OfflineBanner.vue`               | shared/components/feedback                                              |
| `src/shared/components/feedback/StatusBadge.vue`                 | shared/components/feedback                                              |
| `src/shared/components/form/FormActions.vue`                     | shared/components/form                                                  |
| `src/shared/components/form/FormSection.vue`                     | shared/components/form                                                  |
| `src/shared/components/list/ActiveFilterTags.vue`                | shared/components/list                                                  |
| `src/shared/components/list/FilterBar.vue`                       | shared/components/list                                                  |
| `src/shared/components/list/FilterDateRange.vue`                 | shared/components/list                                                  |
| `src/shared/components/list/FilterSelect.vue`                    | shared/components/list                                                  |
| `src/shared/components/list/ListSearch.vue`                      | shared/components/list                                                  |
| `src/shared/components/page/PageContainer.vue`                   | shared/components/page                                                  |
| `src/shared/components/page/PageHeader.vue`                      | shared/components/page                                                  |
| `src/shared/components/page/PageTabs.vue`                        | shared/components/page                                                  |
| `src/shared/components/table/DataTable.vue`                      | shared/components/table                                                 |
| `src/shared/components/table/DataTablePagination.spec.ts`        | shared/components/table                                                 |
| `src/shared/components/table/DataTablePagination.vue`            | shared/components/table                                                 |
| `src/shared/components/table/DataTableToolbar.vue`               | shared/components/table                                                 |
| `src/shared/components/table/RowActions.vue`                     | shared/components/table                                                 |
| `src/shared/components/table/SortHeader.ts`                      | shared/components/table                                                 |
| `src/shared/components/table/TableFoundationView.spec.ts`        | shared/components/table                                                 |
| `src/shared/components/table/TableLink.vue`                      | shared/components/table                                                 |
| `src/shared/composables/UseHydrateForm.ts`                       | shared/composables                                                      |
| `src/shared/composables/UseListState.spec.ts`                    | shared/composables                                                      |
| `src/shared/composables/UseListState.ts`                         | shared/composables                                                      |
| `src/shared/composables/UseNotify.spec.ts`                       | shared/composables                                                      |
| `src/shared/composables/UseNotify.ts`                            | shared/composables                                                      |
| `src/shared/composables/UsePwa.ts`                               | pwa                                                                     |
| `src/shared/composables/UseTheme.ts`                             | shared/composables                                                      |
| `src/shared/composables/UseUnsavedGuard.ts`                      | shared/composables                                                      |
| `src/shared/lib/api/Api.generated.ts`                            | integrations/backend                                                    |
| `src/shared/lib/api/Permission.ts`                               | integrations/backend                                                    |
| `src/shared/lib/api/client/HttpClient.spec.ts`                   | integrations/backend                                                    |
| `src/shared/lib/api/client/HttpClient.ts`                        | integrations/backend                                                    |
| `src/shared/lib/api/errors/ApiError.ts`                          | integrations/backend                                                    |
| `src/shared/lib/api/errors/ErrorCode.ts`                         | integrations/backend                                                    |
| `src/shared/lib/api/errors/ErrorPolicy.spec.ts`                  | integrations/backend                                                    |
| `src/shared/lib/api/errors/ErrorPolicy.ts`                       | integrations/backend                                                    |
| `src/shared/lib/form/ApplyApiErrorToForm.ts`                     | shared/form                                                             |
| `src/shared/lib/format/DateTimeLocal.ts`                         | shared/formatting                                                       |
| `src/shared/lib/format/Format.spec.ts`                           | shared/formatting                                                       |
| `src/shared/lib/format/Format.ts`                                | shared/formatting                                                       |
| `src/shared/lib/i18n/I18n.spec.ts`                               | i18n                                                                    |
| `src/shared/lib/i18n/I18n.ts`                                    | i18n                                                                    |
| `src/shared/lib/query/QueryClient.ts`                            | app/providers (runtime types cần phân loại)                             |
| `src/shared/lib/query/VueQuery.d.ts`                             | app/providers (runtime types cần phân loại)                             |
| `src/shared/lib/session/Session.spec.ts`                         | integrations/backend/session                                            |
| `src/shared/lib/session/Session.store.ts`                        | integrations/backend/session                                            |
| `src/shared/lib/session/Session.ts`                              | integrations/backend/session                                            |
| `src/shared/types/Pagination.types.ts`                           | shared/types                                                            |
| `src/test/Intl.ts`                                               | testing                                                                 |
| `src/test/NumberField.ts`                                        | testing                                                                 |
| `src/test/PwaRegisterStub.ts`                                    | testing                                                                 |
| `src/test/Render.ts`                                             | testing                                                                 |
| `src/test/RenderFeature.ts`                                      | testing                                                                 |
| `src/test/Select.ts`                                             | testing                                                                 |
| `src/test/Setup.ts`                                              | testing                                                                 |
| `src/test/factories/Category.factory.ts`                         | testing                                                                 |
| `src/test/factories/User.factory.ts`                             | testing                                                                 |

## Còn phải xác minh trước source migration

- Mapping từng file/symbol vào workflow, public entries và owner gần nhất; không tự coi mọi type là public.
- Baseline lint/typecheck/tests/build/E2E; kết quả green/red thực tế chưa chạy trong phiên docs này.
- Contract readiness của từng endpoint, đặc biệt module pending; source có generated import không chứng minh mọi operation đã được typed.
- Proof typed HTTP giữ status 200/201/204, body/query/path params, cancellation, errors và refresh.
- Rebase/inventory refresh sau khi cập nhật checkout; giữ mọi thay đổi ngoài scope.
