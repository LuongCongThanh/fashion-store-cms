/** Người dùng đang đăng nhập (Model của FE — không alias DTO, §T.3). */
export interface CurrentUser {
  id: string
  name: string
  email: string
  permissions: string[]
}

export interface LoginPayload {
  email: string
  password: string
}
