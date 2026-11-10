import { computed, readonly } from 'vue'

import { useSession } from '@shared/lib/session/Session'

import {
  useAuthApi,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
} from './api/Auth.api'
import { useAuthStore } from './stores/Auth.store'

import type { LoginPayload, ResetPasswordPayload } from './api/Auth.api'

/** Interface công khai DUY NHẤT của feature auth (§8.1). Bọc Session (§M.2). */
export function useAuth() {
  const session = useSession()
  const store = useAuthStore()
  const api = useAuthApi()
  const loginMutation = useLoginMutation()
  const forgotPasswordMutation = useForgotPasswordMutation()
  const resetPasswordMutation = useResetPasswordMutation()
  const logoutMutation = useLogoutMutation()

  const isAuthenticated = computed(() => session.getAccessToken() !== null)

  /** ADMIN không bị giới hạn UI; STAFF dùng ma trận quyền tạm thời tại auth API. */
  function can(permission: string) {
    return store.user?.role === 'ADMIN' || (store.user?.permissions.includes(permission) ?? false)
  }

  async function login(payload: LoginPayload) {
    const result = await loginMutation.mutateAsync(payload)
    session.signIn({ accessToken: result.accessToken })
    store.setUser(result.user)
  }

  /** Sau tải lại trang, access token được phục hồi qua HttpOnly refresh cookie. */
  async function restoreSession() {
    if (isAuthenticated.value) return true
    const token = await session.restore()
    if (!token) return false
    try {
      await store.loadUser(loadCurrentUser)
      return true
    } catch {
      store.clearUser()
      await session.logout()
      return false
    }
  }

  /** Guard gọi trước khi kiểm tra permission khi access token đã có sẵn. */
  async function ensureUser() {
    if (!isAuthenticated.value) await restoreSession()
    if (!isAuthenticated.value || store.user) return
    await store.loadUser(loadCurrentUser)
  }

  async function loadCurrentUser() {
    return api.me()
  }

  /** Gửi email đặt lại mật khẩu. Không cho biết email có tồn tại hay không. */
  async function requestPasswordReset(email: string) {
    await forgotPasswordMutation.mutateAsync({ email })
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    await resetPasswordMutation.mutateAsync(payload)
  }

  async function logout() {
    try {
      await logoutMutation.mutateAsync()
    } finally {
      store.clearUser()
      await session.logout()
    }
  }

  return {
    user: readonly(computed(() => store.user)),
    isAuthenticated,
    can,
    ensureUser,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    restoreSession,
  }
}
