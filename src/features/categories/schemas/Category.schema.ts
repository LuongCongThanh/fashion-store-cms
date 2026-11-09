import { z } from 'zod'
export const categorySchema = z.object({
  name: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  parentId: z.string().nullable(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  translations: z.object({
    vi: z.object({ name: z.string(), description: z.string() }),
    en: z.object({ name: z.string(), description: z.string() }),
  }),
})
export type CategoryInput = z.infer<typeof categorySchema>
