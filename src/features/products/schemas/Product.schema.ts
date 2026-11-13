import { z } from 'zod'

/** Thông tin Sản phẩm (BR-CAT-06, BR-CAT-10): tên, mô tả tiếng Việt, một danh mục, cân nặng gram > 0. */
export const productInfoSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string(),
  categoryId: z.string().min(1),
  weightGrams: z.number().int().min(1),
})
export type ProductInfoInput = z.infer<typeof productInfoSchema>

/** Một Biến thể = size × màu (BR-CAT-02); SKU in hoa, số, gạch nối, không đổi sau khi tạo (BR-CAT-03). */
export const variantSchema = z.object({
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  sku: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[A-Z0-9-]+$/),
  price: z.number().int().min(1),
})
export type VariantInput = z.infer<typeof variantSchema>

/** Gợi ý SKU từ tiền tố, mã size và mã màu: `TSHIRT-BASIC` + `M` + `WHT` → `TSHIRT-BASIC-WHT-M`. */
export function suggestSku(prefix: string, colorCode: string, sizeCode: string): string {
  return [prefix, colorCode, sizeCode]
    .map((part) =>
      part
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-'),
    )
    .filter(Boolean)
    .join('-')
}
