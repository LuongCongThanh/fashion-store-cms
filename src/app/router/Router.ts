import { createRouter, createWebHistory } from 'vue-router'

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
    ],
  })
}
