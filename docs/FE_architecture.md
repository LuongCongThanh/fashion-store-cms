# Fashion Store CMS — Vue 3

## 1. Project Overview

Xây dựng một **CMS / Admin Dashboard** cho hệ thống Fashion Store.

CMS dành cho:

- Master Store Manager
- Store Manager
- Order Staff

CMS không phục vụ khách hàng cuối và **không yêu cầu SEO**.

### Frontend

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- TanStack Vue Query
- Axios
- vue-i18n
- Nuxt UI v4 (chạy với Vue + Vite, không dùng Nuxt)
- Tailwind CSS v4
- Zod + vee-validate
- Vitest
- Vue Test Utils
- Playwright

### Backend

CMS giao tiếp với NestJS REST API:

```text
Vue 3 CMS
    │
    │ HTTPS
    ▼
NestJS REST API
    │
    ├── PostgreSQL
    ├── Redis
    └── BullMQ (background jobs)
```

---

# 2. Technology Stack

| Category        | Technology                                         | Lý do / đã cân nhắc                                                                                                                                                                                                                                           |
| --------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | Vue 3                                              |                                                                                                                                                                                                                                                               |
| Build tool      | Vite                                               |                                                                                                                                                                                                                                                               |
| Language        | TypeScript (strict)                                |                                                                                                                                                                                                                                                               |
| Routing         | Vue Router                                         | Router chính thức của Vue                                                                                                                                                                                                                                     |
| Client state    | Pinia                                              | Store chính thức, thay Vuex                                                                                                                                                                                                                                   |
| Server state    | TanStack Vue Query                                 | Cache, dedupe, retry, loading/error có sẵn. Không chọn Pinia Colada vì còn mới                                                                                                                                                                                |
| HTTP Client     | Axios                                              | Team quen, interceptor refresh token rõ, có `onUploadProgress`. Không chọn openapi-fetch; đánh đổi: type response tự gắn từ `components['schemas']`                                                                                                           |
| i18n            | vue-i18n                                           |                                                                                                                                                                                                                                                               |
| UI              | Nuxt UI v4 (Vue + Vite mode, dựng trên Reka UI)    | Dựng trên Tailwind nên không xung đột style, dễ custom; có `UTable`, `UTree`, `UFileUpload`, Dashboard layout. Không chọn Ant Design Vue (CSS-in-JS xung đột Tailwind, cập nhật chậm), shadcn-vue (phải tự dựng Table/Tree), PrimeVue (pass-through dài dòng) |
| Styling         | Tailwind CSS v4                                    | Đi kèm Nuxt UI, một hệ token chung                                                                                                                                                                                                                            |
| Form            | vee-validate + `@vee-validate/zod`                 | Field array (Variants), dirty state, `setErrors` map lỗi API; một pattern cho mọi form                                                                                                                                                                        |
| Validation      | Zod                                                |                                                                                                                                                                                                                                                               |
| Table           | `UTable` (Nuxt UI, TanStack Table bên dưới)        | Server-side pagination/sort/filter                                                                                                                                                                                                                            |
| Chart           | ECharts + vue-echarts                              | Mạnh nhất cho báo cáo về sau; import theo module, lazy-load Dashboard. Không chọn Chart.js / ApexCharts                                                                                                                                                       |
| Rich text       | Tiptap (`@tiptap/vue-3`) + DOMPurify               | Headless, style bằng Tailwind. Không chọn CKEditor 5 (license GPL), Quill (ít cập nhật)                                                                                                                                                                       |
| Composables     | `@vueuse/core`                                     |                                                                                                                                                                                                                                                               |
| Date            | `@internationalized/date` + dayjs                  | DatePicker của Nuxt UI bắt buộc dùng `@internationalized/date`; dayjs để format hiển thị                                                                                                                                                                      |
| Icons           | Iconify — Lucide (`@iconify-json/lucide`)          | Nuxt UI hỗ trợ sẵn                                                                                                                                                                                                                                            |
| Unit Test       | Vitest                                             |                                                                                                                                                                                                                                                               |
| Component Test  | Vue Test Utils                                     |                                                                                                                                                                                                                                                               |
| E2E             | Playwright                                         |                                                                                                                                                                                                                                                               |
| Lint            | ESLint + perfectionist + unused-imports            | Tự sắp xếp và xoá import thừa. Không auto-import code nội bộ (chỉ component Nuxt UI)                                                                                                                                                                          |
| Formatter       | Prettier                                           |                                                                                                                                                                                                                                                               |
| Git hooks       | Husky + lint-staged                                |                                                                                                                                                                                                                                                               |
| Package Manager | npm                                                |                                                                                                                                                                                                                                                               |
| API types       | OpenAPI (`@nestjs/swagger`) + `openapi-typescript` |                                                                                                                                                                                                                                                               |
| API mock        | `axios-mock-adapter` (chỉ trong test)              | Thay transport của HttpClient qua `deps.transport` (test dùng runtime thì truyền `createAppRuntime({ transport })`); component test mock module `*.api.ts` bằng `vi.mock`. Không dùng MSW (scaffold-plan D18, §I)                                             |

