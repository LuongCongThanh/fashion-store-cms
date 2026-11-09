import { z } from 'zod'
export const roleSchema = z.object({
  name: z.string().trim().min(1),
  permissions: z.array(z.string()),
})
export const roleListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  sort: z.enum(['name', '-name']).default('name'),
})
export type RoleInput = z.infer<typeof roleSchema>
