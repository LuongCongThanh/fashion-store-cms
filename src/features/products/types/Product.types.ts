export const PRODUCT_STATUSES = ['draft', 'published', 'archived'] as const
export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

export interface Product {
  id: string
  name: string
  status: ProductStatus
  price: number
  imageUrl?: string
  categoryId?: string
  updatedAt?: string
}
