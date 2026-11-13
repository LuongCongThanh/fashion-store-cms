import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { ProductListParams } from '@features/products/schemas/ProductList.schema'
import type { ProductListItem } from '@features/products/types/Product.types'
import type { components } from '@shared/types/Api.generated'
import type { Paginated } from '@shared/types/Pagination.types'

import { toProductListItem } from './Product.mapper'

type PaginatedProductResponseDto = components['schemas']['PaginatedProductResponseDto']

export function useProductsQuery(params: MaybeRefOrGetter<ProductListParams>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['products', 'list', toValue(params)]),
    queryFn: async ({ signal }): Promise<Paginated<ProductListItem>> => {
      const { page, pageSize, search, categoryId, status } = toValue(params)
      const dto = (await http.get('/admin/products', {
        signal,
        query: { page, limit: pageSize, q: search || undefined, categoryId, status },
      })) as PaginatedProductResponseDto
      const { limit, ...meta } = dto.meta
      return { data: dto.data.map(toProductListItem), meta: { ...meta, pageSize: limit } }
    },
  })
}
