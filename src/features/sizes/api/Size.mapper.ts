import type { Size } from '@features/sizes/types/Size.types'
import type { components } from '@shared/types/Api.generated'

export type SizeResponseDto = components['schemas']['SizeResponseDto']

/** DTO → Model (§T.3). */
export function toSize(dto: SizeResponseDto): Size {
  return { id: dto.id, code: dto.code, name: dto.name, sortOrder: dto.sortOrder, isHidden: dto.isHidden }
}
