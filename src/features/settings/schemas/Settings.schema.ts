import { z } from 'zod'
export const storeSettingsSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string(),
  contactEmail: z.email(),
  phone: z.string(),
  address: z.string(),
})
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>
