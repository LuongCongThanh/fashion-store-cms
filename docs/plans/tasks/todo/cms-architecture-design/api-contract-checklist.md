# Checklist coverage API Contract của CMS

Status: initial-inventory — đã liệt kê mọi call site trong source tại `4f44bb7` và operation ứng viên ở Contract Version đã pin; chưa triển khai typed boundary.

## Phạm vi và cách hoàn thiện

Issue 01 phải xác nhận lại **mọi Backend operation đang được source CMS gọi hoặc hỗ trợ**, không chỉ endpoint pilot. Bao gồm login/logout/refresh ở runtime, API trong mọi module, helper gọi HTTP và consumer trực tiếp. Chuẩn hoá method + contract path (kể cả prefix/baseURL/path params) sau khi đối chiếu generated `paths`; lưu mọi call site/owner, không chỉ grep string. Source đang gated vẫn phải có dòng và bằng chứng gating.

Bảng đã phủ mọi call site đọc được bằng khảo sát tĩnh; issue 01 refresh trên source mới nhất và bổ sung evidence trước khi đóng. Không bỏ một operation khỏi bảng chỉ vì đã chuyển folder hoặc không có DTO import.

## Trạng thái

- `unverified`: chưa đối chiếu contract/call sites, không đạt gate.
- `legacy-untyped`: operation đã có contract nhưng còn path/body/response tự do hoặc ép kiểu che thiếu checking; chỉ được tồn tại trong slice chưa đến lượt, không đạt gate cuối.
- `typed`: method/path/path params/query/body/success response được nối với operation generated; có evidence signature/call sites và kiểm kiểu tương ứng, không chỉ annotation return type hoặc `as DTO`.
- `blocked-no-contract`: chưa có operation trong contract đã pin và chức năng vẫn bị chặn đúng policy; có call site/gate và ticket nhu cầu Backend, không được tính vào tổng typed.
- `external`: request ngoài Backend (ví dụ byte upload lên storage); ghi owner/adapter/test riêng, không ép vào generated Backend hoặc tính là typed Backend.
- `removed`: call site bị bỏ có lý do hợp lệ trong scope đã duyệt và evidence không còn consumer; không dùng để che chức năng đang cần giữ.

Nếu contract readiness không rõ thì giữ `unverified`; không tự phân `blocked-no-contract` từ việc thiếu generated type. Source migration không tự bump Contract Version hoặc mở tính năng pending.

## Bảng operation

Quét `src/features/*/api/*.api.ts`, `src/app/Runtime.ts` và helper path trên `4f44bb7`, đối chiếu `paths` trong `src/shared/lib/api/Api.generated.ts` (Contract Version `openapi-v0.7.0` theo `OPENAPI_URL`). Tổng: 67 dòng = 56 call site có operation ứng viên (55 operation khác nhau, `AdminProductController_findAll_v1` có hai consumer), 10 call site không có path ở contract đã pin, 1 request external.

Cột operation ứng viên chỉ khớp method + path trong generated; chưa chứng minh query/body/response của caller đúng, nên mọi dòng Backend vẫn `unverified`. Dòng "không có path ở v0.7.0" **không** tự chuyển `blocked-no-contract`: slice phụ trách phải xác nhận route/menu gating rồi mới đổi trạng thái. Path đã chuẩn hoá về dạng contract bỏ prefix `/api/v1`.

