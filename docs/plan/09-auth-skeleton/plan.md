# 09 — Khung features/auth và StoreScope

Status: ready-for-agent
Blocked by: 06, 07, 08
Nguồn: Step 4 trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41, trong đó D24, D32 đã huỷ), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 4 — Khung `features/auth`

**Làm gì**

- Tạo `features/auth/` theo §A với interface `useAuth()` (§8.1) trong `UseAuth.ts` — stub, chưa gọi API thật; bọc Session (§M.2), không có adapter riêng cho HttpClient.
- `LoginView.vue` rỗng.
- `Guards.ts` kiểm tra `meta.requiresAuth`, chỉ dùng `useAuth()` (không import store).
- `features/StoreScope/` stub: `useStoreScope()` bọc Session, `stores` cố định; `layouts/components/StoreSwitcher.vue` hiện tên Store.
- `useAuth()` bọc Session theo §M.2 (`login()` gọi API rồi `session.signIn()`, `logout()` = `session.logout()`); `Session.spec.ts` + `Runtime.spec.ts` (từ Step 3a) vẫn pass.
- `Guards.spec.ts` viết cùng step này (mock `@features/auth/UseAuth` theo §I).

**Kiểm tra:** truy cập `/admin` khi chưa đăng nhập → chuyển về `/login`; `Guards.spec.ts` pass; `main.ts` chỉ một dòng; không còn `queryClient.clear()` ngoài `Session.ts` — kể cả trong `UseAuth.ts`, `UseStoreScope.ts` (§V.1).

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

#### F.2. Khung feature mới (copy tay, chưa có generator)

```text
features/<name>/
├── api/<Feature>.api.ts
├── schemas/<Entity>.schema.ts
├── types/<Entity>.types.ts
├── components/<Entity>Table.vue
├── views/<Entity>ListView.vue
└── Use<Feature>.ts            # chỉ khi feature khác cần dùng
```

Component mẫu:

```vue
<script setup lang="ts">
import type { Product } from '@features/products/types/Product.types'

const props = defineProps<{ items: Product[]; loading?: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <UTable :data="props.items" :loading="props.loading" />
</template>
```

Spec mẫu (`<File>.spec.ts`): `describe` theo tên module, `it` mô tả hành vi bằng tiếng Anh (`it('redirects to login when unauthenticated')`).

### Q. Cấu trúc từng module

#### Q.1. Khung chuẩn một feature

- `<Feature>`: tên feature dạng PascalCase, **số nhiều** như tên thư mục (`Products`, `Orders`) — dùng cho `api`, `routes`, `Use*`.
- `<Entity>`: tên thực thể **số ít** (`Product`, `Order`) — dùng cho `schemas`, `types`, `components`, `views`.
- Feature không đếm được giữ nguyên: `Auth`, `Dashboard`, `Inventory`, `Media`.

Mọi feature theo đúng khung này; thư mục con nào chưa có file thì chưa tạo.

```text
features/<name>/
├── api/
│   ├── <Entity>.mapper.ts         # CHỈ khi DTO lệch Model (§T.3)
│   ├── <Entity>.mapper.spec.ts
│   ├── <Feature>.api.ts           # hàm HTTP + query key (nội bộ) + composable Vue Query trả Model (export)
│   └── <Feature>.api.spec.ts      # test invalidate, map params
├── components/                 # presentational: props in / emits out, không gọi API (§T.1)
│   ├── <Entity>Form.vue
│   ├── <Entity>Form.spec.ts
│   ├── <Entity>StatusBadge.vue   # map trạng thái → màu (§L.4)
│   ├── <Entity>Table.vue
│   └── <Entity>Table.spec.ts
├── composables/                # logic màn hình (§T.1) — tách khi ≥ 2 view dùng hoặc logic đủ dày
│   ├── Use<Entity>Actions.ts     # xoá/đổi trạng thái: confirm + mutation + toast
│   ├── Use<Entity>Form.ts        # schema + mutation + applyApiErrorToForm
│   └── Use<Entity>Form.spec.ts
├── schemas/
│   ├── <Entity>.schema.ts        # Zod: form + list params
│   └── <Entity>.schema.spec.ts
├── types/
│   └── <Entity>.types.ts         # Model của FE — KHÔNG alias DTO (§T.3)
├── views/                      # container, gắn route, chỉ Routes.ts import
│   ├── <Entity>CreateView.vue
│   ├── <Entity>DetailView.vue
│   ├── <Entity>EditView.vue
│   └── <Entity>ListView.vue
├── <Feature>.routes.ts            # mảng RouteRecordRaw của feature, Routes.ts gộp lại
├── Use<Feature>.ts                # chỉ khi feature khác cần dùng
└── Use<Feature>.spec.ts
```

