import { expect, it } from 'vitest'

import { promotionSchema } from './Promotion.schema'

it('rejects percentage discounts over 100, missing coupon codes and reversed dates', () => {
  const valid = {
    name: 'Tết',
    type: 'coupon',
    code: 'TET',
    discountType: 'percent',
    value: 20,
    minimumOrder: 0,
    usageLimit: 100,
    startAt: '2026-01-01T00:00:00Z',
    endAt: '2026-02-01T00:00:00Z',
    status: 'active',
  }
  expect(promotionSchema.safeParse(valid).success).toBe(true)
  expect(promotionSchema.safeParse({ ...valid, value: 101 }).success).toBe(false)
  expect(promotionSchema.safeParse({ ...valid, code: '' }).success).toBe(false)
  expect(promotionSchema.safeParse({ ...valid, endAt: '2025-01-01T00:00:00Z' }).success).toBe(false)
  expect(promotionSchema.safeParse({ ...valid, type: 'auto', code: '' }).success).toBe(true)
})
