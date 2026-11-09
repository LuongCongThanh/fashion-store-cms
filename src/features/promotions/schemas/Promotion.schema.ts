import { z } from 'zod'

export const promotionSchema = z
  .object({
    name: z.string().trim().min(1),
    type: z.enum(['coupon', 'auto']),
    code: z.string().trim(),
    discountType: z.enum(['percent', 'fixed']),
    value: z.coerce.number().positive(),
    minimumOrder: z.coerce.number().nonnegative(),
    usageLimit: z.coerce.number().int().positive(),
    startAt: z.iso.datetime({ local: true, offset: true }),
    endAt: z.iso.datetime({ local: true, offset: true }),
    status: z.enum(['draft', 'active', 'inactive']),
  })
  .superRefine((value, context) => {
    if (value.type === 'coupon' && !value.code)
      context.addIssue({ code: 'custom', path: ['code'], message: 'required' })
    if (value.discountType === 'percent' && value.value > 100)
      context.addIssue({ code: 'custom', path: ['value'], message: 'percent' })
    if (Date.parse(value.endAt) <= Date.parse(value.startAt))
      context.addIssue({ code: 'custom', path: ['endAt'], message: 'date' })
  })
export type PromotionInput = z.infer<typeof promotionSchema>
export const promotionListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  sort: z.enum(['-createdAt', 'name', '-name']).default('-createdAt'),
  status: z.enum(['draft', 'active', 'inactive']).optional(),
  type: z.enum(['coupon', 'auto']).optional(),
})
