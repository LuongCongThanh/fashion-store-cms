import { useQuery } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { Customer } from '@features/customers/types/Customer.types'
import type { Paginated } from '@shared/types/Pagination.types'
export function useCustomerQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['customers', toValue(id)]),
    queryFn: ({ signal }) => http.get(`/customers/${encodeURIComponent(toValue(id))}`, { signal }) as Promise<Customer>,
  })
}
export function useCustomersQuery(params: MaybeRefOrGetter<Record<string, unknown>>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['customers', toValue(params)]),
    queryFn: ({ signal }) => http.get('/customers', { signal, query: toValue(params) }) as Promise<Paginated<Customer>>,
  })
}
