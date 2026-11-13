import { computed, readonly } from 'vue'

import { isApiError } from '@shared/lib/api/errors/ApiError'
import { useSession } from '@shared/lib/session/Session'

import type { RequiredPermission } from '@shared/lib/api/Permission'

import { useAuthApi, useAuthMutations } from './api/Auth.api'
import { useAuthStore } from './stores/Auth.store'

import type { LoginPayload, ResetPasswordPayload } from './types/Auth.types'

/** Interface công khai DUY NHẤT của feature auth (§8.1). Bọc Session (§M.2). */
export function useAuth() {
  const session = useSession()
  const store = useAuthStore()
  const api = useAuthApi()
  const mutations = useAuthMutations(api)

  const isAuthenticated = computed(() => session.getAccessToken() !== null)

  /** Chỉ đọc `permissions` do API trả; `PendingPermission` không bao giờ được cấp nên luôn false. */
  function can(permission: RequiredPermission) {
    const granted: readonly RequiredPermission[] = store.user?.permissions ?? []
    return granted.includes(permission)
  }

  async function login(payload: LoginPayload) {
    const result = await mutations.login.mutateAsync(payload)
    session.signIn({ accessToken: result.accessToken })
    try {
      // `me()` từ chối tài khoản CUSTOMER và trả Quyền của tài khoản.
      await store.loadUser(() => api.me())
    } catch (error) {
      // BE đã cấp refresh cookie → thu hồi ngay để F5 không tự đăng nhập lại.
      await endSession({ revoke: true })
      throw error
    }
  }

  /** Xoá state cục bộ; `revoke` = báo BE thu hồi refresh cookie. Best-effort: lỗi thu hồi không chặn đăng xuất. */
  async function endSession({ revoke }: { revoke: boolean }) {
    if (revoke) await mutations.logout.mutateAsync().catch(() => undefined)
    store.clearUser()
    await session.logout()
  }

  /**
   * Nạp user hiện tại. 401/403 (phiên chết, tài khoản CUSTOMER) → kết thúc phiên và thu hồi cookie.
   * Lỗi khác (mạng, 5xx) ném tiếp: giữ phiên, để router báo lỗi thay vì đăng xuất oan.
   */
  async function loadUserOrEndSession() {
    try {
      await store.loadUser(() => api.me())
      return true
    } catch (error) {
      if (!isApiError(error) || (error.status !== 401 && error.status !== 403)) throw error
      await endSession({ revoke: true })
      return false
    }
  }

  /** Sau tải lại trang, access token được phục hồi qua HttpOnly refresh cookie. */
  async function restoreSession() {
    if (isAuthenticated.value) return true
    const token = await session.restore()
    if (!token) return false
    return loadUserOrEndSession()
  }

  /** Guard gọi trước khi kiểm tra permission: đảm bảo có cả token lẫn user. */
  async function ensureUser() {
    if (!(await restoreSession())) return
    if (!store.user) await loadUserOrEndSession()
  }

  /** Gửi email đặt lại mật khẩu. Không cho biết email có tồn tại hay không. */
  async function requestPasswordReset(email: string) {
    await mutations.forgotPassword.mutateAsync({ email })
  }

  async function resetPassword(payload: ResetPasswordPayload) {
    await mutations.resetPassword.mutateAsync(payload)
  }

  function logout() {
    return endSession({ revoke: true })
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
