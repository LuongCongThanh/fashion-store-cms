# 05 — Session, HttpClient, Runtime

Status: ready-for-agent
Blocked by: 04
Nguồn: Step 3a (phần 2) trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41, trong đó D24, D32 đã huỷ), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 3a (phần 2) — Session, HttpClient, Runtime

**Làm gì**

- Tạo `shared/lib/api/`.
- `shared/lib/session/Session.ts` theo §M.2 (tạo **trước** HttpClient vì HttpClient phụ thuộc Session) + `Session.spec.ts`: N lời gọi `refresh()` đồng thời → 1 lần `callRefresh`; refresh thất bại → xoá token + phát `authFailure`; `logout()`/`switchStore()` gọi `queryClient.clear()`.
- `HttpClient.ts` (một file) theo §M.1 (interface hẹp, có kiểu theo `paths`, deps không có kiểu axios) + `HttpClient.spec.ts`: N request 401 → 1 lần `session.refresh()`; request `skipAuth` không có `Authorization`; refresh thất bại → Session phát `authFailure`; mọi request có `X-Store-Id`, `Accept-Language`; lỗi luôn là `ApiError`.
- `app/Runtime.ts` theo §M.2 (`createAppRuntime()`) + `Runtime.spec.ts`; `main.ts` chỉ một dòng `createApp(App).use(createAppRuntime().plugin).mount('#app')`. Chưa có `features/auth` nên Session bắt đầu ở trạng thái chưa đăng nhập.

**Kiểm tra:** `npm test` pass; `shared/lib/` không import `features/` (ESLint); `client/` chỉ có `HttpClient.ts` + spec, refresh dùng `skipAuth` (§V.5); `Session.spec.ts` pass; `Runtime.spec.ts` pass: request có token + `X-Store-Id` + `Accept-Language`, `authFailure` điều hướng về `auth.login` (§V.1); `queryClient.clear()` chỉ xuất hiện trong `Session.ts`.

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

### M. HTTP client, seam với auth và StoreScope

`shared/lib/` không được import `features/`. HttpClient nhận auth/Store qua một collaborator `Session` (`shared/lib/session/`) và locale qua `getLocale`; mọi thứ được nối trong `createAppRuntime()` (`app/Runtime.ts`, D37).

#### M.1. Interface: hẹp, có kiểu theo Swagger, không lộ axios

```ts
// src/shared/lib/api/client/HttpClient.ts
import type { paths } from '@shared/types/Api.generated'

// File này là MODULE DUY NHẤT của client/: transport axios, gom refresh 401, chuẩn hoá lỗi đều nằm
// bên trong (§O.3). Bên ngoài chỉ thấy createHttpClient / useHttpClient / HTTP_CLIENT_KEY.

/** Những gì HttpClient cần từ bên ngoài — do createAppRuntime() truyền vào (§M.2). */
export interface HttpClientDeps {
  /** Gốc URL API, lấy từ env.VITE_API_BASE_URL. */
  baseURL: string
  /** Nguồn token + storeId; HttpClient gọi session.refresh() khi gặp 401 (§M.2). */
  session: Session
  /** Trả locale hiện tại để gắn header Accept-Language (§O.3). */
  getLocale: () => string
  /**
   * CHỈ dành cho test: thay transport thật bằng adapter của axios-mock-adapter.
   * Kiểu là `unknown` có chủ đích → feature không thể dựa vào kiểu axios.
   */
  transport?: unknown
}

/** Tuỳ chọn cho từng request. */
export interface RequestOpts<P, M> {
  path?: PathParamsOf<P, M> // thay {id} trong URL
  query?: QueryOf<P, M> // ?page=1&size=20
  signal?: AbortSignal // huỷ request → không bị coi là lỗi (§O.3)
  /** true = không gắn token, không vào hàng đợi refresh. Chỉ Session dùng cho chính request refresh. */
  skipAuth?: boolean
}

/** Mọi method trả thẳng `data`; lỗi LUÔN là ApiError (§O.1). URL, params, body, kết quả có kiểu theo `paths`. */
export interface HttpClient {
  get<P extends PathsWith<'get'>>(
    url: P,
    opts?: RequestOpts<P, 'get'>,
  ): Promise<ResponseOf<P, 'get'>>
  post<P extends PathsWith<'post'>>(
    url: P,
    body: BodyOf<P, 'post'>,
    opts?: RequestOpts<P, 'post'>,
  ): Promise<ResponseOf<P, 'post'>>
  put<P extends PathsWith<'put'>>(
    url: P,
    body: BodyOf<P, 'put'>,
    opts?: RequestOpts<P, 'put'>,
  ): Promise<ResponseOf<P, 'put'>>
  patch<P extends PathsWith<'patch'>>(
    url: P,
    body: BodyOf<P, 'patch'>,
    opts?: RequestOpts<P, 'patch'>,
  ): Promise<ResponseOf<P, 'patch'>>
  delete<P extends PathsWith<'delete'>>(
    url: P,
    opts?: RequestOpts<P, 'delete'>,
  ): Promise<ResponseOf<P, 'delete'>>
}

export function createHttpClient(deps: HttpClientDeps): HttpClient
export const HTTP_CLIENT_KEY: InjectionKey<HttpClient>
/** Dùng trong composable của *.api.ts (gọi trong setup). */
export function useHttpClient(): HttpClient
```

