import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { ProductInfoInput, VariantInput } from '@features/products/schemas/Product.schema'
import type { ProductStatus } from '@features/products/types/Product.types'
import type { components } from '@shared/lib/api/Api.generated'

import { toProductDetail } from './Product.mapper'

import type { ProductDetailResponseDto, ProductResponseDto } from './Product.mapper'

type CreateProductDto = components['schemas']['CreateProductDto']
type UpdateProductDto = components['schemas']['UpdateProductDto']
type CreateVariantDto = components['schemas']['CreateVariantDto']
type UpdateVariantDto = components['schemas']['UpdateVariantDto']

const path = (id: string) => `/admin/products/${encodeURIComponent(id)}`
export const productDetailKey = (id: string) => ['products', 'detail', id] as const

export function useProductQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => productDetailKey(toValue(id))),
    enabled: computed(() => !!toValue(id)),
    queryFn: async ({ signal }) =>
      toProductDetail((await http.get(path(toValue(id)), { signal })) as ProductDetailResponseDto),
  })
}

/** Mọi thay đổi trên trang sửa đọc lại chi tiết và danh sách. */
function useInvalidateProduct(id: MaybeRefOrGetter<string>) {
  const client = useQueryClient()
  return () =>
    Promise.all([
      client.invalidateQueries({ queryKey: productDetailKey(toValue(id)) }),
      client.invalidateQueries({ queryKey: ['products', 'list'] }),
    ])
}

/** Sản phẩm mới luôn là DRAFT; Biến thể và ảnh thêm ở trang sửa. */
export function useCreateProductMutation() {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: async (input: ProductInfoInput) => {
      const body: CreateProductDto = {
        name: input.name,
        description: input.description.trim() || undefined,
        categoryId: input.categoryId,
        weightGrams: input.weightGrams,
        gender: input.gender,
      }
      return (await http.post('/admin/products', body)) as ProductResponseDto
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['products', 'list'] }),
  })
}

export function useUpdateProductMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const invalidate = useInvalidateProduct(id)
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: ProductInfoInput) => {
      const body: UpdateProductDto = {
        name: input.name,
        description: input.description.trim(),
        categoryId: input.categoryId,
        weightGrams: input.weightGrams,
        gender: input.gender,
      }
      return http.patch(path(toValue(id)), body)
    },
    onSuccess: invalidate,
  })
}

/** Publish = PATCH status ACTIVE; ngừng bán / bán lại dùng endpoint archive / unarchive. */
export function useProductStatusMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const invalidate = useInvalidateProduct(id)
  return useMutation({
    mutationFn: (target: ProductStatus) => {
      const base = path(toValue(id))
      if (target === 'ARCHIVED') return http.post(`${base}/archive`, {})
      const body: UpdateProductDto = { status: 'ACTIVE' }
      return http.patch(base, body)
    },
    onSuccess: invalidate,
  })
}

export function useUnarchiveProductMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const invalidate = useInvalidateProduct(id)
  return useMutation({
    mutationFn: () => http.post(`${path(toValue(id))}/unarchive`, {}),
    onSuccess: invalidate,
  })
}

/** API trả 409 khi SKU trùng hoặc size × màu đã có trên Sản phẩm này. */
export function useCreateVariantMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const invalidate = useInvalidateProduct(id)
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: VariantInput) => {
      const body: CreateVariantDto = input
      return http.post(`${path(toValue(id))}/variants`, body)
    },
    onSuccess: invalidate,
  })
}

/** Đổi giá, hoặc ngừng bán / bán lại một Biến thể; SKU, size, màu không đổi được. */
export function useUpdateVariantMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const invalidate = useInvalidateProduct(id)
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: { variantId: string; price?: number; archived?: boolean }) => {
      const base = `${path(toValue(id))}/variants/${encodeURIComponent(input.variantId)}`
      if (input.archived !== undefined) return http.post(`${base}/${input.archived ? 'archive' : 'unarchive'}`, {})
      const body: UpdateVariantDto = { price: input.price }
      return http.patch(base, body)
    },
    onSuccess: invalidate,
  })
}
