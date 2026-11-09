import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { PromotionInput } from '@features/promotions/schemas/Promotion.schema'
import type { Promotion } from '@features/promotions/types/Promotion.types'
import type { Paginated } from '@shared/types/Pagination.types'
export function usePromotionsQuery(params: MaybeRefOrGetter<Record<string, unknown>>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['promotions', toValue(params)]),
    queryFn: ({ signal }) =>
      http.get('/promotions', { signal, query: toValue(params) }) as Promise<Paginated<Promotion>>,
  })
}
export function usePromotionQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['promotions', 'detail', toValue(id)]),
    enabled: computed(() => !!toValue(id)),
    queryFn: ({ signal }) =>
      http.get(`/promotions/${encodeURIComponent(toValue(id))}`, { signal }) as Promise<Promotion>,
  })
}
export function useSavePromotionMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: PromotionInput) =>
      toValue(id) ? http.put(`/promotions/${encodeURIComponent(toValue(id))}`, input) : http.post('/promotions', input),
    onSuccess: () => client.invalidateQueries({ queryKey: ['promotions'] }),
  })
}
