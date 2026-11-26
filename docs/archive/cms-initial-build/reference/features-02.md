# Q. Cấu trúc từng module — phần 2

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

```text
features/
├── auth/                                   # Step 4 (stub) · P2
│   ├── api/
│   │   └── Auth.api.ts                     # login, logout, refresh, me
│   ├── components/                         # P2
│   │   ├── LoginForm.vue
│   │   └── LoginForm.spec.ts
│   ├── schemas/                            # P2
│   │   └── Login.schema.ts
│   ├── stores/
│   │   └── Auth.store.ts                   # token + user, nội bộ
│   ├── types/
│   │   └── Auth.types.ts                   # CurrentUser, Permission
│   ├── views/
│   │   └── LoginView.vue
│   ├── Auth.routes.ts
│   ├── UseAuth.ts                          # useAuth() — bọc Session
│   └── UseAuth.spec.ts
├── StoreScope/                             # Step 4 (stub) · P3
│   ├── api/
│   │   └── StoreScope.api.ts               # Store user được truy cập
│   ├── stores/
│   │   └── StoreScope.store.ts             # danh sách Store; storeId nằm ở Session (D34)
│   ├── types/
│   │   └── StoreScope.types.ts
│   ├── UseStoreScope.ts                    # useStoreScope() — bọc Session
│   └── UseStoreScope.spec.ts
├── dashboard/                              # P4
│   ├── api/
│   │   └── Dashboard.api.ts
│   ├── components/
│   │   ├── KpiCard.vue
│   │   ├── RevenueChart.vue                # echarts, lazy
│   │   └── TopProductsTable.vue
│   ├── types/
│   │   └── Dashboard.types.ts
│   ├── views/
│   │   └── DashboardView.vue
│   └── Dashboard.routes.ts
├── products/                               # P5
│   ├── api/
│   │   ├── Product.mapper.ts
│   │   ├── Product.mapper.spec.ts
│   │   ├── Products.api.ts
│   │   └── Products.api.spec.ts
│   ├── components/
│   │   ├── ProductForm.vue
│   │   ├── ProductForm.spec.ts
│   │   ├── ProductImagesField.vue          # dùng useMedia().pickImages()
│   │   ├── ProductStatusBadge.vue
│   │   ├── ProductTable.vue
│   │   ├── ProductTable.spec.ts
│   │   └── ProductVariantsField.vue
│   ├── composables/
│   │   ├── UseProductActions.ts
│   │   ├── UseProductForm.ts
│   │   └── UseProductForm.spec.ts
│   ├── schemas/
│   │   ├── Product.schema.ts
│   │   └── Product.schema.spec.ts
│   ├── types/
│   │   └── Product.types.ts
│   ├── views/
│   │   ├── ProductCreateView.vue
│   │   ├── ProductEditView.vue
│   │   └── ProductListView.vue
│   ├── Products.routes.ts
│   └── UseProducts.ts                      # orders/inventory cần chọn sản phẩm
├── categories/                             # P6
│   ├── api/
│   │   └── Categories.api.ts
│   ├── components/
│   │   ├── CategoryFormModal.vue           # modal internal (§P)
│   │   └── CategoryTree.vue
│   ├── schemas/
│   │   └── Category.schema.ts
│   ├── types/
│   │   └── Category.types.ts
│   ├── views/
│   │   └── CategoryListView.vue
│   ├── Categories.routes.ts
│   └── UseCategories.ts                    # products cần chọn danh mục
├── orders/                                 # P7
│   ├── api/
│   │   └── Orders.api.ts
│   ├── components/
│   │   ├── OrderItemsTable.vue
│   │   ├── OrderStatusBadge.vue
│   │   ├── OrderStatusActions.vue          # chuyển trạng thái + useConfirm
│   │   ├── OrderTable.vue
│   │   └── OrderTimeline.vue
│   ├── schemas/
│   │   └── OrderListParams.schema.ts
│   ├── types/
│   │   └── Order.types.ts
│   ├── views/
│   │   ├── OrderDetailView.vue
│   │   └── OrderListView.vue
│   └── Orders.routes.ts
├── customers/                              # P8
│   ├── api/
│   │   └── Customers.api.ts
│   ├── components/
│   │   ├── CustomerOrdersTable.vue         # gọi qua UseOrders nếu cần, không import orders/api
│   │   └── CustomerTable.vue
│   ├── types/
│   │   └── Customer.types.ts
│   ├── views/
│   │   ├── CustomerDetailView.vue
│   │   └── CustomerListView.vue
│   └── Customers.routes.ts
├── inventory/                              # P9
│   ├── api/
│   │   └── Inventory.api.ts
│   ├── components/
│   │   ├── StockAdjustModal.vue
│   │   ├── StockLevelBadge.vue
│   │   └── StockTable.vue
│   ├── schemas/
│   │   └── StockAdjust.schema.ts
│   ├── types/
│   │   └── Inventory.types.ts
│   ├── views/
│   │   └── InventoryListView.vue
│   └── Inventory.routes.ts
└── media/                                  # P5 (cùng Product, §17.1)
    ├── api/
    │   ├── Media.api.ts                    # presign, complete, list
    │   ├── MediaUpload.ts                  # 4 bước presign → PUT → complete, progress, huỷ, retry (§17.1)
    │   └── MediaUpload.spec.ts
    ├── components/
    │   ├── MediaGrid.vue
    │   └── MediaPickerModal.vue            # mở qua useMedia().pickImages()
    ├── types/
    │   └── Media.types.ts
    ├── views/
    │   └── MediaLibraryView.vue
```

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần tiếp](features-03.md)
