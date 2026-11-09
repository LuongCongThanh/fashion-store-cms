import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { CategoryInput } from '@features/categories/schemas/Category.schema'
import type { Category } from '@features/categories/types/Category.types'
export function useCategoryDetailQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['categories', toValue(id)]),
    enabled: computed(() => !!toValue(id)),
    queryFn: ({ signal }) =>
      http.get(`/categories/${encodeURIComponent(toValue(id))}`, { signal }) as Promise<Category>,
  })
}
export function useSaveCategoryMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: CategoryInput) =>
      toValue(id) ? http.put(`/categories/${encodeURIComponent(toValue(id))}`, input) : http.post('/categories', input),
    onSuccess: () => client.invalidateQueries({ queryKey: ['categories'] }),
  })
}
