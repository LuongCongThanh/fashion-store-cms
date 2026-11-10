export type AuthRole = 'CUSTOMER' | 'STAFF' | 'ADMIN'

/** Người dùng đang đăng nhập (Model của FE — không alias DTO, §T.3). */
export interface CurrentUser {
  id: string
  name: string
  email: string
  role: AuthRole
  permissions: string[]
}
