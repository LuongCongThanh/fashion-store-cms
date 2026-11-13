import type { RouteRecordRaw } from 'vue-router'
export const categoryRoutes: RouteRecordRaw[] = [
  {
    path: 'categories',
    name: 'categories.list',
    component: () => import('./views/CategoryListView.vue'),
    meta: {
      titleKey: 'products.category',
      permission: 'CATALOG_CATEGORY_VIEW',
      sidebarGroup: 'catalog',
      command: { icon: 'i-lucide-folder-tree', group: 'navigate' },
    },
  },
  {
    path: 'categories/new',
    name: 'categories.create',
    component: () => import('./views/CategoryCreateView.vue'),
    meta: { titleKey: 'common.create', permission: 'CATALOG_CATEGORY_MANAGE' },
  },
  {
    path: 'categories/:id/edit',
    name: 'categories.edit',
    component: () => import('./views/CategoryEditView.vue'),
    meta: { titleKey: 'common.edit', permission: 'CATALOG_CATEGORY_MANAGE' },
  },
]
