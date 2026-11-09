import { z } from 'zod'
export const storeSettingsSchema = z.object({
  name: z.string().trim().min(1),
  logo: z.object({ id: z.string(), url: z.string(), name: z.string() }).nullable(),
  description: z.string(),
  contactEmail: z.email(),
  phone: z.string(),
  address: z.string(),
})
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>

export const localizationSchema = z
  .object({
    languages: z.array(z.string().min(2)).min(1),
    defaultLanguage: z.string().min(2),
    timezone: z.string().refine((value) => {
      try {
        new Intl.DateTimeFormat('en', { timeZone: value })
        return true
      } catch {
        return false
      }
    }),
    currency: z.string().regex(/^[A-Z]{3}$/),
    dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
    numberFormat: z.string().refine((value) => {
      try {
        new Intl.NumberFormat(value)
        return true
      } catch {
        return false
      }
    }),
  })
  .superRefine((value, context) => {
    if (!value.languages.includes(value.defaultLanguage))
      context.addIssue({ code: 'custom', path: ['defaultLanguage'], message: 'required' })
    if (new Set(value.languages).size !== value.languages.length)
      context.addIssue({ code: 'custom', path: ['languages'], message: 'duplicate' })
  })
export type LocalizationInput = z.infer<typeof localizationSchema>
