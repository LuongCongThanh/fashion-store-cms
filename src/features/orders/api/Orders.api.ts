import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'
import { useLocale } from '@shared/lib/i18n/I18n'

import type { Order } from '@features/orders/types/Order.types'
import type { Paginated } from '@shared/types/Pagination.types'
export function useOrderQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['orders', 'detail', toValue(id)]),
    queryFn: ({ signal }) => http.get(`/orders/${encodeURIComponent(toValue(id))}`, { signal }) as Promise<Order>,
  })
}
export function useOrdersQuery(
  params: MaybeRefOrGetter<Record<string, unknown>>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  const http = useHttpClient()
  const { locale } = useLocale()
  return useQuery({
    queryKey: computed(() => ['orders', locale.value, toValue(params)]),
    enabled: computed(() => toValue(enabled)),
    queryFn: ({ signal }) => http.get('/orders', { query: toValue(params), signal }) as Promise<Paginated<Order>>,
  })
}
