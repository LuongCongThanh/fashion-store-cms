# Luồng dữ liệu và SOLID — lịch sử scaffold

## T. Luồng dữ liệu — tách bạch data khỏi UI

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

### T.1. Các tầng trong một feature

```text
            ┌──────────────────────────── feature ─────────────────────────────┐
 Route ──►  views/            container: lấy data, điều phối, KHÔNG markup phức tạp
              │  props ▼  ▲ emits
            components/       presentational: chỉ props in / emits out, KHÔNG gọi API
              │
            [composables/]    logic màn hình: form, filter, quyền — tuỳ chọn
              │
            api/<Feature>.api.ts   server state: Vue Query composable, query key, invalidate
              │
            [api/<Entity>.mapper.ts] DTO ⇄ Model — chỉ khi lệch
            └──┼──────────────────────────────────────────────────────────────┘
               ▼
            shared/lib/api/client/HttpClient  ──►  BE
```

| Tầng                           | Được làm                                                                                                                        | Không được làm                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `views/` (container)           | Gọi composable của `api/` và `composables/`; truyền **model** xuống component qua props; xử lý emits; Loading/Empty/Error (§21) | Gọi `useHttpClient()`; map DTO; chứa logic validate                     |
| `components/` (presentational) | Render theo props, emit sự kiện, state UI cục bộ (mở/đóng, hover)                                                               | Import `../api/`, `../stores/`, `../composables/`; gọi router; biết DTO |
| `composables/` (feature)       | Ghép schema + mutation + `applyApiErrorToForm`; tính toán dẫn xuất                                                              | Render; giữ bản sao dữ liệu server                                      |
| `api/<Feature>.api.ts`         | Hàm HTTP (nội bộ), query key, `useXxxQuery` / `useXxxMutation`, invalidate; **trả về Model**                                    | Toast thành công, điều hướng, UI                                        |
| `api/<Entity>.mapper.ts`       | `toModel(dto)`, `toPayload(input)` — thuần, có test                                                                             | Gọi HTTP, phụ thuộc Vue                                                 |
| `types/`                       | **Model** của FE (tên field theo FE, `Date` thay chuỗi ISO, tiền là `number`…)                                                  | Re-export DTO                                                           |
| `schemas/`                     | Zod cho **input** form và list params                                                                                           | Kiểu server trả về                                                      |

### T.2. Ba loại dữ liệu, ba chỗ ở

| Loại                    | Ở đâu                                 | Ví dụ                                          | Quy tắc                                                                        |
| ----------------------- | ------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| Server state            | Vue Query cache (qua `api/`)          | danh sách sản phẩm, đơn hàng                   | **Không** copy vào Pinia/`ref`; đọc qua query, đổi qua mutation + invalidate   |
| Client state dùng chung | Pinia trong `stores/` của feature     | token, Store đang chọn                         | Chỉ `api/` và `Use<Feature>.ts` đọc/ghi                                        |
| UI / form state         | `ref` trong component hoặc composable | bản nháp form, dialog mở, filter (đồng bộ URL) | Form làm việc trên **bản nháp** (`XxxInput` từ schema), submit mới `toPayload` |

### T.3. DTO không đi ra khỏi `api/`

- Kiểu `components['schemas'][...]` từ `Api.generated.ts` **chỉ** được import trong `features/*/api/**` và `shared/lib/api/**` (ESLint §E, `noDto`).
- Khi DTO trùng Model: **không tạo mapper**. `types/` vẫn khai báo Model độc lập (không alias DTO); `api/` trả DTO với kiểu Model — TypeScript so khớp cấu trúc nên BE đổi field là typecheck báo lỗi ngay trong `api/`.
- Khi lệch (đổi tên, `Date`, tiền chuỗi → `number`…): tạo `<Entity>.mapper.ts` + test; BE đổi tiếp chỉ sửa mapper, view/component không đổi.

```ts
// features/products/api/Product.mapper.ts
import type { components } from '@shared/types/Api.generated'
import type { Product, ProductInput } from '../types/Product.types'

type ProductDto = components['schemas']['ProductDto']

export const toProduct = (dto: ProductDto): Product => ({
  id: dto.id,
  name: dto.name,
  price: Number(dto.price),
  status: dto.status,
  updatedAt: new Date(dto.updatedAt),
})

export const toProductPayload = (input: ProductInput): components['schemas']['UpsertProductDto'] => ({
  name: input.name.trim(),
  price: String(input.price),
  status: input.status,
})
```

