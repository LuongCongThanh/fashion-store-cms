import { describe, expect, it } from 'vitest'

import { ALL_PERMISSIONS, permissionsFor, toCurrentUser } from './Auth.mapper'

describe('toCurrentUser', () => {
  it('maps the BE user DTO to the FE model with role-derived permissions', () => {
    const dto = { id: 'u1', email: 'lan@shop.vn', fullName: 'Lan', role: 'STAFF' as const, emailVerified: true }

    expect(toCurrentUser(dto)).toEqual({
      id: 'u1',
      name: 'Lan',
      email: 'lan@shop.vn',
      role: 'STAFF',
      permissions: ['category:read', 'product:read'],
    })
  })
})

describe('permissionsFor', () => {
  it('grants admins every permission through the wildcard', () => {
    expect(permissionsFor('ADMIN')).toEqual([ALL_PERMISSIONS])
  })

  it('gives customers nothing', () => {
    expect(permissionsFor('CUSTOMER')).toEqual([])
  })

  it('returns a fresh copy so callers cannot mutate the matrix', () => {
    permissionsFor('STAFF').push('x')

    expect(permissionsFor('STAFF')).not.toContain('x')
  })
})
