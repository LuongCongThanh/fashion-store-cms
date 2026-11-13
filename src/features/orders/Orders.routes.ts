import type { RouteRecordRaw } from 'vue-router'
export const orderRoutes: RouteRecordRaw[] = [
  {
    path: 'orders',
    name: 'orders.list',
    component: () => import('./views/OrderListView.vue'),
    meta: {
      titleKey: 'nav.orders',
      permission: 'order:read',
      sidebarGroup: 'operations',
      command: { icon: 'i-lucide-receipt', group: 'navigate' },
    },
  },
  {
    path: 'orders/:id',
    name: 'orders.detail',
    component: () => import('./views/OrderDetailView.vue'),
    meta: { permission: 'order:read', titleKey: 'nav.orders' },
  },
]
