import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { ProductInput } from '@features/products/schemas/Product.schema'
export function useProductQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['products', 'detail', toValue(id)]),
    enabled: computed(() => !!toValue(id)),
    queryFn: ({ signal }) =>
      http.get(`/products/${encodeURIComponent(toValue(id))}`, { signal }) as Promise<ProductInput & { id: string }>,
  })
}
export function useSaveProductMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: ProductInput) =>
      toValue(id) ? http.put(`/products/${encodeURIComponent(toValue(id))}`, input) : http.post('/products', input),
    onSuccess: () => client.invalidateQueries({ queryKey: ['products'] }),
  })
}
