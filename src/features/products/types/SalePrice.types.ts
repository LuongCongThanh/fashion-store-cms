/** Trạng thái của Giá khuyến mãi lúc API trả về (BR-PRC-06). */
export type SalePriceStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED'

/** Giá khuyến mãi của một Biến thể trong [startsAt, endsAt). */
export interface SalePrice {
  id: string
  variantId: string
  /** VND số nguyên, nhỏ hơn Giá bán. */
  price: number
  startsAt: string
  endsAt: string
  status: SalePriceStatus
}
