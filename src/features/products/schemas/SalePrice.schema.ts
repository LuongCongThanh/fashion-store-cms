import { z } from 'zod'

/**
 * Đặt Giá khuyến mãi (US-804): chọn Biến thể, số tiền chung hoặc % giảm (1–99), thời gian.
 * Giờ nhập theo giờ của máy (`datetime-local`); để trống thời gian bắt đầu nghĩa là bắt đầu ngay.
 */
export const salePriceFormSchema = z
  .object({
    variantIds: z.array(z.string()).min(1),
    mode: z.enum(['price', 'percent']),
    amount: z.number().int().min(1),
    startsAt: z.string(),
    endsAt: z.string().min(1),
  })
  .superRefine((value, context) => {
    if (value.mode === 'percent' && value.amount > 99)
      context.addIssue({ code: 'custom', path: ['amount'], message: 'percent' })
    const start = value.startsAt ? Date.parse(value.startsAt) : Date.now()
    if (Number.isNaN(Date.parse(value.endsAt)) || Date.parse(value.endsAt) <= start)
      context.addIssue({ code: 'custom', path: ['endsAt'], message: 'after' })
  })
export type SalePriceFormInput = z.infer<typeof salePriceFormSchema>

/** Mức giảm hiển thị, làm tròn xuống (BR-PRC-04 dùng tỷ lệ chính xác; đây chỉ để xem). */
export function discountPercent(price: number, salePrice: number): number {
  return Math.floor(((price - salePrice) * 100) / price)
}
