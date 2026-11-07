import type { RouteRecordRaw } from 'vue-router'

// Nơi DUY NHẤT gộp <Feature>.routes.ts và import views/ (§B.3).
import { authRoutes } from '@features/auth/Auth.routes'

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
  { path: '/', redirect: '/admin' },
  {
    path: '/',
    component: () => import('@layouts/AuthLayout.vue'),
    children: authRoutes,
  },
  {
    path: '/admin',
    component: () => import('@layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // Dashboard thật làm ở P4.
      { path: '', name: 'home', component: { render: () => null } },
      { path: '403', name: 'forbidden', component: () => import('@app/views/ForbiddenView.vue') },
      ...devRoutes,
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@app/views/NotFoundView.vue'),
  },
]
