import { z } from 'zod'

/** Tạo tài khoản: chỉ tên, email, mật khẩu ban đầu. Vai trò gán ở trang sửa (API tự gán `Staff`). */
export const createInternalAccountSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(1),
})
export type CreateInternalAccountInput = z.infer<typeof createInternalAccountSchema>

export const renameInternalAccountSchema = z.object({ name: z.string().trim().min(1) })
export type RenameInternalAccountInput = z.infer<typeof renameInternalAccountSchema>

/** API phân trang bằng `page` + `limit`, chưa hỗ trợ tìm kiếm hay lọc. */
export const internalAccountListSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})
export type InternalAccountListParams = z.infer<typeof internalAccountListSchema>
