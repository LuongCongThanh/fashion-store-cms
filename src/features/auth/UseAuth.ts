import { computed, readonly } from 'vue'

import { useSession } from '@shared/lib/session/Session'

import { useAuthApi } from './api/Auth.api'
import { useAuthStore } from './stores/Auth.store'

import type { LoginPayload } from './types/Auth.types'

/** Interface công khai DUY NHẤT của feature auth (§8.1). Bọc Session (§M.2). */
export function useAuth() {
  const session = useSession()
  const store = useAuthStore()
  const api = useAuthApi()

  const isAuthenticated = computed(() => session.getAccessToken() !== null)

  /** Permission tính từ user.permissions, không lưu bản sao (§8.1). */
  function can(permission: string) {
    return store.user?.permissions.includes(permission) ?? false
  }

  async function login(payload: LoginPayload) {
    session.signIn(await api.login(payload))
    await store.loadUser(api.me)
  }

  /** Sau F5 chỉ còn token: tải lại user (guard gọi trước khi kiểm tra quyền). */
  async function ensureUser() {
    if (!isAuthenticated.value || store.user) return
    await store.loadUser(api.me)
  }

  async function logout() {
    store.user = null
    await session.logout()
  }

  return {
    user: readonly(computed(() => store.user)),
    isAuthenticated,
    can,
    ensureUser,
    login,
    logout,
  }
}
