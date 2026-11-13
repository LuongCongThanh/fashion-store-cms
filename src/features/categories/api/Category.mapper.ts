import type { Category } from '@features/categories/types/Category.types'
import type { components } from '@shared/lib/api/Api.generated'

export type CategoryResponseDto = components['schemas']['CategoryResponseDto']

/** DTO → Model (§T.3). */
export function toCategory(dto: CategoryResponseDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    parentId: dto.parentId,
    description: dto.description,
    sortOrder: dto.sortOrder,
    isVisible: dto.isVisible,
  }
}
