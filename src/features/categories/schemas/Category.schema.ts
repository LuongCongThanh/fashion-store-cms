import { z } from 'zod'

/** Tên và mô tả chỉ tiếng Việt (BR-CAT-10); slug do API sinh từ tên. */
export const categorySchema = z.object({
  name: z.string().trim().min(1).max(150),
  description: z.string(),
  parentId: z.string().nullable(),
  sortOrder: z.number().int().min(0),
  isVisible: z.boolean(),
})
export type CategoryInput = z.infer<typeof categorySchema>
