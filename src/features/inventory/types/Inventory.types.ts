export interface InventoryItem {
  id: string
  sku: string
  name: string
  current: number
  reserved: number
  available: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}
export interface InventoryMovement {
  id: string
  sku: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  reference: string
  createdAt: string
  createdBy: string
}
