// Composition root: nơi DUY NHẤT tạo và nối mọi object dùng chung của app (D37).
// main.ts gọi không tham số; src/test/Render.ts gọi với overrides (transport mock…).
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'

import type { App } from 'vue'
import type { Router } from 'vue-router'

import { env } from '@app/config/Env.config'
import { createAppRouter } from '@app/router/Router'
import { createHttpClient, HTTP_CLIENT_KEY } from '@shared/lib/api/client/HttpClient'
import { createSession, SESSION_KEY } from '@shared/lib/session/Session'

import type { SessionSnapshot } from '@shared/lib/session/Session'

/** Những thứ test được phép thay. Prod không truyền gì. */
export interface RuntimeOverrides {
  /** Adapter axios-mock-adapter; `unknown` có chủ đích (D34). */
  transport?: unknown
  /** Router memory history. */
  router?: Router
  /** Trạng thái đăng nhập sẵn. */
  session?: SessionSnapshot
  /** Tắt retry query trong test. */
  retry?: false
}

/** Dựng toàn bộ runtime. Trả `plugin` để app.use() và các object để test assert. */
export function createAppRuntime(overrides: RuntimeOverrides = {}) {
  const pinia = createPinia()
  const router = overrides.router ?? createAppRouter()
  const queryClient = new QueryClient({
    defaultOptions: { queries: overrides.retry === false ? { retry: false } : {} },
  })
  // Session tạo trước nhưng chỉ gọi `http` khi refresh thật sự xảy ra (lazy) → không vòng phụ thuộc.
  const session = createSession({
    pinia,
    queryClient,
    callRefresh: (rt) =>
      http.post('/auth/refresh', { refreshToken: rt }, { skipAuth: true }) as Promise<{
        accessToken: string
        refreshToken: string
      }>,
    initial: overrides.session,
  })
  const http = createHttpClient({
    baseURL: env.VITE_API_BASE_URL,
    session,
    // Plan 08 thay bằng i18n.getLocale.
    getLocale: () => 'vi',
    transport: overrides.transport,
  })

  const toLogin = () => void router.push({ name: 'auth.login' })
  session.on('authFailure', toLogin)
  session.on('loggedOut', toLogin)

  const plugin = {
    install(app: App) {
      app.use(pinia).use(router).use(VueQueryPlugin, { queryClient })
      app.provide(HTTP_CLIENT_KEY, http)
      app.provide(SESSION_KEY, session)
    },
  }
  return { plugin, router, session, http, queryClient }
}
