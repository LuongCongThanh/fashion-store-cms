import { z } from 'zod'

import { ORDER_STATUSES } from '@features/orders/types/Order.types'
export const orderListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  sort: z.enum(['-createdAt', 'createdAt', 'total', '-total']).default('-createdAt'),
  status: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(['paid', 'unpaid', 'refunded']).optional(),
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
  customerId: z.string().optional(),
  minAmount: z.coerce.number().nonnegative().optional(),
  maxAmount: z.coerce.number().nonnegative().optional(),
})
export type OrderListParams = z.infer<typeof orderListSchema>
