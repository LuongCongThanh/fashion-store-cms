import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { Category } from '@features/categories/types/Category.types'
import type { components } from '@shared/types/Api.generated'

import { toCategory } from './Category.mapper'

type PaginatedCategoryResponseDto = components['schemas']['PaginatedCategoryResponseDto']
type UpdateCategoryDto = components['schemas']['UpdateCategoryDto']

const KEY = ['categories', 'all'] as const
/** API trả danh sách phẳng có phân trang (tối đa 100/trang); cây dựng ở client nên đọc hết các trang. */
const PAGE_LIMIT = 100

export function useCategoriesQuery() {
  const http = useHttpClient()
  return useQuery({
    queryKey: KEY,
    queryFn: async ({ signal }): Promise<Category[]> => {
      const categories: Category[] = []
      for (let page = 1; ; page++) {
        const dto = (await http.get('/admin/categories', {
          signal,
          query: { page, limit: PAGE_LIMIT },
        })) as PaginatedCategoryResponseDto
        categories.push(...dto.data.map(toCategory))
        if (page >= dto.meta.totalPages) return categories
      }
    },
  })
}

/** Kéo-thả trong cây: đổi `parentId` bằng PATCH, cập nhật lạc quan rồi đọc lại. */
export function useMoveCategoryMutation() {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: { id: string; parentId: string | null }) => {
      const body: UpdateCategoryDto = { parentId: input.parentId }
      return http.patch(`/admin/categories/${encodeURIComponent(input.id)}`, body)
    },
    onMutate: async (input) => {
      await client.cancelQueries({ queryKey: KEY })
      const previous = client.getQueryData<Category[]>(KEY)
      client.setQueryData<Category[]>(KEY, (categories) =>
        categories?.map((category) =>
          category.id === input.id ? { ...category, parentId: input.parentId } : category,
        ),
      )
      return { previous }
    },
    onError: (_error, _input, context) => {
      if (context) client.setQueryData(KEY, context.previous)
    },
    onSettled: () => client.invalidateQueries({ queryKey: ['categories'] }),
  })
}
