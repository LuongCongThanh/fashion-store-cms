export interface Permission {
  key: string
  resource: string
  action: string
}
export interface Role {
  id: string
  name: string
  permissions: string[]
}
