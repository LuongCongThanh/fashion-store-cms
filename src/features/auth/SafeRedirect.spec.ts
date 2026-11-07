import { describe, expect, it } from 'vitest'

import { safeRedirect } from './SafeRedirect'

describe('safeRedirect', () => {
  it.each([
    ['/admin', '/admin'],
    ['/admin/design-system', '/admin/design-system'],
    ['/admin/orders?page=2#top', '/admin/orders?page=2#top'],
    [undefined, '/admin'],
    [null, '/admin'],
    ['', '/admin'],
    [['/admin/x'], '/admin'],
    ['//evil.com/admin', '/admin'],
    ['https://evil.com', '/admin'],
    ['/\\evil.com', '/admin'],
    ['/login', '/admin'],
    ['/administrator', '/admin'],
    ['javascript:alert(1)', '/admin'],
  ])('%j → %s', (raw, expected) => {
    expect(safeRedirect(raw)).toBe(expected)
  })
})
