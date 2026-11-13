import type { RouteRecordRaw } from 'vue-router'

import { internalAccountRoutes } from '@features/accounts/InternalAccounts.routes'
import { authRoutes } from '@features/auth/Auth.routes'
import { categoryRoutes } from '@features/categories/Categories.routes'
import { colorRoutes } from '@features/colors/Colors.routes'
import { customerRoutes } from '@features/customers/Customers.routes'
// Nơi DUY NHẤT gộp <Feature>.routes.ts và import views/ (§B.3).
import { dashboardRoutes } from '@features/dashboard/Dashboard.routes'
import { inventoryRoutes } from '@features/inventory/Inventory.routes'
import { orderRoutes } from '@features/orders/Orders.routes'
import { productRoutes } from '@features/products/Products.routes'
import { roleRoutes } from '@features/roles/Roles.routes'
import { settingsRoutes } from '@features/settings/Settings.routes'
import { sizeRoutes } from '@features/sizes/Sizes.routes'
import { voucherRoutes } from '@features/vouchers/Vouchers.routes'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      ...dashboardRoutes,
      ...productRoutes,
      ...categoryRoutes,
      ...sizeRoutes,
      ...colorRoutes,
      ...voucherRoutes,
      ...orderRoutes,
      ...inventoryRoutes,
      ...customerRoutes,
      ...internalAccountRoutes,
      ...roleRoutes,
      ...settingsRoutes,
      { path: '403', name: 'forbidden', component: () => import('@app/views/ForbiddenView.vue') },
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
