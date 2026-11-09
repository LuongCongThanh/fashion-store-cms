import type { OrderStatus } from '../types/Order.types'
const transitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}
export function nextOrderStatuses(status: OrderStatus): OrderStatus[] {
  return transitions[status] ?? []
}
