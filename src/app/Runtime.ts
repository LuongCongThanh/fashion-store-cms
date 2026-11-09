// Composition root: nơi DUY NHẤT tạo và nối mọi object dùng chung của app (D37).
// main.ts gọi không tham số; src/test/Render.ts gọi với overrides (transport mock…).
import { useToast } from '@nuxt/ui/composables'
import ui from '@nuxt/ui/vue-plugin'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'

import type { App } from 'vue'
import type { Router } from 'vue-router'

import { env } from '@app/config/Env.config'
import { installErrorHandling } from '@app/providers/ErrorHandling'
import { createAppRouter } from '@app/router/Router'
import { createNotifier, NOTIFIER_KEY } from '@shared/composables/UseNotify'
import { createHttpClient, HTTP_CLIENT_KEY } from '@shared/lib/api/client/HttpClient'
import { ApiError } from '@shared/lib/api/errors/ApiError'
import { ErrorCode } from '@shared/lib/api/errors/ErrorCode'
import { createAppI18n } from '@shared/lib/i18n/I18n'
import { createAppQueryClient } from '@shared/lib/query/QueryClient'
import { createSession, SESSION_KEY } from '@shared/lib/session/Session'

import type { Notifier } from '@shared/composables/UseNotify'
import type { SessionSnapshot } from '@shared/lib/session/Session'

/** Những thứ test (và Mock auth ở DEV) được phép thay. Prod không truyền gì. */
export interface RuntimeOverrides {
  /** Adapter axios-mock-adapter (test, hoặc Mock auth ở DEV); `unknown` có chủ đích (D34). */
  transport?: unknown
  /** Notifier giả để assert toast. */
  notifier?: Notifier
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
  const i18n = createAppI18n()
  const router = overrides.router ?? createAppRouter({ translate: i18n.translate })
  const notifier = overrides.notifier ?? createNotifier({ toast: useToast(), t: i18n.translate, te: i18n.has })
  const queryClient = createAppQueryClient({
    onMutationError: notifier.error,
    retry: overrides.retry,
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
    getLocale: i18n.getLocale,
    transport: overrides.transport,
  })

  const toLogin = () => void router.push({ name: 'auth.login' })
  session.on('authFailure', () => {
    notifier.error(new ApiError(401, ErrorCode.UNAUTHORIZED, 'Session expired'))
    toLogin()
  })
  session.on('loggedOut', toLogin)

  const plugin = {
    install(app: App) {
      app.use(pinia).use(i18n).use(router).use(VueQueryPlugin, { queryClient }).use(ui)
      app.provide(HTTP_CLIENT_KEY, http)
      app.provide(SESSION_KEY, session)
      app.provide(NOTIFIER_KEY, notifier)
      installErrorHandling(app, { router, notifier })
    },
  }
  return { plugin, router, session, http, queryClient, notifier }
}
