import type { Permission } from '@shared/lib/api/Permission'

/** Vai trò (Role): tập Quyền cấu hình được, gán cho Tài khoản nội bộ. */
export interface Role {
  id: string
  name: string
  description: string | null
  /** Vai trò hệ thống (`Admin`, `Staff`): không đổi tên, không xoá. */
  isSystem: boolean
  /** Vai trò `Admin`: luôn có mọi Quyền, API từ chối mọi thay đổi. */
  isReadOnly: boolean
  permissions: Permission[]
  accountCount: number
}

/** Nhóm Quyền theo tiền tố (CATALOG, ADMINISTRATION…) do API trả. */
export interface PermissionGroup {
  group: string
  permissions: Permission[]
}