---

# 3. Project Goals

CMS phải hỗ trợ:

- Authentication
- Authorization
- RBAC
- Dashboard
- Product management
- Category management
- Order management
- Customer management
- Inventory management
- Promotion management
- Store settings
- Media management
- Audit log
- Localization
- Error handling
- Loading states
- Empty states
- Responsive layout

---

# 4. Recommended Project Structure

Feature-based architecture. Không dùng `index.ts` để re-export không cần thiết.

Cây đầy đủ (kèm Phase tạo từng thư mục) là nguồn chuẩn ở `docs/plan/scaffold-plan.md` §A; tên file/thư mục theo §B (PascalCase cho `.vue` và `.ts`, không kebab-case). Tóm tắt:

```text
src/
├── app/                 # composition root — chỉ main.ts (và src/test/) import
│   ├── Runtime.ts       # createAppRuntime(): pinia, i18n, router, notifier, Session, HttpClient, QueryClient
│   ├── config/          # Env.config.ts, Ui.config.ts
│   ├── providers/       # ErrorHandling.ts
│   ├── router/          # Router.ts, Routes.ts, Guards.ts, RouteMeta.d.ts
│   └── views/           # NotFoundView.vue, ForbiddenView.vue
├── assets/
│   ├── images/          # Logo.svg
│   └── styles/          # main.css — file CSS duy nhất (token + Tailwind + Nuxt UI)
├── features/            # mỗi feature theo khung scaffold-plan §Q
│   ├── auth/            # UseAuth.ts là interface duy nhất (§8.1)
│   ├── StoreScope/      # Store đang quản lý, bọc Session (§9)
│   ├── products/        # (P5) xem §5
│   └── …                # categories, orders, customers, inventory, media… theo Phase §30
├── layouts/             # AuthLayout.vue, DashboardLayout.vue, Navigation.ts, components/
├── locales/             # vi.json, en.json
├── shared/              # dùng chung, KHÔNG import app/, layouts/, features/
│   ├── components/      # confirm/, feedback/, page/, table/…
│   ├── composables/     # UseListState.ts, UseNotify.ts, UseTheme.ts, UsePwa.ts
│   ├── lib/             # api/client/HttpClient.ts, api/errors/, query/, i18n/, session/, form/
│   ├── types/           # Api.generated.ts — sinh từ Swagger, KHÔNG sửa tay
│   └── utils/
├── test/                # Setup.ts, Render.ts, factories/
├── App.vue
└── main.ts              # createApp(App).use(createAppRuntime().plugin).mount('#app')
```

Chiều phụ thuộc: `main.ts → app → layouts → features → shared` (chặn bằng ESLint, scaffold-plan §E).

---

# 5. Feature Architecture

Mỗi feature phải độc lập nhất có thể. Khung chuẩn và quy tắc đặt tên `<Feature>` / `<Entity>`: scaffold-plan §Q.

Ví dụ `products`:

```text
features/products/
├── api/
│   └── Products.api.ts
├── components/
│   ├── ProductForm.vue
│   ├── ProductTable.vue
│   └── ProductStatusBadge.vue
├── schemas/
│   └── Product.schema.ts
├── types/
│   └── Product.types.ts
├── views/
│   ├── ProductListView.vue
│   ├── ProductCreateView.vue
│   └── ProductEditView.vue
├── Products.routes.ts
└── UseProducts.ts       # chỉ khi feature khác cần dùng
```

Không viết toàn bộ product logic vào một file `.vue` khổng lồ.

Cấu trúc trên là **tối đa**, không bắt buộc. Tối thiểu `api/ + types/ + views/`; không tạo thư mục rỗng.

---

# 6. API Layer

Mỗi feature có **một** file `api/<feature>.api.ts` chứa: hàm HTTP, query key và composable Vue Query.

