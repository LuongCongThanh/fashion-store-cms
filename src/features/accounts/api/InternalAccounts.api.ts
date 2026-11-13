import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type {
  CreateInternalAccountInput,
  InternalAccountListParams,
  RenameInternalAccountInput,
} from '@features/accounts/schemas/InternalAccount.schema'
import type { InternalAccount } from '@features/accounts/types/InternalAccount.types'
import type { components } from '@shared/types/Api.generated'
import type { Paginated } from '@shared/types/Pagination.types'

import { toInternalAccount } from './InternalAccount.mapper'

import type { StaffResponseDto } from './InternalAccount.mapper'

type PaginatedStaffResponseDto = components['schemas']['PaginatedStaffResponseDto']
type CreateStaffDto = components['schemas']['CreateStaffDto']
type UpdateStaffDto = components['schemas']['UpdateStaffDto']

const KEY = 'internal-accounts'
const path = (id: string) => `/admin/staff/${encodeURIComponent(id)}`

export function useInternalAccountsQuery(params: MaybeRefOrGetter<InternalAccountListParams>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => [KEY, toValue(params)]),
    queryFn: async ({ signal }): Promise<Paginated<InternalAccount>> => {
      const { page, pageSize } = toValue(params)
      const dto = (await http.get('/admin/staff', {
        signal,
        query: { page, limit: pageSize },
      })) as PaginatedStaffResponseDto
      const { limit, ...meta } = dto.meta
      return { data: dto.data.map(toInternalAccount), meta: { ...meta, pageSize: limit } }
    },
  })
}

export function useInternalAccountQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => [KEY, 'detail', toValue(id)]),
    enabled: computed(() => !!toValue(id)),
    queryFn: async ({ signal }) =>
      toInternalAccount((await http.get(path(toValue(id)), { signal })) as StaffResponseDto),
  })
}

/** Mọi thay đổi trả lại tài khoản mới nhất: ghi thẳng vào cache chi tiết, làm mới danh sách. */
function useAccountMutation<TInput>(fn: (input: TInput) => Promise<unknown>) {
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: async (input: TInput) => toInternalAccount((await fn(input)) as StaffResponseDto),
    onSuccess: async (account) => {
      client.setQueryData([KEY, 'detail', account.id], account)
      await client.invalidateQueries({ queryKey: [KEY] })
    },
  })
}

export function useCreateInternalAccountMutation() {
  const http = useHttpClient()
  return useAccountMutation((input: CreateInternalAccountInput) => {
    const body: CreateStaffDto = input
    return http.post('/admin/staff', body)
  })
}

export function useRenameInternalAccountMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useAccountMutation((input: RenameInternalAccountInput) => {
    const body: UpdateStaffDto = input
    return http.patch(path(toValue(id)), body)
  })
}

export function useSetInternalAccountStatusMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useAccountMutation((status: InternalAccount['status']) =>
    http.post(`${path(toValue(id))}/${status === 'ACTIVE' ? 'enable' : 'disable'}`, undefined),
  )
}

/** Gán / gỡ một Vai trò. API trả danh sách Vai trò, không trả tài khoản, nên làm mới chi tiết và danh sách. */
export function useToggleInternalAccountRoleMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: ({ roleId, assigned }: { roleId: string; assigned: boolean }) => {
      const url = `/admin/internal-accounts/${encodeURIComponent(toValue(id))}/roles/${encodeURIComponent(roleId)}`
      return assigned ? http.put(url, undefined) : http.delete(url)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  })
}
