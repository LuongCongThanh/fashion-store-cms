export interface StaffUser {
  id: string
  name: string
  email: string
  roleIds: string[]
  status: 'active' | 'inactive'
}
