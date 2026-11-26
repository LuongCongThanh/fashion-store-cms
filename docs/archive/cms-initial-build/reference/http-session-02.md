# M. HTTP client, seam với auth và StoreScope — phần 2

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

**Composition root — `createAppRuntime()` (D37):**

```ts
// src/app/Runtime.ts
// Composition root: nơi DUY NHẤT tạo và nối mọi object dùng chung của app.
// main.ts gọi không tham số; src/test/Render.ts gọi với overrides (transport mock, notifier giả…).
import ui from '@nuxt/ui/vue-plugin'
import { env } from '@app/config/Env.config'
// (các import createPinia, createAppI18n, createAppRouter, createNotifier, createAppQueryClient,
//  createSession, createHttpClient, installErrorHandling… lược bớt)

/** Những thứ test được phép thay. Prod không truyền gì. */
export interface RuntimeOverrides {
  transport?: unknown // adapter axios-mock-adapter; `unknown` có chủ đích (D34)
  notifier?: Notifier // notifier giả để assert toast
  router?: Router // router memory history
  session?: SessionSnapshot // trạng thái đăng nhập sẵn
  retry?: false // tắt retry query trong test
}

/** Dựng toàn bộ runtime. Trả `plugin` để app.use() và các object để test assert. */
export function createAppRuntime(overrides: RuntimeOverrides = {}) {
  const pinia = createPinia()
  const i18n = createAppI18n()
  const router = overrides.router ?? createAppRouter()
  const notifier = overrides.notifier ?? createNotifier()
  const queryClient = createAppQueryClient({
    onMutationError: notifier.error,
    retry: overrides.retry,
  })
  // Session tạo trước nhưng chỉ gọi `http` khi refresh thật sự xảy ra (lazy) → không vòng phụ thuộc.
  let http!: HttpClient
  const session = createSession({
    pinia,
    queryClient,
    callRefresh: (rt) => http.post('/auth/refresh', { refreshToken: rt }, { skipAuth: true }),
    initial: overrides.session,
  })
  http = createHttpClient({
    baseURL: env.VITE_API_BASE_URL,
    session,
    getLocale: i18n.getLocale,
    transport: overrides.transport,
  })

  session.on('authFailure', () => router.push({ name: 'auth.login' }))
  session.on('loggedOut', () => router.push({ name: 'auth.login' }))

  const plugin = {
    install(app: App) {
      app.use(pinia).use(i18n).use(router).use(VueQueryPlugin, { queryClient }).use(ui)
      app.provide(HTTP_CLIENT_KEY, http)
      app.provide(SESSION_KEY, session)
      installErrorHandling(app, { router, notifier })
    },
  }
  return { plugin, router, session, http, queryClient, notifier }
}
```

```ts
// main.ts — chỉ còn thế này
createApp(App).use(createAppRuntime().plugin).mount('#app')
```

- `transport` là override nội bộ dành cho test (không lộ kiểu axios ra feature).
- Một cách duy nhất: `*.api.ts` lấy client bằng `useHttpClient()` trong composable; không nhận client làm tham số, không import singleton.
- `Runtime.spec.ts`: dựng runtime với transport mock → request có token + `X-Store-Id` + `Accept-Language`; `authFailure` điều hướng về `auth.login`. Đây là test cho wiring prod.

### M.3. StoreScope: feature không cần biết `storeId`

- `HttpClient` gắn header `X-Store-Id` từ `session.getStoreId()` vào mọi request (bỏ qua nếu null).
- `switchStore(id)` (Session) tự persist và gọi `queryClient.clear()` → cache Store cũ bị xoá, query đang mở tự fetch lại.
- Hệ quả: query key **không** chứa `storeId` (`['products', 'list', params]`); file `*.api.ts` không gọi `useStoreScope()`.
- **Chờ BE xác nhận** nhận header `X-Store-Id`. _Phương án dự phòng (chưa đưa vào interface, D40):_ nếu BE bắt buộc `storeId` trong path (`/stores/{storeId}/products`), thêm vào `HttpClientDeps` một `getDefaultPathParams()` do runtime cấp từ `session.getStoreId()` — chỉ làm khi BE chốt.
- `StoreSwitcher.vue` đặt ở `layouts/components/`, chỉ dùng `useStoreScope()`; composable không trả về component.

```ts
// features/StoreScope/UseStoreScope.ts
export function useStoreScope(): {
  storeId: Readonly<Ref<string | null>>
  stores: Readonly<Ref<StoreSummary[]>>
  switchStore: (id: string) => Promise<void> // ủy quyền cho session.switchStore
}
```

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần tiếp](http-session.md)
