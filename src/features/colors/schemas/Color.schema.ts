import { z } from 'zod'

/** Mã: chữ in hoa, số, gạch nối ; hex dạng #RRGGBB (BR-CAT-11, khớp CHECK ở DB). */
export const colorSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .max(30)
    .regex(/^[A-Z0-9-]+$/),
  name: z.string().trim().min(1).max(50),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  isHidden: z.boolean(),
})
export type ColorInput = z.infer<typeof colorSchema>
