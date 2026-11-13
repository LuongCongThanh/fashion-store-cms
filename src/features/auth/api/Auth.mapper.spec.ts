import { describe, expect, it } from 'vitest'

import { toCurrentUser } from './Auth.mapper'

describe('toCurrentUser', () => {
  it('maps the /auth/me DTO to the FE model, taking roles and permissions from the API', () => {
    const dto = {
      id: 'u1',
      email: 'lan@shop.vn',
      fullName: 'Lan',
      role: 'STAFF' as const,
      emailVerified: true,
      roles: ['Staff'],
      permissions: ['CATALOG_PRODUCT_VIEW' as const],
    }

    expect(toCurrentUser(dto)).toEqual({
      id: 'u1',
      name: 'Lan',
      email: 'lan@shop.vn',
      role: 'STAFF',
      roles: ['Staff'],
      permissions: ['CATALOG_PRODUCT_VIEW'],
    })
  })
})
