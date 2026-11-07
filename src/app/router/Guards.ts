import type { RouteLocationNormalized } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'

/**
 * Yêu cầu đăng nhập (`meta.requiresAuth`), quyền (`meta.permission`);
 * trang chỉ cho khách (`meta.guestOnly`) đẩy người đã đăng nhập về `/`.
 * Chỉ dùng useAuth(), không import store.
 */
export async function authGuard(to: RouteLocationNormalized) {
  const auth = useAuth()
  if (to.meta.guestOnly && auth.isAuthenticated.value) return { name: 'home' }
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return { name: 'auth.login', query: { redirect: to.fullPath } }
  }
  if (to.meta.permission) await auth.ensureUser()
  if (to.meta.permission && !auth.can(to.meta.permission)) {
    return { name: 'forbidden' }
  }
  return true
}