| Method + path source hiện tại | Owner/call site | Generated operation ứng viên (openapi-v0.7.0) | Ghi chú checking hiện tại | Trạng thái | Slice |
|---|---|---|---|---|---|
| POST /auth/login | src/features/auth/api/Auth.api.ts:createAuthApi.login | AuthController_login_v1 | Cast LoginResponseDto; giữ skipAuth | unverified | 06 |
| GET /auth/me | src/features/auth/api/Auth.api.ts:createAuthApi.me | AuthController_getMe_v1 | Cast MeResponseDto; giữ AbortSignal | unverified | 06 |
| POST /auth/forgot-password | src/features/auth/api/Auth.api.ts:createAuthApi.forgotPassword | AuthController_forgotPassword_v1 | Response unknown; giữ skipAuth, không tiết lộ email | unverified | 06 |
| POST /auth/reset-password | src/features/auth/api/Auth.api.ts:createAuthApi.resetPassword | AuthController_resetPassword_v1 | Body có annotation, path/response chưa checked | unverified | 06 |
| POST /auth/logout | src/features/auth/api/Auth.api.ts:createAuthApi.logout | AuthController_logout_v1 | Response unknown; giữ noRefresh, best-effort cleanup | unverified | 06 |
| POST /auth/refresh | src/app/Runtime.ts:callRefresh | AuthController_refresh_v1 | Cast `{ accessToken }`; giữ single-flight/skipAuth | unverified | 06 |
| GET /admin/products | src/features/products/api/Products.api.ts:useProductsQuery | AdminProductController_findAll_v1 | Cast PaginatedProductResponseDto | unverified | 07 |
| GET /admin/products/{id} | src/features/products/api/ProductEditor.api.ts:useProductQuery | AdminProductController_findOne_v1 | Cast ProductDetailResponseDto | unverified | 07 |
| POST /admin/products | src/features/products/api/ProductEditor.api.ts:useCreateProductMutation | AdminProductController_create_v1 | Body annotation, cast ProductResponseDto | unverified | 07 |
| PATCH /admin/products/{id} | ProductEditor.api.ts:useUpdateProductMutation, useProductStatusMutation | AdminProductController_update_v1 | Hai call site dùng chung path helper | unverified | 07 |
| POST /admin/products/{id}/archive | ProductEditor.api.ts:useProductStatusMutation | AdminProductController_archive_v1 | Body `{}` | unverified | 07 |
| POST /admin/products/{id}/unarchive | ProductEditor.api.ts:useUnarchiveProductMutation | AdminProductController_unarchive_v1 | Body `{}` | unverified | 07 |
| POST /admin/products/{id}/variants | ProductEditor.api.ts:useCreateVariantMutation | AdminProductController_createVariant_v1 | Body annotation | unverified | 07 |
| PATCH /admin/products/{id}/variants/{variantId} | ProductEditor.api.ts:useUpdateVariantMutation | AdminProductController_updateVariant_v1 | Body UpdateVariantDto | unverified | 07 |
| POST /admin/products/{id}/variants/{variantId}/archive | ProductEditor.api.ts:useUpdateVariantMutation | AdminProductController_archiveVariant_v1 | Path ghép động archive/unarchive | unverified | 07 |
| POST /admin/products/{id}/variants/{variantId}/unarchive | ProductEditor.api.ts:useUpdateVariantMutation | AdminProductController_unarchiveVariant_v1 | Path ghép động archive/unarchive | unverified | 07 |
| POST /admin/products/{id}/images/presign | src/features/products/api/ProductImages.api.ts:useUploadProductImageMutation | AdminProductController_presignImage_v1 | Cast PresignedImageUploadResponseDto; giữ signal | unverified | 07 |
| POST /admin/products/{id}/images | ProductImages.api.ts:useUploadProductImageMutation | AdminProductController_createImage_v1 | Giữ signal/cancel | unverified | 07 |
| PATCH /admin/products/{id}/images/{imageId} | ProductImages.api.ts:useUpdateProductImageMutation | AdminProductController_updateImage_v1 |  | unverified | 07 |
| DELETE /admin/products/{id}/images/{imageId} | ProductImages.api.ts:useRemoveProductImageMutation | AdminProductController_removeImage_v1 |  | unverified | 07 |
| GET /admin/products/{productId}/sale-prices | src/features/products/api/SalePrices.api.ts:useSalePricesQuery | AdminSalePriceController_list_v1 | Cast rows | unverified | 07 |
| POST /admin/products/{productId}/sale-prices | SalePrices.api.ts:useCreateSalePriceMutation | AdminSalePriceController_create_v1 |  | unverified | 07 |
| PATCH /admin/sale-prices/{id} | SalePrices.api.ts:useUpdateSalePriceMutation | AdminSalePriceController_update_v1 |  | unverified | 07 |
| POST /admin/sale-prices/{id}/end | SalePrices.api.ts:useEndSalePriceMutation | AdminSalePriceController_end_v1 | Body undefined | unverified | 07 |
| DELETE /admin/sale-prices/{id} | SalePrices.api.ts:useDeleteSalePriceMutation | AdminSalePriceController_remove_v1 |  | unverified | 07 |
| GET /admin/categories | src/features/categories/api/Categories.api.ts:useCategoriesQuery | AdminCategoryController_findAll_v1 | Cast response | unverified | 08 |
| GET /admin/categories/{id} | src/features/categories/api/CategoryEditor.api.ts:useCategoryDetailQuery | AdminCategoryController_findOne_v1 | Cast CategoryResponseDto | unverified | 08 |
| POST /admin/categories | CategoryEditor.api.ts:useSaveCategoryMutation | AdminCategoryController_create_v1 |  | unverified | 08 |
| PATCH /admin/categories/{id} | Categories.api.ts:useMoveCategoryMutation, CategoryEditor.api.ts:useSaveCategoryMutation | AdminCategoryController_update_v1 | Hai call site | unverified | 08 |
| DELETE /admin/categories/{id} | CategoryEditor.api.ts:useDeleteCategoryMutation | AdminCategoryController_remove_v1 |  | unverified | 08 |
| GET /admin/sizes | src/features/sizes/api/Sizes.api.ts | AdminProductOptionController_listSizes_v1 | Cast SizeResponseDto[] | unverified | 08 |
| POST /admin/sizes | Sizes.api.ts | AdminProductOptionController_createSize_v1 |  | unverified | 08 |
| PATCH /admin/sizes/{id} | Sizes.api.ts | AdminProductOptionController_updateSize_v1 |  | unverified | 08 |
| GET /admin/colors | src/features/colors/api/Colors.api.ts | AdminProductOptionController_listColors_v1 | Cast ColorResponseDto[] | unverified | 08 |
| POST /admin/colors | Colors.api.ts | AdminProductOptionController_createColor_v1 |  | unverified | 08 |
| PATCH /admin/colors/{id} | Colors.api.ts | AdminProductOptionController_updateColor_v1 |  | unverified | 08 |
| GET /admin/staff | src/features/accounts/api/InternalAccounts.api.ts:useInternalAccountsQuery | AdminStaffController_findAll_v1 | Cast response | unverified | 09 |
| GET /admin/staff/{id} | InternalAccounts.api.ts:useInternalAccountQuery | AdminStaffController_findOne_v1 | Cast StaffResponseDto | unverified | 09 |
| POST /admin/staff | InternalAccounts.api.ts:useCreateInternalAccountMutation | AdminStaffController_create_v1 |  | unverified | 09 |
| PATCH /admin/staff/{id} | InternalAccounts.api.ts:useRenameInternalAccountMutation | AdminStaffController_rename_v1 |  | unverified | 09 |
| POST /admin/staff/{id}/enable | InternalAccounts.api.ts:useSetInternalAccountStatusMutation | AdminStaffController_enable_v1 | Path ghép động enable/disable | unverified | 09 |
| POST /admin/staff/{id}/disable | InternalAccounts.api.ts:useSetInternalAccountStatusMutation | AdminStaffController_disable_v1 | Path ghép động enable/disable | unverified | 09 |
| PUT /admin/internal-accounts/{accountId}/roles/{roleId} | InternalAccounts.api.ts:useToggleInternalAccountRoleMutation | AdminRoleController_assignRole_v1 | Chọn method theo cờ assigned | unverified | 09 |
| DELETE /admin/internal-accounts/{accountId}/roles/{roleId} | InternalAccounts.api.ts:useToggleInternalAccountRoleMutation | AdminRoleController_removeRoleFromAccount_v1 | Chọn method theo cờ assigned | unverified | 09 |
| GET /admin/roles | src/features/roles/api/Roles.api.ts | AdminRoleController_findAllRoles_v1 | Cast response | unverified | 09 |
| GET /admin/permissions | Roles.api.ts | AdminRoleController_listPermissions_v1 | Cast PermissionGroupResponseDto[] | unverified | 09 |
| GET /admin/roles/{id} | Roles.api.ts | AdminRoleController_findOneRole_v1 | Cast RoleResponseDto | unverified | 09 |
| POST /admin/roles | Roles.api.ts | AdminRoleController_createRole_v1 |  | unverified | 09 |
| PATCH /admin/roles/{id} | Roles.api.ts | AdminRoleController_updateRole_v1 |  | unverified | 09 |
| DELETE /admin/roles/{id} | Roles.api.ts | AdminRoleController_removeRole_v1 |  | unverified | 09 |
| GET /admin/vouchers | src/features/vouchers/api/Vouchers.api.ts:useVouchersQuery | AdminVoucherController_findAll_v1 | Cast response | unverified | 10 |
| GET /admin/vouchers/{id} | Vouchers.api.ts:useVoucherQuery | AdminVoucherController_findOne_v1 | Cast VoucherResponseDto | unverified | 10 |
| POST /admin/vouchers | Vouchers.api.ts:useSaveVoucherMutation | AdminVoucherController_create_v1 |  | unverified | 10 |
| PATCH /admin/vouchers/{id} | Vouchers.api.ts:useSaveVoucherMutation | AdminVoucherController_update_v1 |  | unverified | 10 |
| DELETE /admin/vouchers/{id} | Vouchers.api.ts:useDeleteVoucherMutation | AdminVoucherController_remove_v1 |  | unverified | 10 |
| GET /orders | src/features/orders/api/Orders.api.ts:useOrdersQuery | — (không có path ở v0.7.0) | Cast Paginated<Order>; cần bằng chứng gating | unverified | 11 |
| GET /orders/{id} | Orders.api.ts:useOrderQuery | — (không có path ở v0.7.0) | Cast Order; cần bằng chứng gating | unverified | 11 |
| GET /inventory | src/features/inventory/api/Inventory.api.ts | — (không có path ở v0.7.0) | Cast Paginated<InventoryItem> | unverified | 12 |
| GET /inventory/movements | Inventory.api.ts | — (không có path ở v0.7.0) | Cast Paginated<InventoryMovement> | unverified | 12 |
| POST /inventory/{id}/adjustments | Inventory.api.ts | — (không có path ở v0.7.0) | Body tự do | unverified | 12 |
| GET /customers | src/features/customers/api/Customers.api.ts | — (không có path ở v0.7.0) | Cast Paginated<Customer> | unverified | 13 |
| GET /customers/{id} | Customers.api.ts | — (không có path ở v0.7.0) | Cast Customer | unverified | 13 |
| GET /settings/store | src/features/settings/api/Settings.api.ts | — (không có path ở v0.7.0) | Cast StoreSettingsInput | unverified | 14 |
| PUT /settings/store | Settings.api.ts | — (không có path ở v0.7.0) | Body StoreSettingsInput | unverified | 14 |
| GET /admin/products (dashboard) | src/features/dashboard/api/Dashboard.api.ts:useDashboardQuery | AdminProductController_findAll_v1 | Consumer thứ hai của operation products; widget `products` | unverified | 14 |
| GET /dashboard/{key} | Dashboard.api.ts:useDashboardQuery | — (không có path ở v0.7.0) | Path ghép theo widget key | unverified | 14 |
| POST {signed.uploadUrl} (storage) | ProductImages.api.ts:postToStorage (XHR presigned POST) | — external | Byte upload, progress/cancel; không gắn auth Backend | external | 07 |

