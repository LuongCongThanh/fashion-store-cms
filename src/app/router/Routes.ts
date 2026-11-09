import type { RouteRecordRaw } from 'vue-router'

import { authRoutes } from '@features/auth/Auth.routes'
import { categoryRoutes } from '@features/categories/Categories.routes'
import { customerRoutes } from '@features/customers/Customers.routes'
// Nơi DUY NHẤT gộp <Feature>.routes.ts và import views/ (§B.3).
import { dashboardRoutes } from '@features/dashboard/Dashboard.routes'
import { inventoryRoutes } from '@features/inventory/Inventory.routes'
import { orderRoutes } from '@features/orders/Orders.routes'
import { productRoutes } from '@features/products/Products.routes'
import { promotionRoutes } from '@features/promotions/Promotions.routes'

/** Trang chỉ dùng ở dev (§L.10). */
const devRoutes: RouteRecordRaw[] = import.meta.env.DEV
  ? [
      {
        path: 'design-system',
        name: 'design-system',
        component: () => import('@app/views/DesignSystemView.vue'),
      },
    ]
  : []

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      ...dashboardRoutes,
      ...promotionRoutes,
      ...inventoryRoutes,
      ...customerRoutes,
      ...orderRoutes,
      ...categoryRoutes,
      ...productRoutes,
      { path: '403', name: 'forbidden', component: () => import('@app/views/ForbiddenView.vue') },
      ...devRoutes,
    ],
  },
  // Sau DashboardLayout: cả hai cùng path '/', '/' phải khớp vào dashboard.
  {
    path: '/',
    component: () => import('@layouts/AuthLayout.vue'),
    children: authRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@app/views/NotFoundView.vue'),
  },
]
