import type { RouteRecordRaw } from 'vue-router'

import { internalAccountRoutes } from '@features/accounts/InternalAccounts.routes'
import { authRoutes } from '@features/auth/Auth.routes'
import { categoryRoutes } from '@features/categories/Categories.routes'
import { customerRoutes } from '@features/customers/Customers.routes'
// Nơi DUY NHẤT gộp <Feature>.routes.ts và import views/ (§B.3).
import { dashboardRoutes } from '@features/dashboard/Dashboard.routes'
import { inventoryRoutes } from '@features/inventory/Inventory.routes'
import { orderRoutes } from '@features/orders/Orders.routes'
import { productRoutes } from '@features/products/Products.routes'
import { promotionRoutes } from '@features/promotions/Promotions.routes'
import { roleRoutes } from '@features/roles/Roles.routes'
import { settingsRoutes } from '@features/settings/Settings.routes'

/** Trang chỉ dùng ở dev (§L.10). */
const devRoutes: RouteRecordRaw[] = import.meta.env.DEV
  ? [
      {
        path: 'design-system',
        name: 'design-system',
        component: () => import('@app/views/DesignSystemView.vue'),
      },
      // Phase 0.5 UI/UX hardening: 3 biến thể mỗi màn, `?variant=A|B|C`, fixture tĩnh, không gọi API.
      {
        path: 'prototype/dashboard',
        name: 'prototype-dashboard',
        component: () => import('@features/dashboard/prototype/DashboardPrototype.vue'),
      },
      {
        path: 'prototype/products',
        name: 'prototype-products',
        component: () => import('@features/products/prototype/ProductListPrototype.vue'),
      },
      {
        path: 'prototype/orders',
        name: 'prototype-orders',
        component: () => import('@features/orders/prototype/OrderDetailPrototype.vue'),
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
      ...settingsRoutes,
      ...internalAccountRoutes,
      ...roleRoutes,
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
