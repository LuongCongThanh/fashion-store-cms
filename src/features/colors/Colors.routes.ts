import type { RouteRecordRaw } from 'vue-router'
export const colorRoutes: RouteRecordRaw[] = [
  {
    path: 'colors',
    name: 'colors.list',
    component: () => import('./views/ColorListView.vue'),
    meta: {
      titleKey: 'colors.title',
      permission: 'CATALOG_PRODUCT_OPTION_VIEW',
      sidebarGroup: 'catalog',
      command: { icon: 'i-lucide-palette', group: 'navigate' },
    },
  },
  {
    path: 'colors/new',
    name: 'colors.create',
    component: () => import('./views/ColorEditView.vue'),
    meta: { titleKey: 'common.create', permission: 'CATALOG_PRODUCT_OPTION_MANAGE' },
  },
  {
    path: 'colors/:id/edit',
    name: 'colors.edit',
    component: () => import('./views/ColorEditView.vue'),
    meta: { titleKey: 'common.edit', permission: 'CATALOG_PRODUCT_OPTION_MANAGE' },
  },
]
