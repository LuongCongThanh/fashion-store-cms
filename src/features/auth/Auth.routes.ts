import type { RouteRecordRaw } from 'vue-router'

/** Route của feature auth; app/router/Routes.ts gộp lại và bọc layout. */
export const authRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'auth.login',
    component: () => import('./views/LoginView.vue'),
    meta: { titleKey: 'auth.login.title', guestOnly: true },
  },
  {
    path: 'forgot-password',
    name: 'auth.forgot-password',
    component: () => import('./views/ForgotPasswordView.vue'),
    meta: { titleKey: 'auth.forgotPassword.title', guestOnly: true },
  },
  {
    path: 'reset-password',
    name: 'auth.reset-password',
    component: () => import('./views/ResetPasswordView.vue'),
    // Không guestOnly: staff đang đăng nhập vẫn phải dùng được link reset trong email.
    meta: { titleKey: 'auth.resetPassword.title' },
  },
]
