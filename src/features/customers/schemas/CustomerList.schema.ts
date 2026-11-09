import { z } from 'zod'
export const customerListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  sort: z.enum(['name', '-name', 'totalSpent', '-totalSpent', '-createdAt']).default('-createdAt'),
  status: z.enum(['active', 'inactive']).optional(),
})