Issue 01 xác nhận lại bảng trên source mới nhất (call site mới, wrapper, consumer trực tiếp), bổ sung evidence gating cho các dòng không có path, rồi chốt denominator. Mỗi slice 06–14 chỉ đóng khi mọi dòng có cột Slice trùng số issue đạt trạng thái đích.

## Gate theo slice và toàn bộ migration

1. Issue 05 được phép giữ typing cũ trong thời gian chuyển runtime/auth, nhưng phải ghi trạng thái đúng và giao lại toàn bộ auth/session call sites cho issue 06.
2. Issue 06 proof cách nối typing, sau đó **retrofit mọi operation đã phát hành của auth/session đã chuyển ở 05**, bao gồm runtime refresh; chỉ đóng khi các dòng đó typed hoặc có evidence blocked-no-contract/removed hợp lệ. Contract gap không được che bằng cast.
3. Issue 07–14 phải đưa mọi operation Backend đã phát hành thuộc slice về typed trước khi đóng; cập nhật bảng và rà direct HTTP/casts trong source slice, kể cả wrapper và consumer chưa đổi tên. Không giới hạn vào một endpoint mẫu.
4. Kiểm compile-time request hợp lệ/sai tại typed boundary cho các nhóm signature liên quan (method/path/required params/query/body/success response, bodyless 204); không viết nhiều test trùng chỉ để đủ một test cho mỗi dòng. Runtime tests vẫn chứng minh refresh/errors/cancellation và mapper/form behavior riêng.
5. Issue 15 đối chiếu ngược source cuối với bảng: **100% operation Backend đã phát hành và còn được CMS sử dụng phải typed**. Không còn unverified/legacy-untyped; blocked-no-contract có evidence gating/ticket; external có adapter contract riêng. Báo số operation theo trạng thái và evidence, không suy coverage từ typecheck xanh hoặc generated diff không đổi.

`npm run gen:api` + generated diff chỉ chứng minh file contract đồng bộ, không chứng minh tất cả caller dùng typed boundary. `as DTO`, generic tuỳ ý do caller chọn hoặc disable typechecking không phải evidence đạt yêu cầu.

Tham khảo [spec delivery](spec.md), [thiết kế đã duyệt](../../../structure-migration/README.md), [issue 06](issues/06-typed-endpoint-proof.md), [issue 15](issues/15-final-reconcile.md).
