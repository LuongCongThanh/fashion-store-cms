import type { RouteRecordRaw } from 'vue-router'
export const sizeRoutes: RouteRecordRaw[] = [
  {
    path: 'sizes',
    name: 'sizes.list',
    component: () => import('./views/SizeListView.vue'),
    meta: {
      titleKey: 'sizes.title',
      permission: 'CATALOG_PRODUCT_OPTION_VIEW',
      sidebarGroup: 'catalog',
      command: { icon: 'i-lucide-ruler', group: 'navigate' },
    },
  },
  {
    path: 'sizes/new',
    name: 'sizes.create',
    component: () => import('./views/SizeEditView.vue'),
    meta: { titleKey: 'common.create', permission: 'CATALOG_PRODUCT_OPTION_MANAGE' },
  },
  {
    path: 'sizes/:id/edit',
    name: 'sizes.edit',
    component: () => import('./views/SizeEditView.vue'),
    meta: { titleKey: 'common.edit', permission: 'CATALOG_PRODUCT_OPTION_MANAGE' },
  },
]
