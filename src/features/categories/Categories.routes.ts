import type { RouteRecordRaw } from 'vue-router'
export const categoryRoutes: RouteRecordRaw[] = [
  {
    path: 'categories',
    name: 'categories.list',
    component: () => import('./views/CategoryListView.vue'),
    meta: {
      titleKey: 'products.category',
      permission: 'category:read',
      sidebarGroup: 'store',
      command: { icon: 'i-lucide-folder-tree', group: 'navigate' },
    },
  },
  {
    path: 'categories/new',
    name: 'categories.create',
    component: () => import('./views/CategoryCreateView.vue'),
    meta: { titleKey: 'common.create', permission: 'category:write' },
  },
  {
    path: 'categories/:id/edit',
    name: 'categories.edit',
    component: () => import('./views/CategoryEditView.vue'),
    meta: { titleKey: 'common.edit', permission: 'category:write' },
  },
]
