import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { ColorInput } from '@features/colors/schemas/Color.schema'
import type { Color } from '@features/colors/types/Color.types'
import type { components } from '@shared/types/Api.generated'

import { toColor } from './Color.mapper'

import type { ColorResponseDto } from './Color.mapper'

type CreateColorDto = components['schemas']['CreateColorDto']
type UpdateColorDto = components['schemas']['UpdateColorDto']

/** API trả cả màu đã ẩn; không có endpoint chi tiết nên trang sửa đọc từ danh sách. */
export function useColorsQuery() {
  const http = useHttpClient()
  return useQuery({
    queryKey: ['colors'],
    queryFn: async ({ signal }): Promise<Color[]> =>
      ((await http.get('/admin/colors', { signal })) as ColorResponseDto[]).map(toColor),
  })
}

/** Mã màu không đổi được sau khi tạo; API trả 409 khi mã trùng. */
export function useSaveColorMutation(id: MaybeRefOrGetter<string>) {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: ColorInput) => {
      const colorId = toValue(id)
      if (colorId) {
        const body: UpdateColorDto = { name: input.name, hex: input.hex, isHidden: input.isHidden }
        return http.patch(`/admin/colors/${encodeURIComponent(colorId)}`, body)
      }
      const body: CreateColorDto = {
        code: input.code,
        name: input.name,
        hex: input.hex,
        isHidden: input.isHidden,
      }
      return http.post('/admin/colors', body)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['colors'] }),
  })
}