**Interface của file chỉ là các composable.** Hàm HTTP và query key là chi tiết nội bộ — không export ra ngoài feature.

```ts
// features/products/api/Products.api.ts
import type { components } from '@shared/types/Api.generated'

type Product = components['schemas']['ProductDto']

// --- nội bộ ---
// Query key KHÔNG chứa storeId: Session xoá cache khi đổi Store (§9 Store scope).
const productKeys = {
  all: ['products'] as const,
  list: (params: ProductListParams) => [...productKeys.all, 'list', params] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
}

// HttpClient lấy qua useHttpClient() (inject), không import singleton. Trả thẳng `data`.
const getProducts = (http: HttpClient, params: ProductListParams) =>
  http.get('/products', { query: params })

// --- interface ---
export function useProductsQuery(params: MaybeRef<ProductListParams>) {
  /* ... */
}
export function useProductQuery(id: MaybeRef<string>) {
  /* ... */
}
export function useCreateProduct() {
  /* ... invalidate productKeys.all */
}
export function useUpdateProduct() {
  /* ... */
}
export function useDeleteProduct() {
  /* ... */
}
```

Quy tắc:

- Component **chỉ gọi composable** của feature, không gọi hàm HTTP, không gọi `axios` / `useHttpClient()`.
- Quy tắc invalidate sau mutation nằm trong composable mutation, không nằm ở component.
- Không tạo file `*.queries.ts` riêng — API và query là một module.

---

# 6.1. Shared Modules

Shared module dự kiến (ở `shared/`, không chứa tri thức nghiệp vụ). Chỉ tạo khi có nơi dùng thứ hai (scaffold-plan D33): `UseListState` tạo ở P5, `ApplyApiErrorToForm` tạo khi có form thứ hai.

