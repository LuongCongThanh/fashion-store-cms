export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
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