- Không trả `AxiosInstance`: caller không đổi được `validateStatus`, không gắn interceptor riêng, không đi vòng qua chuẩn hoá lỗi. Đổi thư viện HTTP chỉ sửa file này.
- `HTTP_CLIENT_KEY` và `useHttpClient()` nằm chung `HttpClient.ts` (một module, một file interface).
- `HttpClientDeps` không có kiểu axios. Test thay transport bằng `deps.transport` (qua `createAppRuntime({ transport })`), không có hàm nội bộ riêng cho test.
- **Một file** (`HttpClient.ts`, ~150 dòng): không tách `AxiosTransport` / `RefreshQueue` / `NormalizeError`, không cần rule ESLint `noClientInternals` (D40). Chỉ tách khi file > ~300 dòng **và** phần tách ra có spec riêng có ích.
- `skipAuth` là cách duy nhất để gọi API không kèm token; refresh vì thế vẫn có `Accept-Language` và lỗi vẫn là `ApiError`.
- Trước khi có Swagger thật, `paths` là placeholder → các helper kiểu rơi về `unknown`; khi `gen:api` chạy thì tự có kiểu.
- Upload file lên S3 (presigned PUT) **không** đi qua HttpClient (khác origin, không gắn token) — `MediaUpload.ts` dùng `fetch` riêng.

#### M.2. Session và composition root

**Session** = ai đang đăng nhập (token) và đang quản lý Store nào, cùng điều xảy ra khi chúng đổi. Một module sâu ở `shared/lib/session/Session.ts`, không phụ thuộc Vue context (interceptor gọi nó ngoài `setup`):

```ts
// src/shared/lib/session/Session.ts
// Session = "ai đang đăng nhập, đang quản lý Store nào, và chuyện gì xảy ra khi chúng đổi".
// Không phụ thuộc Vue context → HttpClient gọi được từ interceptor (ngoài setup).

export interface Session {
  /** Token hiện tại để HttpClient gắn header Authorization; null = chưa đăng nhập. */
  getAccessToken(): string | null
  /** Store đang quản lý để HttpClient gắn header X-Store-Id; null = chưa chọn. */
  getStoreId(): string | null
  /**
   * Lấy access token mới bằng refresh token. Nhiều lời gọi đồng thời dùng chung MỘT promise.
   * Thất bại → xoá token, phát 'authFailure', trả null.
   */
  refresh(): Promise<string | null>
  /** Lưu token sau khi login thành công (useAuth().login() gọi). */
  signIn(tokens: AuthTokens): void
  /** Xoá token + queryClient.clear() + phát 'loggedOut'. */
  logout(): Promise<void>
  /** Đổi Store: persist storeId + queryClient.clear() để query đang mở fetch lại theo Store mới. */
  switchStore(id: string): Promise<void>
  /** Đăng ký nghe sự kiện; trả hàm huỷ đăng ký. Runtime dùng để điều hướng về login. */
  on(event: 'authFailure' | 'loggedOut', fn: () => void): () => void
}

/** Trạng thái Session có thể khởi tạo sẵn (test) — dùng chung cho createSession, RuntimeOverrides, Render.ts. */
export interface SessionSnapshot {
  accessToken?: string
  refreshToken?: string
  storeId?: string
}

export function createSession(deps: {
  /** Pinia của app — state (token, storeId) nằm trong useSessionStore, có persist. */
  pinia: Pinia
  /** Để xoá cache khi logout / đổi Store. */
  queryClient: QueryClient
  /**
   * Hàm gọi endpoint refresh. Truyền dạng lazy vì HttpClient được tạo SAU Session:
   * runtime truyền `(rt) => http.post('/auth/refresh', { refreshToken: rt }, { skipAuth: true })`.
   */
  callRefresh: (refreshToken: string) => Promise<AuthTokens>
  /** Trạng thái ban đầu — chỉ test dùng (VD đã đăng nhập sẵn). */
  initial?: SessionSnapshot
}): Session

/** Composable: lấy Session đã provide bởi runtime. Chỉ feature auth / StoreScope nên gọi. */
export function useSession(): Session
export const SESSION_KEY: InjectionKey<Session>
```

- State nằm trong `useSessionStore` (Pinia, nội bộ `session/`), chỉ gồm token + storeId. Thông tin user (`features/auth`) và danh sách Store (`features/StoreScope`) vẫn ở feature của mình.
- `features/auth` và `features/StoreScope` **bọc** Session: `useAuth().login()` gọi API rồi `session.signIn()`; `useAuth().logout()` = `session.logout()`; `useStoreScope().switchStore` = `session.switchStore`. Không còn `createAuthAdapter` / `createStoreScopeAdapter`.
- Xoá cache khi logout / đổi Store chỉ xảy ra **trong Session** — một chỗ duy nhất.
- Composable lấy Session qua `useSession()` (inject); Vue component không gọi `useSessionStore` trực tiếp.

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

#### M.3. StoreScope: feature không cần biết `storeId`

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