| Module                                   | Interface                                                                 | Giấu bên trong                                                                                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/composables/UseListState.ts`     | `useListState(schema)` → `{ params, setFilter, setPage, setSort, reset }` | Đồng bộ URL ↔ params (§23), parse/validate query string bằng Zod, chuẩn `page/pageSize/sort=-field` (§22), reset `page` về 1 khi đổi filter/search, debounce search |
| `shared/lib/form/ApplyApiErrorToForm.ts` | `applyApiErrorToForm(error, form): boolean`                               | Map `details.fields` → `setErrors`; phân biệt 400 / 422; lỗi không gắn được field → trả `false` để caller toast                                                     |

Ví dụ trang list:

```ts
const { params, setFilter, setPage } = useListState(productListParamsSchema)
const { data, isPending, isError, refetch } = useProductsQuery(params)
```

---

# 7. HTTP Client

Một module duy nhất `src/shared/lib/api/client/HttpClient.ts` (interface và chi tiết: scaffold-plan §M.1, D34, D40):

- `createHttpClient({ baseURL, session, getLocale })` trả interface hẹp `get/post/put/patch/delete` có kiểu theo `paths` (OpenAPI). Không trả `AxiosInstance`, không export singleton.
- Gắn `Authorization` từ `session.getAccessToken()`, `X-Store-Id` từ `session.getStoreId()`, `Accept-Language` từ locale hiện tại.
- Mọi lỗi chuẩn hoá thành `ApiError`; timeout mặc định 15s.
- `*.api.ts` lấy client bằng `useHttpClient()` trong composable.
- Object được dựng một lần trong composition root `createAppRuntime()` (`src/app/Runtime.ts`, D37); `main.ts` và `src/test/Render.ts` gọi cùng hàm.

Request 401 đồng thời được **gom vào một lần** `session.refresh()`; request refresh đi qua HttpClient với `skipAuth: true`. Refresh thất bại → Session phát `authFailure` → runtime điều hướng về login.

Đây là phần logic khó nhất — bắt buộc test trong `HttpClient.spec.ts` bằng `axios-mock-adapter` (qua `deps.transport`): N request 401 đồng thời → đúng 1 lần refresh → N request retry thành công; refresh thất bại → `authFailure`.

---

# 7.1. API Contract — Swagger

FE kết nối tới API contract qua **Swagger (OpenAPI) URL** do NestJS expose.

```text
NestJS (@nestjs/swagger)
    │
    │  GET {API_SWAGGER_URL}   (ví dụ http://localhost:3000/api/docs-json)
    ▼
openapi-typescript
    │
    ▼
src/types/api.generated.ts
```

Script trong `package.json`:

```json
{
  "scripts": {
    "gen:api": "openapi-typescript $API_SWAGGER_URL -o src/types/api.generated.ts"
  }
}
```

Quy tắc:

- **Không viết tay** type cho request/response — lấy từ `api.generated.ts`.
- `api.generated.ts` được commit để build/CI không phụ thuộc BE đang chạy.
- Khi BE đổi contract → chạy `npm run gen:api` → `npm run typecheck` sẽ báo chỗ FE bị ảnh hưởng.
- CI kiểm tra file generated khớp với Swagger của môi trường dev/staging.
- `features/*/types/` chỉ chứa type riêng của UI (form model, view model), alias từ type generated:

```ts
import type { components } from '@shared/types/Api.generated'

export type Product = components['schemas']['ProductDto']
```

- BE phải khai báo đầy đủ DTO bằng `@ApiProperty` / `@ApiResponse`, nếu không type sinh ra sẽ là `unknown`.

---

# 8. Authentication

CMS phải có authentication.

Flow:

```text
Login
  │
  ▼
NestJS
  │
  ├── access token
  └── refresh token
         │
         ▼
      Vue CMS
```

Token storage:

```text
Access token  → memory (Pinia, không persist)
Refresh token → cookie httpOnly; Secure; SameSite=Strict (do NestJS set)
```

- Không lưu token vào `localStorage` / `sessionStorage`.
- Axios dùng `withCredentials: true` cho endpoint `/auth/refresh`.
- Endpoint `/auth/refresh` được bảo vệ CSRF (SameSite + kiểm tra `Origin` hoặc CSRF token).
- Reload trang → gọi `/auth/refresh` để lấy lại access token, sau đó `/auth/me`.
- **Giả định domain:** `SameSite=Strict` yêu cầu CMS và API **cùng site** (ví dụ `cms.fashion.com` và `api.fashion.com`). Nếu khác site phải đổi sang `SameSite=None` + CSRF token bắt buộc.

Authentication layer phải xử lý:

- Login
- Logout
- Refresh token
- Current user
- Session expiration
- Unauthorized response
- Permission

## 8.1. Auth module interface

Toàn bộ auth và permission nằm trong `features/auth`. Không có `UseAuth.ts` / `UsePermission.ts` / `Permission.store.ts` ở chỗ khác.

Interface duy nhất:

```ts
// features/auth/UseAuth.ts
useAuth() → {
  user,                       // Ref<CurrentUser | null>
  isAuthenticated,            // ComputedRef<boolean>
  can(permission: string),    // boolean — tính từ user.permissions
  login(credentials),
  logout(),
}
```

- Permission **tính từ** `user.permissions` của `/auth/me`, không lưu thêm bản sao ở store khác.
- Route guard, `v-if` ẩn button, sidebar menu đều dùng cùng `can()`.
- `Auth.store.ts` là chi tiết nội bộ; code ngoài feature không import trực tiếp.
- Token và Store hiện tại do `Session` (`shared/lib/session/Session.ts`) sở hữu; `useAuth()` bọc Session: `login()` gọi API rồi `session.signIn()`, `logout()` = `session.logout()` (scaffold-plan §M.2).

---

# 9. RBAC

CMS có các role:

```text
Master Store Manager
Store Manager
Order Staff
```

Ví dụ:

```text
Master Store Manager
├── Products
├── Categories
├── Orders
├── Customers
├── Inventory
├── Promotions
├── Users
├── Roles
└── Settings

Store Manager
├── Products
├── Categories
├── Orders
├── Customers
├── Inventory
└── Promotions

Order Staff
└── Orders
```

FE **chỉ kiểm tra permission**, không kiểm tra tên role.

`GET /auth/me` trả về:

```ts
{
  id: string
  fullName: string
  roles: string[]
  permissions: string[]   // ví dụ: ['product:read', 'product:write', 'order:read']
  stores: { id: string; name: string }[]
}
```

Mapping role → permission do BE quản lý; FE không hard-code.

## Store scope

Master Store Manager có thể làm việc với nhiều store, Store Manager / Order Staff gắn với store của mình.

- Store hiện tại do `Session` sở hữu; feature `StoreScope` bọc lại qua `useStoreScope()`.
- Mọi request gửi header `X-Store-Id` (HttpClient lấy từ `session.getStoreId()`) — chờ BE xác nhận.
- BE kiểm tra user có quyền trên store đó.
- Query key **không** chứa `storeId`. Khi đổi store, `session.switchStore(id)` gọi `queryClient.clear()` → cache store cũ bị xoá, query đang mở fetch lại. Xoá cache chỉ xảy ra trong Session (scaffold-plan §M.3).

Không chỉ ẩn UI.

Frontend permission chỉ là lớp UX.

Backend NestJS vẫn phải kiểm tra authorization (Guards + `@Permissions()` decorator).

---

# 10. Route Protection

Ví dụ:

```text
/admin
/admin/products
/admin/products/create
/admin/products/:id/edit
/admin/categories
/admin/orders
/admin/customers
```

Route metadata:

```ts
{
  path: '/admin/products',
  meta: {
    requiresAuth: true,
    permissions: ['product:read']
  }
}
```

Navigation guard kiểm tra authentication và permission bằng `useAuth().can()`.

---

# 11. Dashboard

Dashboard cần hiển thị:

- Revenue
- Orders
- Customers
- Products
- Low-stock products
- Pending orders
- Recent orders
- Sales chart
- Top products

Ví dụ:

```text
┌─────────────────────────────────────────┐
│ Revenue       Orders       Customers    │
│ $120,000      1,240        5,230        │
├─────────────────────────────────────────┤
│                                         │
│             Sales Chart                 │
│                                         │
├─────────────────────────────────────────┤
│ Recent Orders                           │
│ #1001  #1002  #1003  #1004             │
└─────────────────────────────────────────┘
```

---

# 12. Product Management

Product CRUD:

```text
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
```

Quy ước: JSON dùng **camelCase** cho cả request và response.

Product fields:

```text
id
name
slug
description
price
compareAtPrice
status
brand
categories
primaryCategory
variants
images
inventory
seoTitle
seoDescription
createdAt
updatedAt
```

---

# 13. Product Form

Product form nên chia thành sections:

```text
Product
├── Basic Information
├── Description
├── Pricing
├── Categories
├── Variants
├── Images
├── Inventory
└── SEO
```

Không tạo một form khổng lồ khó maintain.

---

# 14. Category Management

Category hỗ trợ tree:

```text
Men
├── Clothing
│   ├── T-Shirts
│   └── Jackets
└── Shoes
    ├── Sneakers
    └── Boots

Women
├── Clothing
└── Shoes
```

Frontend cần hỗ trợ:

- Tree view
- Create category
- Edit category
- Move category
- Delete category
- Status
- SEO
- Localized data

Định dạng localized data (cần BE xác nhận trước Phase 6):

```ts
type Localized<T = string> = { vi: T; en: T }

// ví dụ
name: Localized // { vi: 'Áo thun', en: 'T-Shirts' }
```

Backend vẫn chịu trách nhiệm kiểm tra:

- Maximum depth
- Circular reference
- Permission
- Business rules

---

# 15. Order Management

Order list:

```text
Order ID
Customer
Total
Payment
Fulfillment
Status
Created At
Actions
```

Order status:

```text
PENDING
CONFIRMED
PROCESSING
SHIPPED
DELIVERED
CANCELLED
REFUNDED
```

Order detail:

```text
Customer
Shipping address
Items
Payment
Shipment
Timeline
Notes
```

---

# 16. Customer Management

```text
Customer list
├── Search
├── Filter
├── Pagination
├── Status
└── Customer detail
```

Customer detail:

```text
Profile
Orders
Addresses
Activity
```

---

# 17. Inventory

Inventory cần hỗ trợ:

```text
Product
SKU
Variant
Available
Reserved
Sold
Low stock
```

Có thể có:

```text
Stock adjustment
Stock history
Low-stock alert
```

---

# 17.1. Media Upload

Upload trực tiếp lên object storage qua presigned URL:

```text
1. FE  → POST /api/v1/media/presign   (fileName, mimeType, size)
2. BE  → trả uploadUrl + mediaId
3. FE  → PUT file lên uploadUrl
4. FE  → POST /api/v1/media/:id/complete
```

FE validate trước khi upload: mime type, dung lượng tối đa, số lượng file. BE vẫn validate lại.

Toàn bộ flow nằm trong `features/media` — là nghiệp vụ nên không ở `shared/` (scaffold-plan D33). Feature khác chỉ dùng interface công khai `useMedia()`:

- `useMedia().upload(files)` → `Promise<string[]>` (`mediaId[]`), kèm `progress`, `cancel`.
- `useMedia().pickImages()` → mở `MediaPickerModal`, trả `Promise<Media[]>`.

Bên trong (`MediaUpload.ts`): 4 bước presign → PUT → complete, validate mime/size/số lượng, progress, huỷ, retry. PUT lên S3 dùng `fetch` riêng, không qua HttpClient (khác origin, không gắn token).

---

# 18. State Management

Dùng Pinia cho **client/global state**.

Không đưa tất cả API response vào Pinia.

Phân biệt:

```text
Client state
└── Pinia

Server state
└── TanStack Vue Query
```

Mỗi feature định nghĩa query key và composable trong `api/<Feature>.api.ts` (xem §6):

```ts
// features/products/api/Products.api.ts
export function useProductsQuery(params: MaybeRef<ProductListParams>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => productKeys.list(unref(params))),
    queryFn: () => getProducts(http, unref(params)),
  })
}
```

Query key **không** chứa `storeId` — Session xoá cache khi đổi Store (xem §9 Store scope).

Mutation xong thì `invalidateQueries` theo key, không tự cập nhật Pinia.

Ví dụ Pinia:

```text
Auth.store.ts         (nội bộ features/auth)
StoreScope.store.ts   (nội bộ features/StoreScope)
Session.store.ts      (nội bộ shared/lib/session — token + storeId)
```

Không có `App.store.ts` / `Permission.store.ts` — locale do `createAppI18n()` sở hữu, theme do `useTheme()`, sidebar dùng `useLocalStorage`; permission tính từ `Auth.store` qua `useAuth().can()`.

Không tạo:

```text
Product.store.ts
Category.store.ts
Order.store.ts
...
```

chỉ để lưu mọi API response nếu không thực sự cần.

---

# 19. Form Validation

Dùng Zod cho validation.

Ví dụ:

```ts
const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  slug: z.string().min(1),
})
```

Form dùng vee-validate với Zod schema (`toTypedSchema`). Lỗi `details.fields` từ API đẩy vào form qua `applyApiErrorToForm(error, form)` (§6.1), không tự map trong từng form. Các section lớn (Variants) dùng `useFieldArray`.

Rich text (`description`) dùng Tiptap; khi render HTML luôn qua DOMPurify — không `v-html` HTML chưa sanitize.

Validation cần tồn tại ở:

```text
Frontend
+
Backend
```

Frontend validation phục vụ UX.

Backend validation đảm bảo security và data integrity.

---

# 20. Error Handling

Chuẩn hóa API error:

```ts
type ApiError = {
  code: string
  message: string
  details?: Record<string, unknown>
}
```

NestJS mặc định trả `{ statusCode, message, error }` (với `ValidationPipe`, `message` là mảng). BE phải có **global exception filter** chuẩn hóa về `ApiError`:

```json
{
  "code": "PRODUCT_SLUG_TAKEN",
  "message": "Slug already exists",
  "details": { "fields": { "slug": ["Slug already exists"] } }
}
```

`details.fields` được map thẳng vào lỗi của form.

UI phải phân biệt:

```text
400 → Validation error (sai format / DTO validation)
401 → Unauthorized
403 → Forbidden
404 → Not found
409 → Conflict
422 → Business validation (đúng format nhưng vi phạm business rule)
429 → Rate limited
500 → Server error
```

---

# 21. Loading / Empty / Error States

Mọi màn hình API phải có:

```text
Loading
Empty
Error
Success
```

Ví dụ:

```text
Loading:
Skeleton

Empty:
No products found.

Error:
Unable to load products.
[Retry]
```

Không để màn hình trắng khi API lỗi.

---

# 22. Table

Các table lớn cần hỗ trợ:

- Pagination
- Sorting
- Filtering
- Search
- Column visibility
- Row actions
- Bulk actions

Không load toàn bộ dữ liệu hàng nghìn record về browser.

Pagination/filter/sort nên được xử lý server-side khi dataset lớn.

Format chuẩn:

```text
GET /api/v1/products?page=1&pageSize=20&sort=-createdAt&search=nike&status=published
```

```ts
type Paginated<T> = {
  data: T[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
```

`sort`: tên field, prefix `-` là giảm dần.

`Paginated<T>` là **ngoại lệ** của quy tắc "không viết tay type" (§7.1): openapi-typescript không sinh generic. Đặt ở `types/pagination.types.ts`; BE phải giữ đúng shape này cho mọi endpoint list.

Params list được quản lý bởi `useListState` (§6.1), không tự viết trong từng view.

---

# 23. URL State

Các filter quan trọng nên được đồng bộ URL.

Ví dụ:

```text
/admin/products?page=2
  &status=published
  &category=shoes
  &search=nike
```

Lợi ích:

- Refresh không mất filter
- Bookmark được
- Share URL được
- Browser back/forward hoạt động đúng

---

# 24. Security

Frontend CMS cần:

- HTTPS
- Authentication
- RBAC
- Permission checks
- XSS protection
- CSRF protection theo backend architecture
- Safe rendering
- Input validation
- Secure token handling
- Logout khi session hết hạn

Không bao giờ tin permission từ frontend.

Ví dụ:

```text
Button hidden
≠
API protected
```

Backend vẫn phải enforce:

```text
DELETE /products/:id
```

---

# 25. Testing

## Unit Test

Test:

- utilities
- composables
- validation
- stores
- business logic

Tool:

```text
Vitest
```

## Component Test

Test:

- Product form
- Product table
- Modal
- Permission component

Tool:

```text
Vue Test Utils
+
Vitest
+
vi.mock (module *.api.ts) / axios-mock-adapter (HttpClient)
```

Component test render qua `renderWithPlugins()` (gọi chính `createAppRuntime()` với override) và mock module `*.api.ts` bằng `vi.mock`. Test của HttpClient thay transport bằng `axios-mock-adapter`. Không dùng MSW (scaffold-plan §I).

Bắt buộc test cho shared modules (§6.1) và refresh-token single-flight (§7).

## E2E

Các flow quan trọng:

```text
Login
Create product
Edit product
Create category
Process order
Logout
```

Tool:

```text
Playwright
```

---

# 26. Code Quality

Bắt buộc: ESLint, Prettier, TypeScript strict, Husky + lint-staged, Conventional Commits. CI mỗi PR: `gen:api` (kiểm contract), lint, typecheck, test, build, e2e (critical flows).

Chi tiết (Git flow trunk-based, hooks, rule ESLint, template PR/issue, tooling): `docs/plan/scaffold-plan.md` §B–§G.

---

# 27. Environment

Commit `.env.example`, đưa `.env*.local` và `.env` vào `.gitignore`.

```env
# Runtime (expose ra browser)
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Dev tooling (chỉ dùng khi chạy gen:api, không expose)
API_SWAGGER_URL=http://localhost:3000/api/docs-json
```

Không commit secret.

Chỉ expose biến có prefix:

```text
VITE_
```

Không đặt secret backend vào frontend environment.

---

# 28. Development Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run gen:api
npm test
npm run test:e2e
```

---

# 29. Initial Setup

Scaffold thẳng vào thư mục gốc repo (scaffold-plan D1), Node 22 LTS:

```bash
npm create vite@latest . -- --template vue-ts
npm install
```

Danh sách package và lệnh cài là nguồn chuẩn ở `docs/plan/scaffold-plan.md` §K: K.1 (dependencies Foundation), K.2 (cài theo Phase — `echarts`, Tiptap, `dompurify`), K.3 (devDependencies), K.5 (không dùng: `msw`, `lodash`, `moment`, `sass`, `vuex`).

## Nuxt UI + Tailwind

Nuxt UI v4 dựng trên Tailwind v4 — không có xung đột style, dùng chung một hệ token.

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), ui()],
})
```

Plugin `ui` được `app.use()` trong `createAppRuntime()` (`app/Runtime.ts`, scaffold-plan §M.2); `main.ts` không tự cài plugin.

```css
/* src/assets/styles/main.css — file CSS duy nhất, không variables.css (scaffold-plan §J, §L.9) */
@import 'tailwindcss';
@import '@nuxt/ui';
/* token @theme … */
```

```vue
<!-- App.vue: bọc toàn app -->
<UApp><RouterView /></UApp>
```

Màu ngữ nghĩa và mặc định component chỉ khai báo ở `app/config/Ui.config.ts` (truyền vào `ui()` trong `vite.config.ts`); token CSS ở `main.css` (scaffold-plan §J, §L).

## Import convention

- Chỉ component Nuxt UI (`UButton`, `UTable`...) được auto-register qua plugin `ui()`.
- `ref`, `computed`, composable, API, component nội bộ: **import tường minh**. Không dùng `unplugin-auto-import`.
- VS Code tự thêm import; ESLint (`eslint-plugin-perfectionist` + `eslint-plugin-unused-imports`) sắp xếp và xóa import thừa; Prettier format.

```jsonc
// .vscode/settings.json (commit vào repo)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.addMissingImports.ts": "explicit",
    "source.fixAll.eslint": "explicit",
  },
}
```

Recommended extensions: Vue - Official, ESLint, Prettier, Tailwind CSS IntelliSense.

---

# 30. Initial Feature Development Order

Không làm tất cả module cùng lúc.

## Phase 1 — Foundation

```text
1. Vite
2. Vue 3
3. TypeScript
4. Router
5. Pinia
6. Axios + TanStack Vue Query
7. Swagger → openapi-typescript (gen:api)
8. Tailwind
9. Nuxt UI
10. vue-i18n
11. ESLint
12. Prettier
13. CI
```

## Phase 2 — Authentication

```text
Login
Logout
Current user
Token refresh
Route guard
Permission
RBAC
```

## Phase 3 — Layout

```text
Sidebar
Header
Breadcrumb
User menu
Page layout
Responsive layout
```

## Phase 4 — Dashboard

```text
Stats
Charts
Recent orders
Low stock
Top products
```

## Phase 5 — Product

```text
Product list
Product detail
Create
Edit
Delete
Images
Variants
Inventory
SEO
```

## Phase 6 — Category

```text
Tree
Create
Edit
Delete
Move
SEO
Localization
```

## Phase 7 — Order

```text
Order list
Order detail
Status
Payment
Shipment
Timeline
```

## Phase 8 — Customer

```text
Customer list
Customer detail
Orders
Addresses
```

## Phase 9 — Inventory

```text
Stock
Adjustment
History
Low stock
```

## Phase 10 — Advanced

```text
Promotions
Media
Users
Roles
Settings
Audit logs
```

---

# 31. Definition of Done

Một feature chỉ được xem là hoàn thành khi có:

```text
[ ] API integration
[ ] Type lấy từ api.generated.ts (Swagger)
[ ] Validation
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Permission
[ ] Responsive UI
[ ] Unit/component test
[ ] E2E test nếu là critical flow
[ ] Accessibility
[ ] Error handling
[ ] Code review
```

---

# 32. Architecture Principle

Ưu tiên:

```text
Simple
   ↓
