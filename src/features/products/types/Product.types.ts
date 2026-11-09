export const PRODUCT_STATUSES = ['draft', 'published', 'archived'] as const
export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

/** FE model for one row in the Product list; API DTOs stay inside api/. */
export interface ProductListItem {
  id: string
  name: string
  status: ProductStatus
  price: number
  imageUrl?: string
  categoryId?: string
  updatedAt?: string
}
