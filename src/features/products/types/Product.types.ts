/** Trạng thái theo API: DRAFT → ACTIVE ↔ ARCHIVED, DRAFT → ARCHIVED, không quay về DRAFT (BR-CAT-07). */
export const PRODUCT_STATUSES = ['DRAFT', 'ACTIVE', 'ARCHIVED'] as const
export type ProductStatus = (typeof PRODUCT_STATUSES)[number]
export type VariantStatus = 'ACTIVE' | 'ARCHIVED'

/** Một dòng trong danh sách Sản phẩm của back-office. */
export interface ProductListItem {
  id: string
  name: string
  categoryId: string
  status: ProductStatus
  updatedAt: string
}

export interface ProductVariant {
  id: string
  sku: string
  /** VND số nguyên. */
  price: number
  status: VariantStatus
  size: { id: string; code: string; name: string }
  color: { id: string; code: string; name: string; hex: string }
}

/** Ảnh gắn theo màu (BR-CAT-05); `url` null khi API chưa cấu hình kho ảnh. */
export interface ProductImage {
  id: string
  colorId: string
  url: string | null
  altText: string | null
  isPrimary: boolean
  sortOrder: number
}

export interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  weightGrams: number
  status: ProductStatus
  publishedAt: string | null
  variants: ProductVariant[]
  images: ProductImage[]
}

/** Bộ ảnh của một màu đang có Biến thể, ảnh chính đứng đầu. */
export interface ColorGallery {
  color: ProductVariant['color']
  images: ProductImage[]
}
