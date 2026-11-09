export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  status?: 'active' | 'inactive'
  orderCount?: number
  totalSpent?: number
  addresses: { id: string; label: string; address: string; isDefault: boolean }[]
  activity: { id: string; label: string; createdAt: string }[]
}
