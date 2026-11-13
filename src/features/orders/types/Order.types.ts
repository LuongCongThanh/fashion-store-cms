/** 9 trạng thái Đơn hàng (be-demo/docs/business/05-order-lifecycle.md §1). Chuyển trạng thái do API quyết định. */
export const ORDER_STATUSES = [
  'PENDING_PAYMENT',
  'PLACED',
  'CONFIRMED',
  'PACKING',
  'SHIPPING',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'RETURNED_TO_SENDER',
] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'
export interface Order {
  id: string
  number: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  total: number
  subtotal?: number
  discount?: number
  shippingCost?: number
  customer: { id?: string; name: string; email: string }
  shipping: { address: string; carrier: string; trackingNumber: string }
  payment: { method: string; reference: string }
  items: { id: string; name: string; sku: string; quantity: number; price: number }[]
  timeline: { id: string; label: string; createdAt: string }[]
  createdAt?: string
}
