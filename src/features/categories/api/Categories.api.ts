import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'
import { useLocale } from '@shared/lib/i18n/I18n'

import type { Category } from '../types/Category.types'
export function useCategoriesQuery() {
  const http = useHttpClient()
  const { locale } = useLocale()
  return useQuery({
    queryKey: computed(() => ['categories', locale.value]),
    queryFn: ({ signal }) => http.get('/categories', { signal }) as Promise<Category[]>,
  })
}
export function useMoveCategoryMutation() {
  const http = useHttpClient()
  const client = useQueryClient()
  const { locale } = useLocale()
  const key = () => ['categories', locale.value]
  return useMutation({
    mutationFn: (input: { id: string; parentId: string | null }) =>
      http.patch(`/categories/${encodeURIComponent(input.id)}/move`, { parentId: input.parentId }),
    onMutate: async (input) => {
      await client.cancelQueries({ queryKey: key() })
      const previous = client.getQueryData<Category[]>(key())
      client.setQueryData<Category[]>(key(), (categories) =>
        categories?.map((category) =>
          category.id === input.id ? { ...category, parentId: input.parentId } : category,
        ),
      )
      return { previous, key: key() }
    },
    onError: (_error, _input, context) => {
      if (context) client.setQueryData(context.key, context.previous)
    },
    onSettled: () => client.invalidateQueries({ queryKey: key() }),
  })
}
