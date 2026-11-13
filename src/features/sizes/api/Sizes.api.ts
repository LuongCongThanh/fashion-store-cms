import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { SizeInput } from '@features/sizes/schemas/Size.schema'
import type { Size } from '@features/sizes/types/Size.types'
import type { components } from '@shared/types/Api.generated'

import { toSize } from './Size.mapper'

import type { SizeResponseDto } from './Size.mapper'

type CreateSizeDto = components['schemas']['CreateSizeDto']
type UpdateSizeDto = components['schemas']['UpdateSizeDto']

/** API trả cả size đã ẩn, đã sắp theo thứ tự hiển thị; không có endpoint chi tiết nên trang sửa đọc từ danh sách. */
export function useSizesQuery() {
  const http = useHttpClient()
  return useQuery({
    queryKey: ['sizes'],
    queryFn: async ({ signal }): Promise<Size[]> =>
      ((await http.get('/admin/sizes', { signal })) as SizeResponseDto[]).map(toSize),
  })
}

/** Mã size không đổi được sau khi tạo; API trả 409 khi mã trùng. */
export function useSaveSizeMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: SizeInput) => {
      const sizeId = toValue(id)
      if (sizeId) {
        const body: UpdateSizeDto = { name: input.name, sortOrder: input.sortOrder, isHidden: input.isHidden }
        return http.patch(`/admin/sizes/${encodeURIComponent(sizeId)}`, body)
      }
      const body: CreateSizeDto = {
        code: input.code,
        name: input.name,
        sortOrder: input.sortOrder,
        isHidden: input.isHidden,
      }
      return http.post('/admin/sizes', body)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['sizes'] }),
  })
}
