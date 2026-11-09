import { z } from 'zod'
export const productListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['name', '-name', 'price', '-price', '-createdAt']).default('-createdAt'),
  search: z.string().default(''),
  categoryId: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
})
export type ProductListParams = z.output<typeof productListSchema>
