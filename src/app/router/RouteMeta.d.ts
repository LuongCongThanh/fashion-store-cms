import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    permission?: string
    /** i18n key cho <title> + breadcrumb. */
    titleKey?: string
    command?: { icon: string; group: 'create' | 'navigate'; shortcut?: string[] }
  }
}
