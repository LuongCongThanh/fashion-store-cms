import { describe, expect, it } from 'vitest'

import { safeRedirect } from './SafeRedirect'

describe('safeRedirect', () => {
  it.each([
    ['/', '/'],
    ['/design-system', '/design-system'],
    ['/orders?page=2#top', '/orders?page=2#top'],
    ['/login-history', '/login-history'],
    [undefined, '/'],
    [null, '/'],
    ['', '/'],
    [['/x'], '/'],
    ['//evil.com/orders', '/'],
    ['https://evil.com', '/'],
    ['/\\evil.com', '/'],
    ['/login', '/'],
    ['/login?redirect=/orders', '/'],
    ['/forgot-password', '/'],
    ['javascript:alert(1)', '/'],
  ])('%j → %s', (raw, expected) => {
    expect(safeRedirect(raw)).toBe(expected)
  })
})
