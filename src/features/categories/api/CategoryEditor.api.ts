import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { CategoryInput } from '@features/categories/schemas/Category.schema'
import type { components } from '@shared/lib/api/Api.generated'

import { toCategory } from './Category.mapper'

import type { CategoryResponseDto } from './Category.mapper'

type CreateCategoryDto = components['schemas']['CreateCategoryDto']

export function useCategoryDetailQuery(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['categories', 'detail', toValue(id)]),
    enabled: computed(() => !!toValue(id)),
    queryFn: async ({ signal }) =>
      toCategory(
        (await http.get(`/admin/categories/${encodeURIComponent(toValue(id))}`, { signal })) as CategoryResponseDto,
      ),
  })
}

export function useSaveCategoryMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: CategoryInput) => {
      const body: CreateCategoryDto = {
        name: input.name,
        description: input.description.trim(),
        parentId: input.parentId,
        sortOrder: input.sortOrder,
        isVisible: input.isVisible,
      }
      const categoryId = toValue(id)
      return categoryId
        ? http.patch(`/admin/categories/${encodeURIComponent(categoryId)}`, body)
        : http.post('/admin/categories', body)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['categories'] }),
  })
}

/** API trả 409 khi Danh mục còn danh mục con hoặc Sản phẩm. */
export function useDeleteCategoryMutation() {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (id: string) => http.delete(`/admin/categories/${encodeURIComponent(id)}`),
    onSuccess: () => client.invalidateQueries({ queryKey: ['categories'] }),
  })
}
