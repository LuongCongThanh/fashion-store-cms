import type { RouteRecordRaw } from 'vue-router'
export const customerRoutes: RouteRecordRaw[] = [
  {
    path: 'customers',
    name: 'customers.list',
    component: () => import('./views/CustomerListView.vue'),
    meta: {
      permission: 'customer:read',
      titleKey: 'dashboard.customers',
      sidebarGroup: 'operations',
      command: { icon: 'i-lucide-users', group: 'navigate' },
    },
  },
  {
    path: 'customers/:id',
    name: 'customers.detail',
    component: () => import('./views/CustomerDetailView.vue'),
    meta: { permission: 'customer:read', titleKey: 'dashboard.customers' },
  },
]
