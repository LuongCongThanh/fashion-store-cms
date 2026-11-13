import { z } from 'zod'

const optionalLimit = z.number().int().min(1).nullable()

/**
 * Form Voucher. Giờ nhập theo giờ máy (`datetime-local`), gửi API dạng ISO UTC.
 * Mã: 3–32 chữ, số, `-` hoặc `_`; API lưu in hoa (BR-VCH-09).
 */
export const voucherSchema = z
  .object({
    code: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_-]{3,32}$/),
    type: z.enum(['PERCENT', 'FIXED']),
    value: z.number().int().min(1),
    maxDiscount: z.number().int().min(1).nullable(),
    minSubtotal: z.number().int().min(0),
    totalLimit: optionalLimit,
    perBuyerLimit: optionalLimit,
    startsAt: z.string().min(1),
    endsAt: z.string().min(1),
    isActive: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.type === 'PERCENT' && value.value > 100)
      context.addIssue({ code: 'custom', path: ['value'], message: 'percent' })
    if (Number.isNaN(Date.parse(value.startsAt)))
      context.addIssue({ code: 'custom', path: ['startsAt'], message: 'required' })
    if (Number.isNaN(Date.parse(value.endsAt)) || Date.parse(value.endsAt) <= Date.parse(value.startsAt))
      context.addIssue({ code: 'custom', path: ['endsAt'], message: 'after' })
  })
export type VoucherInput = z.infer<typeof voucherSchema>

export const voucherListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  status: z.enum(['ACTIVE', 'UPCOMING', 'ENDED', 'EXHAUSTED', 'DISABLED']).optional(),
})
