import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    permission?: string
    /** Chỉ cho người chưa đăng nhập (login, quên mật khẩu). */
    guestOnly?: boolean
    /** i18n key cho <title> + breadcrumb. */
    titleKey?: string
    command?: { icon: string; group: 'create' | 'navigate'; shortcut?: string[] }
  }
}