```ts
// features/products/api/Products.api.ts — interface: chỉ các composable
export function useProductsQuery(params: MaybeRef<ProductListParams>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => productKeys.list(toValue(params))),
    queryFn: async ({ signal }) => {
      const page = await http.get('/products', { query: toValue(params), signal })
      return { ...page, items: page.items.map(toProduct) } // Model, không DTO
    },
  })
}
```

```vue
<!-- features/products/views/ProductListView.vue — container -->
<script setup lang="ts">
const { params, setPage } = useListState(productListParamsSchema)
const { data, isPending, isError, refetch } = useProductsQuery(params)
const { remove } = useProductActions() // composables/: confirm + mutation
</script>

<template>
  <ErrorState v-if="isError" @retry="refetch" />
  <ProductTable v-else :items="data?.items ?? []" :loading="isPending" @delete="remove" @page="setPage" />
</template>
```

---

## U. Áp dụng SOLID

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

Áp dụng ở mức **module** (file, composable, adapter), không ép thành class/interface cho mọi thứ. Một seam chỉ tạo khi có ≥ 2 adapter thật (VD: HttpClient thật + adapter test).

| Nguyên lý                     | Áp dụng trong CMS                                                                                                                                                                                                                                                                                                     | Ở đâu                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **S** — Single Responsibility | Mỗi tầng một lý do để đổi: hiển thị (component), điều phối (view), logic màn hình (composable), server state (api), hình dạng dữ liệu (mapper), vận chuyển HTTP (HttpClient). Tầng tuỳ chọn (composable, mapper) chỉ tạo khi có trách nhiệm thật                                                                      | §T.1, §O.3                 |
| **O** — Open/Closed           | Mở rộng bằng **khai báo**, không sửa lõi: thêm route → tự vào sidebar/command palette/phím tắt qua `meta`; thêm mã lỗi → thêm key `errors.*`; thêm cột bảng → mảng `columns` truyền vào `DataTable`; thêm trạng thái → thêm dòng trong map màu                                                                        | §S.1, §O.2, §L.4, §22      |
| **L** — Liskov Substitution   | Mọi adapter tại một seam phải giữ đúng hợp đồng của interface: `HttpClient` test (adapter mock) vẫn ném `ApiError`, vẫn trả `data`; Session dựng với `initial` trong test vẫn phát `authFailure` khi refresh thất bại. Component bọc Nuxt UI (VD `DataTable`) nhận/emit đúng như component gốc, không đổi nghĩa props | §M, §I                     |
| **I** — Interface Segregation | Interface nhỏ theo nhu cầu caller: `useStoreScope()` chỉ 3 thành viên; HttpClient chỉ thấy `Session` (token, storeId, refresh) — không thấy `login`, `user`, danh sách Store; props component chỉ nhận Model cần hiển thị, không nhận cả object query                                                                 | §M, §Q.3                   |
| **D** — Dependency Inversion  | Tầng thấp không biết tầng cao: `HttpClient` phụ thuộc hàm (`getAccessToken`, `getStoreId`…), không import feature; feature phụ thuộc interface `HttpClient`, không phụ thuộc axios; mọi thứ được nối ở **một** nơi — `createAppRuntime()` trong `app/Runtime.ts` (composition root, D37)                              | §A (chiều phụ thuộc), §M.2 |

**Không làm (tránh over-engineering):**

- Không tạo `IProductRepository` + class `ProductRepository` — `Products.api.ts` đã là seam; test đi qua HTTP (§I).
- Không DI container (inversify…) — `provide/inject` của Vue + composition root là đủ.
- Không base class cho component/store; tái sử dụng bằng composable và composition.
- Không tách interface khi chỉ có một adapter và không có test cần thay thế.
- Không tạo module chuyển tiếp: mapper identity, composable chỉ gọi lại mutation, file interceptor 3 dòng.

**Kiểm soát:** ESLint (§E) chặn `components/` import `api/`/`stores/`/`composables/` và chặn DTO ngoài `api/`; checklist PR thêm mục "Không có DTO ngoài `api/`, component không gọi API".

---
