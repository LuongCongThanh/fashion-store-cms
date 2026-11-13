import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { RoleInput, RoleListParams } from '@features/roles/schemas/Role.schema'
import type { PermissionGroup, Role } from '@features/roles/types/Role.types'
import type { components } from '@shared/types/Api.generated'
import type { Paginated } from '@shared/types/Pagination.types'

import { toRole } from './Role.mapper'

import type { RoleResponseDto } from './Role.mapper'

type PaginatedRoleResponseDto = components['schemas']['PaginatedRoleResponseDto']
type PermissionGroupResponseDto = components['schemas']['PermissionGroupResponseDto']
type CreateRoleDto = components['schemas']['CreateRoleDto']
type UpdateRoleDto = components['schemas']['UpdateRoleDto']

export function useRolesQuery(params: MaybeRefOrGetter<RoleListParams>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['roles', toValue(params)]),
    queryFn: async ({ signal }): Promise<Paginated<Role>> => {
      const { page, pageSize } = toValue(params)
      const dto = (await http.get('/admin/roles', {
        signal,
        query: { page, limit: pageSize },
      })) as PaginatedRoleResponseDto
      const { limit, ...meta } = dto.meta
      return { data: dto.data.map(toRole), meta: { ...meta, pageSize: limit } }
    },
  })
}

export function usePermissionGroupsQuery() {
  const http = useHttpClient()
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async ({ signal }): Promise<PermissionGroup[]> =>
      (await http.get('/admin/permissions', { signal })) as PermissionGroupResponseDto[],
  })
}

export function useRoleQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['roles', 'detail', toValue(id)]),
    enabled: computed(() => !!toValue(id)),
    queryFn: async ({ signal }) =>
      toRole((await http.get(`/admin/roles/${encodeURIComponent(toValue(id))}`, { signal })) as RoleResponseDto),
  })
}

/** Vai trò hệ thống không đổi tên được: khi sửa chỉ gửi Quyền và mô tả. */
export function useSaveRoleMutation(id: MaybeRefOrGetter<string>, isSystem: MaybeRefOrGetter<boolean>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: RoleInput) => {
      const roleId = toValue(id)
      if (!roleId) {
        const body: CreateRoleDto = {
          name: input.name,
          description: input.description || undefined,
          permissions: input.permissions,
        }
        return http.post('/admin/roles', body)
      }
      const body: UpdateRoleDto = toValue(isSystem)
        ? { description: input.description, permissions: input.permissions }
        : { name: input.name, description: input.description, permissions: input.permissions }
      return http.patch(`/admin/roles/${encodeURIComponent(roleId)}`, body)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['roles'] }),
  })
}

export function useDeleteRoleMutation() {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (id: string) => http.delete(`/admin/roles/${encodeURIComponent(id)}`),
    onSuccess: () => client.invalidateQueries({ queryKey: ['roles'] }),
  })
}
