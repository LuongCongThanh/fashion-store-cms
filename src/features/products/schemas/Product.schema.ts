import { z } from 'zod'
export const variantSchema = z.object({
  sku: z.string(),
  size: z.string(),
  color: z.string(),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
})
export const productDraftSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string(),
  brand: z.string(),
  price: z.coerce.number().nonnegative(),
  comparePrice: z.coerce.number().nonnegative(),
  cost: z.coerce.number().nonnegative(),
  categoryIds: z.array(z.string()),
  images: z.array(z.object({ id: z.string(), url: z.string(), name: z.string() })),
  mainImageId: z.string(),
  variants: z.array(variantSchema).min(1),
  slug: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  status: z.enum(['draft', 'published', 'archived']),
})
export type ProductInput = z.infer<typeof productDraftSchema>

export const productPublishSchema = productDraftSchema.superRefine((value, context) => {
  if (!value.slug.trim()) context.addIssue({ code: 'custom', path: ['slug'], message: 'required' })
  if (value.price <= 0) context.addIssue({ code: 'custom', path: ['price'], message: 'required' })
  const skus = new Set<string>()
  value.variants.forEach((variant, index) => {
    const sku = variant.sku.trim().toUpperCase()
    if (!sku || skus.has(sku))
      context.addIssue({ code: 'custom', path: ['variants', index, 'sku'], message: 'required' })
    skus.add(sku)
  })
})
