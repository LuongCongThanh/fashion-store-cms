import { z } from 'zod'

import { PRODUCT_STATUSES } from '@features/products/types/Product.types'

export const productListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['name', '-name', 'price', '-price', '-createdAt']).default('-createdAt'),
  search: z.string().default(''),
  categoryId: z.string().optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
})
export type ProductListParams = z.output<typeof productListSchema>
