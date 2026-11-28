# Workflow Sản phẩm và vai trò file

> Thiết kế đã duyệt ngày 26/11/2026; chưa triển khai source. ADR là nguồn quyết định, tracker sở hữu delivery.

## Ví dụ chia file cho Sản phẩm

```text
modules/products/
├── products.routes.ts                  # URL/meta, lazy import view
├── queries/
│   ├── productKeys.ts                  # Query keys dùng chung trong products
│   └── useProductQuery.ts              # Detail dùng bởi nhiều phần editor
├── types/
│   └── productDraft.types.ts           # Chỉ type bản nháp có nhiều consumer
├── product-list/
│   ├── ProductListView.vue             # Ghép toolbar/table/pagination
│   ├── ProductListView.spec.ts
│   ├── components/
│   │   ├── ProductTable.vue            # Render danh sách và emits thao tác
│   │   └── ProductFilters.vue          # Render bộ lọc
│   ├── composables/
│   │   └── useProductList.ts           # URL/filter/selection/thao tác màn hình
│   ├── queries/
│   │   └── useProductsQuery.ts         # Dữ liệu danh sách, loading/refetch
│   └── schemas/
│       └── productList.schema.ts       # Parse/validate filter và phân trang
├── product-editor/
│   ├── ProductEditView.vue             # Ghép form/variants/images/sale-prices
│   ├── components/
│   │   └── ProductInfoForm.vue         # Các field thông tin Sản phẩm
│   ├── composables/
│   │   ├── useProductEditor.ts         # Form draft/dirty/errors/submit UI
│   │   └── useProductEditor.spec.ts
│   ├── queries/
│   │   └── useSaveProduct.ts           # Mutation cập nhật + invalidate keys
│   └── schemas/
│       ├── productForm.schema.ts       # Input form, không chứa HTTP
│       └── productForm.schema.spec.ts
├── variants/                           # Biến thể size × màu, SKU, giá bán
├── images/                             # Ảnh theo màu, upload/cancel/progress
└── sale-prices/                        # Giá khuyến mãi của Biến thể

integrations/backend/
├── client/
│   └── httpClient.ts                   # Transport chung, không biết UI sản phẩm
├── endpoints/
│   └── products.api.ts                 # Request, payload, response cho Sản phẩm
└── mappers/
    ├── product.mapper.ts               # Nếu response cần chuyển sang model
    └── product.mapper.spec.ts
```

Variants/images/sale-prices có thể thêm components/composables/queries/schemas/services/types khi cần. Nếu nhiều file trong một nhóm khác lý do thay đổi thì tách tiếp theo chức năng; không chia chỉ vì vượt một số dòng cố định. Product detail/query dùng nhiều phần đặt ở owner chung gần nhất; không cho sibling import private file lẫn nhau. Product create, các action publish/archive và consumer thực tế phải được inventory đầy đủ; cây minh hoạ không phải quyền bỏ các file/flow không liệt kê.

## Các loại file và cấu trúc chi tiết bổ sung

Bổ sung theo câu hỏi ngày 26/11/2026: service, type, constant/enum-like, utility, layout và i18n đều có vị trí. Cây rút gọn không có nghĩa bỏ các vai trò này. Quy tắc phân loại đã duyệt Q16; tên file minh hoạ vẫn cần inventory khi triển khai. Không tạo mọi folder sẵn cho mọi workflow.

| Loại           | Ví dụ                           | Nhiệm vụ và giới hạn                                                                      |
| -------------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| Service        | `uploadProductImage.service.ts` | Quy trình nhiều bước, nhận dependency khi cần; không giữ ref/router/toast Vue             |
| Type/interface | `productDraft.types.ts`         | Dữ liệu/contract nội bộ nhiều consumer; không định nghĩa lại contract API chỉ để đủ tầng  |
| Store          | `auth.store.ts`                 | Client state chia sẻ có lifecycle; không nhân bản cache Vue Query                         |
| Constant       | `imageUpload.constants.ts`      | Giá trị cố định thuộc workflow, dùng lại khi cần                                          |
| Enum-like      | `imageUploadStatus.ts`          | Union hoặc `as const` cho trạng thái CMS; giữ naming TS thường, không tự thêm suffix enum |
| Utility        | `buildVariantDraft.ts`          | Hàm thuần có tên cụ thể, không HTTP/router/ref                                            |
| Layout         | `DashboardLayout.vue`           | Khung màn hình, không sở hữu nghiệp vụ products/orders                                    |
| i18n           | `i18n.ts`, `locales/vi.json`    | Khởi tạo ngôn ngữ và bản dịch giao diện; khác nội dung Danh mục từ Backend                |

