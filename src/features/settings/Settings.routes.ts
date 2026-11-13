import type { RouteRecordRaw } from 'vue-router'
export const settingsRoutes: RouteRecordRaw[] = [
  {
    path: 'settings',
    name: 'settings',
    redirect: '/settings/store',
    meta: {
      permission: 'settings:read',
      titleKey: 'settings.title',
      sidebarGroup: 'administration',
      command: { icon: 'i-lucide-settings', group: 'navigate' },
    },
  },
  {
    path: 'settings/store',
    name: 'settings.store',
    component: () => import('./views/StoreSettingsView.vue'),
    meta: { permission: 'settings:write', titleKey: 'settings.store' },
  },
  {
    path: 'settings/localization',
    name: 'settings.localization',
    component: () => import('./views/LocalizationSettingsView.vue'),
    meta: { permission: 'settings:write', titleKey: 'settings.localization' },
  },
]
