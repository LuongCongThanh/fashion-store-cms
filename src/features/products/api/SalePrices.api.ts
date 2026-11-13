import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { SalePrice } from '@features/products/types/SalePrice.types'
import type { components } from '@shared/lib/api/Api.generated'

type SalePriceResponseDto = components['schemas']['SalePriceResponseDto']
type CreateSalePriceDto = components['schemas']['CreateSalePriceDto']
type UpdateSalePriceDto = components['schemas']['UpdateSalePriceDto']

export const salePricesKey = (productId: string) => ['products', 'sale-prices', productId] as const
const itemPath = (id: string) => `/admin/sale-prices/${encodeURIComponent(id)}`

function toSalePrice(dto: SalePriceResponseDto): SalePrice {
  return {
    id: dto.id,
    variantId: dto.variantId,
    price: dto.price,
    startsAt: dto.startsAt,
    endsAt: dto.endsAt,
    status: dto.status,
  }
}

export function useSalePricesQuery(productId: MaybeRefOrGetter<string>, enabled: MaybeRefOrGetter<boolean>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => salePricesKey(toValue(productId))),
    enabled: computed(() => !!toValue(productId) && toValue(enabled)),
    queryFn: async ({ signal }) => {
      const rows = (await http.get(`/admin/products/${encodeURIComponent(toValue(productId))}/sale-prices`, {
        signal,
      })) as SalePriceResponseDto[]
      return rows.map(toSalePrice)
    },
  })
}

function useInvalidate(productId: MaybeRefOrGetter<string>) {
  const client = useQueryClient()
  return () => client.invalidateQueries({ queryKey: salePricesKey(toValue(productId)) })
}

/** Một lệnh cho nhiều Biến thể; cả lô thành công hoặc thất bại cùng nhau. */
export function useCreateSalePriceMutation(productId: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const invalidate = useInvalidate(productId)
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (body: CreateSalePriceDto) =>
      http.post(`/admin/products/${encodeURIComponent(toValue(productId))}/sale-prices`, body),
    onSuccess: invalidate,
  })
}

export function useUpdateSalePriceMutation(productId: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const invalidate = useInvalidate(productId)
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: ({ id, ...body }: UpdateSalePriceDto & { id: string }) => http.patch(itemPath(id), body),
    onSuccess: invalidate,
  })
}

export function useEndSalePriceMutation(productId: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const invalidate = useInvalidate(productId)
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (id: string) => http.post(`${itemPath(id)}/end`, undefined),
    onSuccess: invalidate,
  })
}

export function useDeleteSalePriceMutation(productId: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const invalidate = useInvalidate(productId)
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (id: string) => http.delete(itemPath(id)),
    onSuccess: invalidate,
  })
}
