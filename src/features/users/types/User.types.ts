export interface StaffUser {
  id: string
  name: string
  email: string
  roleIds: string[]
  storeIds: string[]
  status: 'active' | 'inactive'
}
