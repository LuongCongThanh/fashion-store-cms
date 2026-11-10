export type AuthRole = 'CUSTOMER' | 'STAFF' | 'ADMIN'

/** Người dùng đang đăng nhập (Model của FE — không alias DTO, §T.3). */
export interface CurrentUser {
  id: string
  name: string
  email: string
  role: AuthRole
  permissions: string[]
}

/** Thông tin đăng nhập do form gửi lên. */
export interface LoginPayload {
  email: string
  password: string
}

/** Dữ liệu đặt lại mật khẩu: token lấy từ link email. */
export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}
