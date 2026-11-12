import type { AuthRole, CurrentUser } from '@features/auth/types/Auth.types'
import type { components } from '@shared/types/Api.generated'

export type AuthUserResponseDto = components['schemas']['AuthUserResponseDto']

/** Quyền đặc biệt: mở mọi quyền. Chỉ cấp qua ma trận role, không đến từ BE. */
export const ALL_PERMISSIONS = '*'

/**
 * Ma trận quyền tạm thời của FE cho tới khi BE trả permissions.
 * Thêm role/quyền chỉ sửa bảng này — `can()` không cần biết role nào.
 */
const PERMISSIONS_BY_ROLE: Record<AuthRole, readonly string[]> = {
  ADMIN: [ALL_PERMISSIONS],
  STAFF: ['category:read', 'product:read'],
  CUSTOMER: [],
}

export function permissionsFor(role: AuthRole): string[] {
  return [...PERMISSIONS_BY_ROLE[role]]
}

/** DTO → Model (§T.3). */
export function toCurrentUser(dto: AuthUserResponseDto): CurrentUser {
  return {
    id: dto.id,
    name: dto.fullName,
    email: dto.email,
    role: dto.role,
    permissions: permissionsFor(dto.role),
  }
}
