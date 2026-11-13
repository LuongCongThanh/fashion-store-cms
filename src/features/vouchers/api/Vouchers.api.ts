import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { Voucher, VoucherStatus } from '@features/vouchers/types/Voucher.types'
import type { components } from '@shared/lib/api/Api.generated'
import type { Paginated } from '@shared/types/Pagination.types'

import { toVoucher } from './Voucher.mapper'

import type { PaginatedVoucherResponseDto, VoucherResponseDto } from './Voucher.mapper'

export type CreateVoucherDto = components['schemas']['CreateVoucherDto']
export type UpdateVoucherDto = components['schemas']['UpdateVoucherDto']

export interface VoucherListParams {
  page: number
  pageSize: number
  search: string
  status?: VoucherStatus
}

const itemPath = (id: string) => `/admin/vouchers/${encodeURIComponent(id)}`

/** Mới nhất trước; tìm theo mã, lọc theo trạng thái hiện tại. */
export function useVouchersQuery(params: MaybeRefOrGetter<VoucherListParams>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['vouchers', 'list', toValue(params)]),
    queryFn: async ({ signal }): Promise<Paginated<Voucher>> => {
      const { page, pageSize, search, status } = toValue(params)
      const dto = (await http.get('/admin/vouchers', {
        signal,
        query: { page, limit: pageSize, q: search || undefined, status },
      })) as PaginatedVoucherResponseDto
      const { limit, ...meta } = dto.meta
      return { data: dto.data.map(toVoucher), meta: { ...meta, pageSize: limit } }
    },
  })
}

export function useVoucherQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['vouchers', 'detail', toValue(id)]),
    enabled: computed(() => !!toValue(id)),
    queryFn: async ({ signal }) => toVoucher((await http.get(itemPath(toValue(id)), { signal })) as VoucherResponseDto),
  })
}

/** Tạo (không có id) hoặc sửa. Voucher đã dùng chỉ đổi được thời gian kết thúc, giới hạn và trạng thái kích hoạt. */
export function useSaveVoucherMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (body: CreateVoucherDto | UpdateVoucherDto) => {
      const voucherId = toValue(id)
      return voucherId ? http.patch(itemPath(voucherId), body) : http.post('/admin/vouchers', body)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['vouchers'] }),
  })
}

/** Chỉ xoá được Voucher chưa dùng; đã dùng thì chỉ vô hiệu hoá (API trả 409). */
export function useDeleteVoucherMutation() {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (id: string) => http.delete(itemPath(id)),
    // Bỏ cache chi tiết thay vì refetch (Voucher đã xoá → 404), rồi làm mới danh sách.
    onSuccess: (_data, id) => {
      client.removeQueries({ queryKey: ['vouchers', 'detail', id] })
      return client.invalidateQueries({ queryKey: ['vouchers', 'list'] })
    },
  })
}