`<Feature>.routes.ts` thêm vào whitelist §B.3 (chỉ `app/router/Routes.ts` được import), để route của feature nằm cùng feature và lazy-import `./views/...` bằng đường dẫn tương đối.

**Feature tối thiểu** = `api/` + `types/` + `views/` (+ `<Feature>.routes.ts`); mọi thư mục khác thêm khi cần. Tầng tuỳ chọn: `composables/` và `*.mapper.ts` chỉ tạo khi có lý do (quy tắc ≥ 2 nơi dùng áp dụng cả trong feature; mapper khi DTO lệch Model). Ban đầu view gọi thẳng composable của `api/`.

Thứ tự phụ thuộc bên trong feature (§T.1): `views → components` (props/emits) và `views → [composables] → api → [mapper] → types`; `components` chỉ import `types/`, `schemas/`, `@shared/components`; `stores/` (nếu có) chỉ `api/` và `Use<Feature>.ts` dùng.

#### Q.2. Từng feature

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
    ├── Media.routes.ts
    └── UseMedia.ts                         # pickImages(): Promise<Media[]>, upload(files) → { progress, cancel }
```

#### Q.3. Interface công khai của các module

Bảng gồm shared module (`shared/`) và interface công khai của feature / `app/` mà nơi khác gọi tới. Chỉ các dòng `shared/` là shared module theo [GLOSSARY.md](../../GLOSSARY.md).

| Module                                               | Interface                                                                                                                   | Giấu bên trong                                                                                            |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `shared/lib/api/client/HttpClient.ts`                | `createHttpClient(deps): HttpClient` (get/post/put/patch/delete có kiểu theo Swagger), `HTTP_CLIENT_KEY`, `useHttpClient()` | axios, gắn header (token, locale, `X-Store-Id`), path param mặc định, gom refresh, timeout, chuẩn hoá lỗi |
| `shared/lib/session/Session.ts`                      | `createSession()`, `useSession()`                                                                                           | token, storeId, refresh (1 lần đồng thời), xoá cache khi logout/đổi Store, sự kiện `authFailure`          |
| `features/auth/UseAuth.ts`                           | `useAuth()`                                                                                                                 | user, login/logout qua Session                                                                            |
| `shared/lib/api/errors/ApiError.ts` + `ErrorCode.ts` | `ApiError`, `isApiError`, `ErrorCode`, `codeFromStatus`                                                                     | — (kiểu dữ liệu)                                                                                          |
| `features/StoreScope/UseStoreScope.ts`               | `useStoreScope()` → `{ storeId, stores, switchStore }`                                                                      | danh sách Store; đổi Store ủy quyền cho Session                                                           |
| `shared/composables/UsePwa.ts`                       | `usePwa()` → `{ needRefresh, reload }`                                                                                      | Đăng ký SW, kiểm tra định kỳ                                                                              |
| `shared/lib/form/ApplyApiErrorToForm.ts`             | `applyApiErrorToForm(error, form): boolean`                                                                                 | Map `fields`, phân biệt 400/422                                                                           |
| `shared/composables/UseNotify.ts`                    | `useNotify()` → `{ success, error }`; `createNotifier()` dùng ngoài setup                                                   | Hiển thị toast; key lấy từ `ErrorPolicy.messageKeyOf`                                                     |
| `shared/lib/api/errors/ErrorPolicy.ts`               | `isRetryable`, `messageKeyOf`, `isSilent`, `routeMutationError`                                                             | Toàn bộ quy tắc §O.4                                                                                      |
| `shared/components/confirm/UseConfirm.ts`            | `useConfirm()` → `(opts) => Promise<boolean>`                                                                               | `useOverlay`, `ConfirmDialog.vue`                                                                         |
| `app/providers/ErrorHandling.ts`                     | `installErrorHandling(app, deps)`                                                                                           | errorHandler, unhandledrejection, chunk reload                                                            |
| `shared/lib/query/QueryClient.ts`                    | `createAppQueryClient(onMutationError)`                                                                                     | Nối ErrorPolicy vào Vue Query (retry, MutationCache)                                                      |
| `shared/lib/i18n/I18n.ts`                            | `createAppI18n()`, `useLocale()`                                                                                            | persist, `<html lang>`, locale Nuxt UI — do instance sở hữu                                               |
| `shared/composables/UseTheme.ts`                     | `useTheme()` → `{ mode, setMode }`                                                                                          | storage key, đồng bộ script chống nháy                                                                    |