Maintainable
   ↓
Testable
   ↓
Scalable
```

Không over-engineering ngay từ đầu.

Không tạo abstraction chỉ vì có thể.

Ví dụ không cần:

```text
BaseCrudService
GenericRepository
AbstractApiFactory
UniversalTableEngine
```

nếu project chưa có nhu cầu thực tế.

---

# 33. Frontend Architecture Goal

CMS phải giúp developer có thể thêm module mới mà không ảnh hưởng module cũ.

Ví dụ thêm:

```text
Coupons
```

chỉ cần:

```text
features/coupons/
├── api/
├── components/
├── schemas/
├── types/
└── views/
```

và đăng ký route/menu/permission.

---

# 34. Final Architecture

```text
fashion-store/
│
├── storefront/
│   └── Next.js + React
│       └── Customer Store
│
├── cms/
│   └── Vue 3 + Vite
│       ├── Pinia
│       ├── Vue Router
│       ├── Nuxt UI
│       ├── Tailwind
│       └── TypeScript
│
└── backend/
    └── NestJS
        ├── REST API
        ├── PostgreSQL
        ├── Redis
        └── BullMQ
```

## Final Technology Decision

### Customer Store

```text
Next.js
React
TypeScript
Tailwind
TanStack Query
SEO
SSR/SSG
```

### CMS

```text
Vue 3
Vite
TypeScript
Vue Router
Pinia
TanStack Vue Query
Nuxt UI
Tailwind
Zod + vee-validate
vue-echarts
Tiptap + DOMPurify
vue-i18n
openapi-typescript
Vitest
Playwright
```

### Backend

```text
NestJS
TypeScript
Prisma / TypeORM
PostgreSQL
Redis
BullMQ
Swagger (OpenAPI)
```

Mục tiêu cuối cùng:

```text
                  Fashion Store Platform
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
       Customer Store                CMS
       React + Next.js               Vue 3
             │                         │
             └────────────┬────────────┘
                          ▼
                    NestJS API
                          │
                 ┌────────┼────────┐
                 ▼        ▼        ▼
             PostgreSQL  Redis   BullMQ
```

**Nguyên tắc quan trọng:** Storefront và CMS là hai ứng dụng frontend độc lập, nhưng cùng sử dụng một API contract và cùng domain business từ NestJS Backend.
