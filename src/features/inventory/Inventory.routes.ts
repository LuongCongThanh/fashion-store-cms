import type { RouteRecordRaw } from 'vue-router'
export const inventoryRoutes: RouteRecordRaw[] = [
  {
    path: 'inventory',
    name: 'inventory.list',
    component: () => import('./views/InventoryListView.vue'),
    meta: {
      titleKey: 'inventory.title',
      permission: 'inventory:read',
      sidebarGroup: 'operations',
      command: { icon: 'i-lucide-boxes', group: 'navigate' },
    },
  },
  {
    path: 'inventory/movements',
    name: 'inventory.movements',
    component: () => import('./views/StockMovementListView.vue'),
    meta: { titleKey: 'inventory.movements', permission: 'inventory:read' },
  },
]
