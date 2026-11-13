import type { RouteRecordRaw } from 'vue-router'
export const productRoutes: RouteRecordRaw[] = [
  {
    path: 'products',
    name: 'products.list',
    component: () => import('./views/ProductListView.vue'),
    meta: {
      titleKey: 'dashboard.products',
      permission: 'CATALOG_PRODUCT_VIEW',
      sidebarGroup: 'catalog',
      command: { icon: 'i-lucide-shirt', group: 'navigate' },
    },
  },
  {
    path: 'products/new',
    name: 'products.create',
    component: () => import('./views/ProductCreateView.vue'),
    meta: { permission: 'CATALOG_PRODUCT_MANAGE', titleKey: 'common.create' },
  },
  {
    path: 'products/:id/edit',
    name: 'products.edit',
    component: () => import('./views/ProductEditView.vue'),
    // Ai xem được danh sách đều mở được chi tiết; không có quyền MANAGE thì chỉ xem.
    meta: { permission: 'CATALOG_PRODUCT_VIEW', titleKey: 'dashboard.products' },
  },
  { path: 'products/:id', redirect: (to) => `/products/${String(to.params.id)}/edit` },
]
