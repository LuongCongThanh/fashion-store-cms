import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { UserInput } from '@features/users/schemas/User.schema'
import type { StaffUser } from '@features/users/types/User.types'
import type { Paginated } from '@shared/types/Pagination.types'
export function useUsersQuery(params: MaybeRefOrGetter<Record<string, unknown>>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['users', toValue(params)]),
    queryFn: ({ signal }) => http.get('/users', { signal, query: toValue(params) }) as Promise<Paginated<StaffUser>>,
  })
}
export function useUserQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['users', 'detail', toValue(id)]),
    enabled: computed(() => !!toValue(id)),
    queryFn: ({ signal }) => http.get(`/users/${encodeURIComponent(toValue(id))}`, { signal }) as Promise<StaffUser>,
  })
}
export function useSaveUserMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: UserInput) =>
      toValue(id) ? http.put(`/users/${encodeURIComponent(toValue(id))}`, input) : http.post('/users', input),
    onSuccess: () => client.invalidateQueries({ queryKey: ['users'] }),
  })
}
