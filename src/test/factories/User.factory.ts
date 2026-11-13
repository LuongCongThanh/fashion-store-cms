import { faker } from '@faker-js/faker'

import type { CurrentUser } from '@features/auth/types/Auth.types'

/** JSON mà BE trả cho `/auth/me` (test không được import DTO, §T.3 — chỉ mô tả dữ liệu trên dây). */
interface UserJson {
  id: string
  email: string
  fullName: string
  role: CurrentUser['role']
  emailVerified: boolean
  roles: string[]
  permissions: string[]
}

/** Quyền trong test là chuỗi trên dây, kể cả `PendingPermission` mà API không bao giờ cấp. */
type UserOverrides = Omit<Partial<CurrentUser>, 'permissions'> & { permissions?: readonly string[] }

/** User (Model FE) giả cho test (§S.2). Ghi đè field cần cố định qua `overrides`. */
export function buildUser({ permissions = [], ...overrides }: UserOverrides = {}): CurrentUser {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'STAFF',
    roles: ['Staff'],
    permissions: [...permissions] as CurrentUser['permissions'],
    ...overrides,
  }
}

/** Response `/auth/me` giả (DTO BE) — dùng khi test luồng nạp user qua HTTP. */
export function buildUserDto(overrides: Partial<UserJson> = {}): UserJson {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    fullName: faker.person.fullName(),
    role: 'STAFF',
    emailVerified: true,
    roles: ['Staff'],
    permissions: [],
    ...overrides,
  }
}
