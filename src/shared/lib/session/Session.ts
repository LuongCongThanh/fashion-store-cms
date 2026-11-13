import { inject } from 'vue'

import type { QueryClient } from '@tanstack/vue-query'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'

import { isApiError } from '@shared/lib/api/errors/ApiError'

import { useSessionStore } from './Session.store'

export interface AuthTokens {
  accessToken: string
}

/** Trạng thái Session có thể khởi tạo sẵn (test). */
export interface SessionSnapshot {
  accessToken?: string
}

export interface Session {
  getAccessToken(): string | null
  /** Khôi phục phiên một lần bằng refresh cookie; BE từ chối (401) là guest bình thường. Lỗi mạng/5xx ném tiếp. */
  restore(): Promise<string | null>
  /** Lấy access token mới bằng refresh cookie; BE từ chối (401) = Hết phiên, phát `authFailure`. Lỗi mạng/5xx ném tiếp, giữ phiên. */
  refresh(): Promise<string | null>
  signIn(tokens: AuthTokens): void
  logout(): Promise<void>
}

export interface SessionDeps {
  pinia: Pinia
  queryClient: QueryClient
  callRefresh: () => Promise<AuthTokens>
  /** Runtime là consumer duy nhất của lifecycle Session. */
  onAuthFailure?: () => void
  onLoggedOut?: () => void
  initial?: SessionSnapshot
}

export function createSession(deps: SessionDeps): Session {
  const store = useSessionStore(deps.pinia)
  // Key cũ của StoreScope (đã bỏ); xoá một lần cho người dùng còn dữ liệu cũ.
  localStorage.removeItem('cms.session.storeId')
  if (deps.initial) {
    store.accessToken = deps.initial.accessToken ?? null
  }

  let inflight: Promise<string | null> | null = null
  let restoreAttempted = false
  /** true khi BẤT KỲ caller nào của lượt refresh đang chạy cần phát `authFailure` (không chỉ caller đầu tiên). */
  let notifyOnFailure = false

  function clearTokens() {
    store.accessToken = null
  }

  async function doRefresh(): Promise<string | null> {
    try {
      const tokens = await deps.callRefresh()
      store.accessToken = tokens.accessToken
      return tokens.accessToken
    } catch (error) {
      // Chỉ 401 từ refresh mới là Hết phiên (GLOSSARY). Mất mạng/5xx: giữ token, để request gốc báo lỗi mạng.
      if (!isApiError(error) || error.status !== 401) throw error
      clearTokens()
      if (notifyOnFailure) deps.onAuthFailure?.()
      return null
    }
  }

  function refreshOnce(emitFailure: boolean) {
    notifyOnFailure ||= emitFailure
    inflight ??= doRefresh().finally(() => {
      inflight = null
      notifyOnFailure = false
    })
    return inflight
  }

  return {
    getAccessToken: () => store.accessToken,
    refresh: () => refreshOnce(true),
    restore() {
      if (store.accessToken) return Promise.resolve(store.accessToken)
      if (restoreAttempted) return Promise.resolve(null)
      restoreAttempted = true
      return refreshOnce(false)
    },
    logout() {
      clearTokens()
      deps.queryClient.clear()
      deps.onLoggedOut?.()
      return Promise.resolve()
    },
    signIn(tokens) {
      store.accessToken = tokens.accessToken
    },
  }
}

export const SESSION_KEY: InjectionKey<Session> = Symbol('Session')

/** Lấy Session đã provide bởi runtime. Chỉ feature auth nên gọi. */
export function useSession(): Session {
  const session = inject(SESSION_KEY)
  if (!session) throw new Error('useSession() cần createAppRuntime().plugin đã được cài.')
  return session
}
