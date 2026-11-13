import type { Role } from '@features/roles/types/Role.types'
import type { components } from '@shared/types/Api.generated'

export type RoleResponseDto = components['schemas']['RoleResponseDto']

/** Tên Vai trò hệ thống luôn có mọi Quyền; API là nơi chặn sửa, FE chỉ khoá giao diện. */
const ADMIN_ROLE_NAME = 'Admin'

/** DTO → Model (§T.3). */
export function toRole(dto: RoleResponseDto): Role {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    isSystem: dto.isSystem,
    isReadOnly: dto.isSystem && dto.name === ADMIN_ROLE_NAME,
    permissions: [...dto.permissions],
    accountCount: dto.accountCount,
  }
}
