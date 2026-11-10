import { faker } from '@faker-js/faker'

import type { CurrentUser } from '@features/auth/types/Auth.types'

/** User giả cho test (§S.2). Ghi đè field cần cố định qua `overrides`. */
export function buildUser(overrides: Partial<CurrentUser> = {}): CurrentUser {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'STAFF',
    permissions: [],
    ...overrides,
  }
}