```text
src/
├── modules/
│   ├── products/
│   │   ├── products.routes.ts
│   │   ├── types/
│   │   │   └── productDraft.types.ts
│   │   ├── product-editor/             # View/form/composable/query/schema như cây trên
│   │   ├── variants/
│   │   │   ├── components/
│   │   │   │   └── ProductVariants.vue
│   │   │   ├── composables/
│   │   │   │   └── useProductVariants.ts
│   │   │   ├── schemas/
│   │   │   │   └── variant.schema.ts
│   │   │   └── utils/
│   │   │       ├── buildVariantDraft.ts
│   │   │       └── buildVariantDraft.spec.ts
│   │   ├── images/
│   │   │   ├── components/
│   │   │   │   └── ProductImages.vue
│   │   │   ├── composables/
│   │   │   │   └── useProductImages.ts  # Progress/cancel/retry và state Vue
│   │   │   ├── queries/
│   │   │   │   └── useUploadProductImage.ts
│   │   │   ├── services/
│   │   │   │   ├── uploadProductImage.service.ts
│   │   │   │   └── uploadProductImage.service.spec.ts
│   │   │   ├── types/
│   │   │   │   └── imageUpload.types.ts
│   │   │   └── constants/
│   │   │       └── imageUpload.constants.ts
│   │   └── sale-prices/
│   └── auth/
│       ├── composables/
│       │   └── useAuth.ts
│       └── stores/
│           └── auth.store.ts
├── layouts/
│   ├── DashboardLayout.vue
│   ├── AuthLayout.vue
│   ├── navigation.ts                 # Navigation/breadcrumb theo route và quyền
│   └── components/
│       ├── AppHeader.vue
│       ├── AppSidebar.vue
│       ├── AppBreadcrumb.vue
│       └── UserMenu.vue
├── i18n/
│   ├── i18n.ts                       # Khởi tạo plugin, chọn/lưu locale
│   ├── i18n.spec.ts
│   └── locales/
│       ├── vi.json
│       └── en.json
└── shared/
    ├── components/
    ├── composables/
    ├── form/
    ├── formatting/
    │   ├── formatMoney.ts
    │   └── formatDate.ts
    └── utils/                        # Chỉ helper thuần dùng chung, không biết nghiệp vụ
```

Service upload là ví dụ có điều kiện: chỉ tách khi quy trình presign → storage → attach cần độc lập Vue. Service nhận các thao tác từ endpoint/storage adapter, không để integration import ngược module. Storage request không gắn thông tin đăng nhập Backend. Service trả kết quả/lỗi; composable quyết định thông báo và state UI, query quyết định invalidation.

Utility dành riêng cho Biến thể vẫn ở products/variants, không đưa lên shared chỉ vì là hàm thuần. Shared utility chỉ khi có consumer thật cùng semantics và không có tri thức nghiệp vụ. Không bắt buộc tạo file utils cho mỗi hàm ngắn.

CMS hiện quy định union/`as const`, không thêm TypeScript `enum` ([CONVENTIONS §B](../../../conventions/README.md)); [tsconfig.app.json](../../../../tsconfig.app.json) bật `erasableSyntaxOnly`. Enum giá trị từ API được dùng qua Generated API, không viết một bảng trạng thái/quyền song song. Trạng thái local CMS như upload có thể là union trong type hoặc object `as const` cạnh owner; không tạo root enums/ cho mọi domain. Nếu muốn đổi policy sang TypeScript enum phải quyết định riêng và cập nhật compiler/lint, không coi đó là yêu cầu của Vue.

Layout và i18n đã nằm trong root được duyệt. Chi tiết file ở đây là ví dụ mapping cần kiểm lại. UI vi/en thuộc i18n; tên Danh mục dịch bởi Backend thuộc categories/integration theo contract. Không trộn bản dịch nội dung vào JSON giao diện.

Tra cứu: [Mục lục chủ đề](map.md) · [Toàn bộ tài liệu](../../../README.md).
