# M. HTTP client, seam với auth và StoreScope

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

`shared/lib/` không được import `features/`. HttpClient nhận auth/Store qua một collaborator `Session` (`shared/lib/session/`) và locale qua `getLocale`; mọi thứ được nối trong `createAppRuntime()` (`app/Runtime.ts`, D37).

### M.1. Interface: hẹp, có kiểu theo Swagger, không lộ axios

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
  get<P extends PathsWith<'get'>>(url: P, opts?: RequestOpts<P, 'get'>): Promise<ResponseOf<P, 'get'>>
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
  delete<P extends PathsWith<'delete'>>(url: P, opts?: RequestOpts<P, 'delete'>): Promise<ResponseOf<P, 'delete'>>
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

### M.2. Session và composition root

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

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần trước](http-session-02.md)
