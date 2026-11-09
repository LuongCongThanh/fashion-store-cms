import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'
import { useLocale } from '@shared/lib/i18n/I18n'

import type { ProductListParams } from '@features/products/schemas/ProductList.schema'
import type { Product } from '@features/products/types/Product.types'
import type { Paginated } from '@shared/types/Pagination.types'
export function useProductsQuery(params: MaybeRefOrGetter<ProductListParams>) {
  const http = useHttpClient()
  const { locale } = useLocale()
  return useQuery({
    queryKey: computed(() => ['products', locale.value, toValue(params)]),
    queryFn: ({ signal }) => http.get('/products', { query: toValue(params), signal }) as Promise<Paginated<Product>>,
  })
}
export function useProductBulkMutation() {
  const http = useHttpClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { ids: string[]; action: 'publish' | 'unpublish' | 'delete' }) =>
      http.post('/products/bulk', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}
