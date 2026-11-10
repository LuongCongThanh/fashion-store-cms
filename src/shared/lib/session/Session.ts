import { inject } from 'vue'

import type { QueryClient } from '@tanstack/vue-query'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'

import { useSessionStore } from './Session.store'

export interface AuthTokens {
  accessToken: string
}

/** Trạng thái Session có thể khởi tạo sẵn (test). */
export interface SessionSnapshot {
  accessToken?: string
  storeId?: string
}

export interface Session {
  getAccessToken(): string | null
  getStoreId(): string | null
  switchStore(id: string): Promise<void>
  /** Khôi phục phiên một lần bằng refresh cookie; thất bại là guest bình thường. */
  restore(): Promise<string | null>
  /** Lấy access token mới bằng refresh cookie; thất bại phát `authFailure`. */
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
  if (deps.initial) {
    store.accessToken = deps.initial.accessToken ?? null
    store.storeId = deps.initial.storeId ?? null
  }

  let inflight: Promise<string | null> | null = null
  let restoreAttempted = false

  function clearTokens() {
    store.accessToken = null
  }

  async function doRefresh(emitFailure: boolean): Promise<string | null> {
    try {
      const tokens = await deps.callRefresh()
      store.accessToken = tokens.accessToken
      return tokens.accessToken
    } catch {
      clearTokens()
      if (emitFailure) deps.onAuthFailure?.()
      return null
    }
  }

  function refreshOnce(emitFailure: boolean) {
    inflight ??= doRefresh(emitFailure).finally(() => {
      inflight = null
    })
    return inflight
  }

  return {
    getAccessToken: () => store.accessToken,
    getStoreId: () => store.storeId,
    switchStore(id) {
      store.storeId = id
      deps.queryClient.clear()
      return Promise.resolve()
    },
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

/** Lấy Session đã provide bởi runtime. Chỉ feature auth / StoreScope nên gọi. */
export function useSession(): Session {
  const session = inject(SESSION_KEY)
  if (!session) throw new Error('useSession() cần createAppRuntime().plugin đã được cài.')
  return session
}
