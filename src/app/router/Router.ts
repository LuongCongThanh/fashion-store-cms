import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

/** Trang chỉ dùng ở dev (§L.10). */
const DEV_ROUTES: RouteRecordRaw[] = import.meta.env.DEV
  ? [
      {
        path: '/admin/design-system',
        name: 'design-system',
        component: () => import('@app/views/DesignSystemView.vue'),
      },
    ]
  : []

/**
 * Router tối thiểu cho Foundation. Plan 09 thay bằng Routes.ts (gộp <Feature>.routes.ts) + Guards.
 * `auth.login` có sẵn vì Runtime điều hướng về đây khi Session phát authFailure / loggedOut.
 */
export function createAppRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: () => import('@layouts/DashboardLayout.vue') },
      {
        path: '/login',
        name: 'auth.login',
        component: () => import('@layouts/DashboardLayout.vue'),
      },
      ...DEV_ROUTES,
    ],
  })
}
