import type { RouteRecordRaw } from 'vue-router'
export const productRoutes: RouteRecordRaw[] = [
  {
    path: 'products',
    name: 'products.list',
    component: () => import('./views/ProductListView.vue'),
    meta: {
      titleKey: 'dashboard.products',
      permission: 'product:read',
      sidebarGroup: 'store',
      command: { icon: 'i-lucide-shirt', group: 'navigate' },
    },
  },
]
