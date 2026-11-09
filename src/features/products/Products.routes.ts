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

  {
    path: 'products/new',
    name: 'products.create',
    component: () => import('./views/ProductCreateView.vue'),
    meta: { permission: 'product:write', titleKey: 'common.create' },
  },
  {
    path: 'products/:id',
    name: 'products.detail',
    component: () => import('./views/ProductDetailView.vue'),
    meta: { permission: 'product:read', titleKey: 'dashboard.products' },
  },
  {
    path: 'products/:id/edit',
    name: 'products.edit',
    component: () => import('./views/ProductEditView.vue'),
    meta: { permission: 'product:write', titleKey: 'common.edit' },
  },
]
