import type { RouteRecordRaw } from 'vue-router'

/** Route của feature auth; app/router/Routes.ts gộp lại và bọc layout. */
export const authRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'auth.login',
    component: () => import('./views/LoginView.vue'),
    meta: { titleKey: 'auth.login.title' },
  },
]
