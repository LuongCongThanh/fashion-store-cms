import { z } from 'zod'

import type { Permission } from '@shared/lib/api/Permission'

export const roleSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  permissions: z.array(z.custom<Permission>((value) => typeof value === 'string')),
})
/** API phân trang bằng `page` + `limit`, chưa hỗ trợ tìm kiếm hay sắp xếp Vai trò. */
export const roleListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})
export type RoleInput = z.infer<typeof roleSchema>
export type RoleListParams = z.infer<typeof roleListSchema>
