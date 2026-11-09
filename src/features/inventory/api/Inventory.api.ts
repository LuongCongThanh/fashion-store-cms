import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { InventoryItem, StockMovement } from '@features/inventory/types/Inventory.types'
import type { Paginated } from '@shared/types/Pagination.types'
export function useInventoryQuery(params: MaybeRefOrGetter<Record<string, unknown>>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['inventory', 'list', toValue(params)]),
    queryFn: ({ signal }) =>
      http.get('/inventory', { query: toValue(params), signal }) as Promise<Paginated<InventoryItem>>,
  })
}
export function useStockMovementsQuery(params: MaybeRefOrGetter<Record<string, unknown>>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['inventory', 'movements', toValue(params)]),
    queryFn: ({ signal }) =>
      http.get('/inventory/movements', { query: toValue(params), signal }) as Promise<Paginated<StockMovement>>,
  })
}
export function useStockAdjustMutation() {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: { id: string; quantity: number; reason: string }) =>
      http.post(`/inventory/${encodeURIComponent(input.id)}/adjustments`, {
        quantity: input.quantity,
        reason: input.reason,
      }),
    onSuccess: () => client.invalidateQueries({ queryKey: ['inventory'] }),
  })
}
