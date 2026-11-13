import type { CurrentUser } from '@features/auth/types/Auth.types'
import type { components } from '@shared/lib/api/Api.generated'

export type MeResponseDto = components['schemas']['MeResponseDto']

/** DTO → Model (§T.3). Quyền lấy nguyên từ API (`GET /auth/me`), FE không tự suy theo loại tài khoản. */
export function toCurrentUser(dto: MeResponseDto): CurrentUser {
  return {
    id: dto.id,
    name: dto.fullName,
    email: dto.email,
    role: dto.role,
    roles: [...dto.roles],
    permissions: [...dto.permissions],
  }
}
