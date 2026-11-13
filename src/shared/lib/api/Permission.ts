import type { components } from '@shared/lib/api/Api.generated'

/** Quyền (Permission) do API định nghĩa — enum trong OpenAPI. FE không tự đặt chuỗi quyền. */
export type Permission = components['schemas']['Permission']

/**
 * Quyền của màn hình chưa có hợp đồng API (đơn hàng, tồn kho, khách hàng, cài đặt).
 * API không bao giờ cấp các chuỗi này nên `can()` luôn trả false: route ẩn khỏi menu, guard trả 403.
 * Slice nối API của màn hình nào thì đổi sang `Permission` thật và xoá chuỗi đó khỏi đây.
 */
export type PendingPermission =
  | 'order:read'
  | 'order:write'
  | 'inventory:read'
  | 'inventory:write'
  | 'customer:read'
  | 'settings:read'
  | 'settings:write'

/** Quyền mà route, nút hoặc widget yêu cầu. */
export type RequiredPermission = Permission | PendingPermission
