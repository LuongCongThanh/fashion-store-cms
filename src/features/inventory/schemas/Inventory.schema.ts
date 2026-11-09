import { z } from 'zod'
export const inventoryListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  sort: z.enum(['sku', '-sku', 'current', '-current', '-createdAt']).default('sku'),
  status: z.enum(['in-stock', 'low-stock', 'out-of-stock']).optional(),
})
export const stockAdjustSchema = z.object({
  quantity: z.coerce
    .number()
    .int()
    .refine((value) => value !== 0),
  reason: z.string().trim().min(1),
})
export const movementListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  sort: z.enum(['createdAt', '-createdAt']).default('-createdAt'),
  type: z.enum(['in', 'out', 'adjustment']).optional(),
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
})
