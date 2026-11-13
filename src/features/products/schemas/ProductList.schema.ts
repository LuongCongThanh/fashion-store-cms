import { z } from 'zod'

import { PRODUCT_STATUSES } from '@features/products/types/Product.types'

/** Chỉ các bộ lọc API hỗ trợ: tìm theo tên/SKU, trạng thái, danh mục; luôn mới nhất trước. */
export const productListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  categoryId: z.string().optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
})
export type ProductListParams = z.output<typeof productListSchema>
