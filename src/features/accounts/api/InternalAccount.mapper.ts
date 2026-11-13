import type { InternalAccount } from '@features/accounts/types/InternalAccount.types'
import type { components } from '@shared/types/Api.generated'

export type StaffResponseDto = components['schemas']['StaffResponseDto']

/** DTO → Model (§T.3). */
export function toInternalAccount(dto: StaffResponseDto): InternalAccount {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    status: dto.status === 'ACTIVE' ? 'ACTIVE' : 'DISABLED',
    roles: dto.roles.map(({ id, name, isSystem }) => ({ id, name, isSystem })),
    createdAt: dto.createdAt,
  }
}
