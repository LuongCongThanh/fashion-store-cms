import type { Permission } from '@shared/lib/api/Permission'

/** Loại tài khoản (AccountType của API). Quyền không suy từ đây mà từ `permissions`. */
export type AuthRole = 'CUSTOMER' | 'STAFF' | 'ADMIN'

/** Người dùng đang đăng nhập (Model của FE — không alias DTO, §T.3). */
export interface CurrentUser {
  id: string
  name: string
  email: string
  role: AuthRole
  /** Tên các Vai trò được gán (vd. `Staff`), chỉ để hiển thị. */
  roles: string[]
  /** Hợp các Quyền của mọi Vai trò được gán, do API tính. */
  permissions: Permission[]
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
