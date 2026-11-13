import 'vue-router'

import type { RequiredPermission } from '@shared/lib/api/Permission'

declare module 'vue-router' {
  interface RouteMeta {
    sidebarGroup?: 'catalog' | 'operations' | 'administration'
    requiresAuth?: boolean
    permission?: RequiredPermission
    /** Chỉ cho người chưa đăng nhập (login, quên mật khẩu). */
    guestOnly?: boolean
    /** i18n key cho <title> + breadcrumb. */
    titleKey?: string
    command?: { icon: string; group: 'create' | 'navigate'; shortcut?: string[] }
  }
}
