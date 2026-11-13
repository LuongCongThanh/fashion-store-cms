import type { Color } from '@features/colors/types/Color.types'
import type { components } from '@shared/types/Api.generated'

export type ColorResponseDto = components['schemas']['ColorResponseDto']

/** DTO → Model (§T.3). */
export function toColor(dto: ColorResponseDto): Color {
  return { id: dto.id, code: dto.code, name: dto.name, hex: dto.hex, isHidden: dto.isHidden }
}
