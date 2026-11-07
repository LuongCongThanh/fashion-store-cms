import type { RouteLocationNormalized } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'

/**
 * Yêu cầu đăng nhập (`meta.requiresAuth`) và quyền (`meta.permission`).
 * Chỉ dùng useAuth(), không import store.
 */
export async function authGuard(to: RouteLocationNormalized) {
  const auth = useAuth()
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return { name: 'auth.login', query: { redirect: to.fullPath } }
  }
  if (to.meta.permission) await auth.ensureUser()
  if (to.meta.permission && !auth.can(to.meta.permission)) {
    return { name: 'forbidden' }
  }
  return true
}
