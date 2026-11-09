import { inject } from 'vue'

import type { QueryClient } from '@tanstack/vue-query'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'

import { useSessionStore } from './Session.store'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/** Trạng thái Session có thể khởi tạo sẵn (test). */
export interface SessionSnapshot {
  accessToken?: string
  refreshToken?: string
  storeId?: string
}

export interface Session {
  /** Token hiện tại để HttpClient gắn header Authorization; null = chưa đăng nhập. */
  getAccessToken(): string | null
  /** Store đang quản lý để HttpClient gắn header X-Store-Id; null = chưa chọn. */
  getStoreId(): string | null
  /** Đổi Store: persist storeId + queryClient.clear() để query đang mở fetch lại theo Store mới. */
  switchStore(id: string): Promise<void>
  /**
   * Lấy access token mới bằng refresh token. Nhiều lời gọi đồng thời dùng chung MỘT promise.
   * Thất bại → xoá token, phát 'authFailure', trả null.
   */
  refresh(): Promise<string | null>
  /** Lưu token sau khi login thành công. `remember: false` → chỉ giữ trong tab hiện tại. */
  signIn(tokens: AuthTokens, opts?: SignInOptions): void
  /** Xoá token + queryClient.clear() + phát 'loggedOut'. */
  logout(): Promise<void>
  /** Đăng ký nghe sự kiện; trả hàm huỷ đăng ký. Runtime dùng để điều hướng về login. */
  on(event: SessionEvent, fn: () => void): () => void
}

export interface SignInOptions {
  /** Mặc định true: giữ Session sau khi đóng trình duyệt. */
  remember?: boolean
}

export type SessionEvent = 'authFailure' | 'loggedOut'

export interface SessionDeps {
  pinia: Pinia
  queryClient: QueryClient
  callRefresh: (refreshToken: string) => Promise<AuthTokens>
  initial?: SessionSnapshot
}

export function createSession(deps: SessionDeps): Session {
  const store = useSessionStore(deps.pinia)
  if (deps.initial) {
    store.accessToken = deps.initial.accessToken ?? null
    store.refreshToken = deps.initial.refreshToken ?? null
    store.storeId = deps.initial.storeId ?? null
  }

  let inflight: Promise<string | null> | null = null
  const listeners: Record<SessionEvent, Set<() => void>> = {
    authFailure: new Set(),
    loggedOut: new Set(),
  }
  const emit = (event: SessionEvent) => {
    listeners[event].forEach((fn) => {
      fn()
    })
  }

  function clearTokens() {
    store.accessToken = null
    store.refreshToken = null
  }

  async function doRefresh(): Promise<string | null> {
    const refreshToken = store.refreshToken
    try {
      if (!refreshToken) throw new Error('No refresh token')
      const tokens = await deps.callRefresh(refreshToken)
      store.accessToken = tokens.accessToken
      store.refreshToken = tokens.refreshToken
      return tokens.accessToken
    } catch {
      clearTokens()
      emit('authFailure')
      return null
    }
  }

  return {
    getAccessToken: () => store.accessToken,
    getStoreId: () => store.storeId,
    switchStore(id) {
      store.storeId = id
      deps.queryClient.clear()
      return Promise.resolve()
    },
    refresh() {
      inflight ??= doRefresh().finally(() => {
        inflight = null
      })
      return inflight
    },
    logout() {
      clearTokens()
      deps.queryClient.clear()
      emit('loggedOut')
      return Promise.resolve()
    },
    on(event, fn) {
      listeners[event].add(fn)
      return () => listeners[event].delete(fn)
    },
    signIn(tokens, opts = {}) {
      store.remember = opts.remember ?? true
      store.accessToken = tokens.accessToken
      store.refreshToken = tokens.refreshToken
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
