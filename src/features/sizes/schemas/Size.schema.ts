import { z } from 'zod'

/** Mã: chữ in hoa, số, gạch nối (BR-CAT-11, khớp CHECK ở DB). */
export const sizeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .max(30)
    .regex(/^[A-Z0-9-]+$/),
  name: z.string().trim().min(1).max(50),
  sortOrder: z.number().int().min(0),
  isHidden: z.boolean(),
})
export type SizeInput = z.infer<typeof sizeSchema>
