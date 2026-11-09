import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { RoleInput } from '@features/roles/schemas/Role.schema'
import type { Permission, Role } from '@features/roles/types/Role.types'
import type { Paginated } from '@shared/types/Pagination.types'
export function useRolesQuery(params: MaybeRefOrGetter<Record<string, unknown>> = {}) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['roles', toValue(params)]),
    queryFn: ({ signal }) => http.get('/roles', { signal, query: toValue(params) }) as Promise<Paginated<Role>>,
  })
}
export function usePermissionsQuery() {
  const http = useHttpClient()
  return useQuery({
    queryKey: ['permissions'],
    queryFn: ({ signal }) => http.get('/permissions', { signal }) as Promise<Permission[]>,
  })
}
export function useRoleQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['roles', 'detail', toValue(id)]),
    enabled: computed(() => !!toValue(id)),
    queryFn: ({ signal }) => http.get(`/roles/${encodeURIComponent(toValue(id))}`, { signal }) as Promise<Role>,
  })
}
export function useSaveRoleMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: RoleInput) =>
      toValue(id) ? http.put(`/roles/${encodeURIComponent(toValue(id))}`, input) : http.post('/roles', input),
    onSuccess: () => client.invalidateQueries({ queryKey: ['roles'] }),
  })
}
