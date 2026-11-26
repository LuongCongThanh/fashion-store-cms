# Cấu trúc root và workflow Sản phẩm

> Research bổ trợ ADR; không phải policy độc lập hoặc báo cáo refactor đã chạy.

## Cây root đích thực dụng

**Đề xuất:** giữ `features` để giảm rename không phục vụ ownership; bên trong tổ chức theo domain/workflow.
Nếu sau grill chọn `modules`, đổi tên một lần cùng alias/lint; không duy trì hai root có cùng trách nhiệm.
Tên file trong cây là **đích**, chưa phải đường dẫn source tồn tại.

```text
src/
  app/
    runtime.ts                    # composition root; tạo runtime dùng chung
    config/                       # env.config.ts, ui.config.ts
    providers/                    # cài plugin/global handlers
    router/                       # routes.ts, router.ts, guards.ts
    views/                        # NotFoundView.vue, ForbiddenView.vue
  features/
    auth/                         # auth workflow, user/permission state
    products/                     # xem cây workflow phía dưới
    categories/
    orders/
    inventory/
    customers/
    vouchers/
    accounts/
    roles/
    settings/
    dashboard/
    colors/                       # giữ owner hiện có; regroup chỉ khi có quyết định
    sizes/
  layouts/                        # DashboardLayout.vue, AuthLayout.vue
  shared/
    components/                   # UI không biết domain
    composables/                  # useListState.ts, useNotify.ts
    lib/
      api/                        # api.generated.ts; transport, lỗi dùng chung
      query/                      # queryClient.ts
      session/                    # session.ts, session.store.ts
      i18n/
      form/                       # tiện ích khi có consumer thật
    types/                        # chỉ technical contracts dùng chung
    utils/                        # hàm thuần có tên theo trách nhiệm
  test/                           # runtime/render/factory dùng chung
  assets/
  locales/
  App.vue
  main.ts
e2e/                              # hành trình toàn ứng dụng
```

Tên/path output generated trong cây chỉ là minh hoạ, chưa được duyệt đổi; nếu đổi cần cập nhật generator, workflow contract và mọi consumer trong cùng slice.

## Cây products theo workflow

**Đề xuất:** chia khi workflow có nhiều file cùng thay đổi; domain nhỏ giữ phẳng.
Không tạo `domain/application/infrastructure` rỗng trong mỗi workflow.

```text
features/products/
  products.routes.ts
  product.types.ts                # model chia sẻ trong products
  useProductOptions.ts            # chỉ public nếu consumer ngoài domain cần
  api/
    productMapper.ts              # DTO boundary dùng chung list/detail
    productKeys.ts                # key/invalidation chia sẻ nội bộ products
  product-list/
    ProductListView.vue
    ProductTable.vue
    useProductList.ts              # URL + query + actions điều phối
    productList.schema.ts
    api/
      useProductsQuery.ts
  product-editor/
    ProductEditView.vue
    ProductInfoForm.vue
    useProductEditor.ts            # form lifecycle/save/navigation
    product.schema.ts
    api/
      useProductQuery.ts
      useSaveProduct.ts
    images/
      ProductImagesPanel.vue
      useProductImages.ts
      imageUpload.ts               # hàm thuần/adapter nếu thật sự cần
      api/
        useProductImageMutations.ts
    variants/
      ProductVariantsPanel.vue
      variant.schema.ts
      variantDraft.ts              # pure rule về bản nháp CMS nếu có
      variantDraft.spec.ts
      api/
        useVariantMutations.ts
  sale-prices/                     # chỉ tách khi workflow thực tế đủ lớn
```

`images` và `variants` không tự động là domain độc lập chỉ vì có subfolder.
Đề xuất query dùng chung editor đặt ở owner chung gần nhất; không để sibling import private hook của nhau.
Một SFC nhỏ có thể vừa hiển thị vừa quản lý UI local; component dùng lại/presentational chỉ props/emits.
Nếu giữ rule components thuần hiện hành, phân loại container rõ và cập nhật lint cho đường dẫn lồng mới.
Nguồn hiện hành: [CONVENTIONS §T](../../guides/README.md), [featureRows trong ESLint](../../../eslint.config.ts).

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
