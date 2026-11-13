/** Vai trò đang gán cho một Tài khoản nội bộ (bản rút gọn). */
export interface AssignedRole {
  id: string
  name: string
  isSystem: boolean
}

/** Tài khoản nội bộ (Staff) do Admin quản lý trên CMS. Tài khoản Admin không xuất hiện ở đây. */
export interface InternalAccount {
  id: string
  name: string
  email: string
  status: 'ACTIVE' | 'DISABLED'
  roles: AssignedRole[]
  createdAt: string
}
