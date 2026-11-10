# Hợp đồng API tạm — CMS pages

Ngày đối chiếu: 2026-11-10. BE đã có OpenAPI tại `http://localhost:8080/docs-json`; `Api.generated.ts` được sinh từ đó. Contract hiện xác nhận auth, staff, categories, products và size/color. Các feature trong bảng dưới chưa xuất hiện trong Swagger vẫn là placeholder frontend, không phải endpoint BE đã xác nhận.

Base URL lấy từ `VITE_API_BASE_URL`. HttpClient gắn Session token, `X-Store-Id` và `Accept-Language`. Query keys không chứa Store ID; Session xoá cache khi đổi Store. Tất cả list phân trang trả `{ data: T[], meta: { page, pageSize, total, totalPages } }`.

| Feature    | Endpoint tạm                                                                                                        | Model / input frontend                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Dashboard  | GET `/dashboard/{revenue,orders,customers,products,revenue-chart,order-chart,recent-orders,top-products,low-stock}` | `features/dashboard/types/Dashboard.types.ts`: widget độc lập, `{ value?, points?, items? }`                  |
| Products   | GET/POST `/products`; GET/PUT `/products/:id`; POST `/products/bulk`                                                | `Product.types.ts`, `Product.schema.ts`; bulk `{ ids, action: publish                                         | unpublish | delete }` |
| Categories | GET/POST `/categories`; GET/PUT `/categories/:id`; PATCH `/categories/:id/move`                                     | GET list trả `Category[]`, move `{ parentId }`; translations `{ vi: { name, description }, en: ... }`         |
| Orders     | GET `/orders`, `/orders/:id`; PATCH `/orders/:id/status`                                                            | `Order.types.ts`; status payload `{ status }`, customer filter `customerId`                                   |
| Customers  | GET `/customers`, `/customers/:id`                                                                                  | `Customer.types.ts`; detail gồm addresses/activity; orders lấy qua interface công khai của feature Orders     |
| Inventory  | GET `/inventory`, `/inventory/movements`; POST `/inventory/:id/adjustments`                                         | `Inventory.types.ts`; delta `{ quantity, reason }`, reason bắt buộc                                           |
| Promotions | GET/POST `/promotions`; GET/PUT `/promotions/:id`                                                                   | `Promotion.schema.ts`: coupon/auto, percent/fixed, code/limit/time window                                     |
| Users      | GET/POST `/users`; GET/PUT `/users/:id`; GET `/stores`                                                              | `User.schema.ts`; roleIds/storeIds; stores trả `StoreSummary[]`                                               |
| Roles      | GET/POST `/roles`; GET/PUT `/roles/:id`; GET `/permissions`                                                         | roles phân trang; permissions trả `{ key, resource, action }[]`, không giới hạn action CRUD                   |
| Settings   | GET/PUT `/settings/store`, `/settings/localization`                                                                 | `Settings.schema.ts`; Store logo dùng MediaImage                                                              |
| Media      | POST `/media/presign`; PUT storage URL; POST `/media/:id/complete`                                                  | Presign `{ fileName, mimeType, size }` → `{ mediaId, uploadUrl, headers? }`; complete → `{ id?, name?, url }` |

## Các điểm cần chốt khi backend sẵn sàng

- URL/version, DTO thật, enum và casing. Frontend hiện dùng status chữ thường; danh sách trạng thái trong kiến trúc thể hiện chữ hoa. Adapter DTO → Model phải chốt casing khi có Swagger.
- Shape translations và cấu trúc cây category; bulk action, rule chuyển trạng thái/refund của order, stock delta và reason/reference.
- Presigned storage headers, CORS, response complete, lifecycle dọn upload bị hủy. Storage PUT dùng XHR riêng để có byte progress/hủy và không nhận Session headers.
- Quyền lookup category/role/Store cho form tương ứng. Endpoint permissions phải trả cả resource/action mới mà không cần đổi FE.
- Định dạng datetime/timezone của promotion, enum locale/currency của Store, server validation error codes/fields.
- Provisioning tài khoản mới và giới hạn/pagination của role assignment lookup.

Khi backend có contract: cấu hình `OPENAPI_URL`, chạy `npm run gen:api`, thay cast response tạm trong `api/` bằng DTO generated và mapper nếu Model khác DTO; chạy lại typecheck, View tests và integration với backend. Không tự viết tay nội dung `Api.generated.ts` để làm như đã tích hợp Swagger.
