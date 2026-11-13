import type { SalePriceFormInput } from '@features/products/schemas/SalePrice.schema'
import type { ProductVariant } from '@features/products/types/Product.types'
import type { SalePrice } from '@features/products/types/SalePrice.types'

/** Một dòng lịch sử: Giá khuyến mãi kèm Biến thể và mức giảm. */
export interface SalePriceRow {
  sale: SalePrice
  variant: ProductVariant | undefined
  discount: number | null
}

/** Đang sửa: sắp diễn ra đổi được giá và thời gian; đang hiệu lực chỉ đổi kết thúc (BR-PRC-06). */
export interface SalePriceEdit {
  id: string
  price: number
  startsAt: string
  endsAt: string
}

export type SalePriceFormErrors = Partial<Record<keyof SalePriceFormInput | 'form', string>>
