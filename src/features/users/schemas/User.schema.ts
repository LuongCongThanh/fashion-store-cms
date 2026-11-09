import { z } from 'zod'
export const userSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  roleIds: z.array(z.string()).min(1),
  storeIds: z.array(z.string()).min(1),
  status: z.enum(['active', 'inactive']),
})
export type UserInput = z.infer<typeof userSchema>
export const userListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  sort: z.enum(['name', '-name', '-createdAt']).default('name'),
  status: z.enum(['active', 'inactive']).optional(),
  roleId: z.string().optional(),
})
