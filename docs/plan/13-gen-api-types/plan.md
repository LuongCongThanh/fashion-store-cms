# 13 — Script sinh API types

Status: in-progress
Blocked by: 05
Nguồn: Step 6 trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41, trong đó D24, D32 đã huỷ), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 6 — Script sinh API types

**Làm gì**

- Script `gen:api` dùng `openapi-typescript`, đọc `OPENAPI_URL` từ env (không có tiền tố `VITE_`, không expose ra browser).
- Nếu BE chưa có Swagger: `src/shared/types/Api.generated.ts` placeholder.

**Kiểm tra:** `npm run gen:api` chạy được (hoặc báo rõ thiếu URL).

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

#### T.3. DTO không đi ra khỏi `api/`

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

export const toProductPayload = (
  input: ProductInput,
): components['schemas']['UpsertProductDto'] => ({
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
  <ProductTable
    v-else
    :items="data?.items ?? []"
    :loading="isPending"
    @delete="remove"
    @page="setPage"
  />
</template>
```
