// MODULE DUY NHẤT của client/: transport axios, gom refresh 401, chuẩn hoá lỗi đều nằm bên trong (§O.3).
// Bên ngoài chỉ thấy createHttpClient / useHttpClient / HTTP_CLIENT_KEY.
import axios from 'axios'
import { inject } from 'vue'

import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios'
import type { InjectionKey } from 'vue'

import { ApiError } from '@shared/lib/api/errors/ApiError'
import { codeFromStatus, ErrorCode } from '@shared/lib/api/errors/ErrorCode'

import type { Session } from '@shared/lib/session/Session'
import type { paths } from '@shared/types/Api.generated'

type Method = 'delete' | 'get' | 'patch' | 'post' | 'put'
type HasPaths = [keyof paths] extends [never] ? false : true
type PathsWith<M extends Method> = HasPaths extends true
  ? { [P in keyof paths]: paths[P] extends Record<M, object> ? P : never }[keyof paths]
  : string
type Op<P, M extends Method> = P extends keyof paths
  ? paths[P] extends Record<M, infer O>
    ? O
    : never
  : never
type JsonOf<T> = T extends { content: { 'application/json': infer R } } ? R : unknown
type ResponseOf<P, M extends Method> = HasPaths extends true
  ? Op<P, M> extends { responses: infer R }
    ? JsonOf<R[200 & keyof R]> | JsonOf<R[201 & keyof R]>
    : unknown
  : unknown
type BodyOf<P, M extends Method> = HasPaths extends true
  ? Op<P, M> extends { requestBody?: infer B }
    ? JsonOf<NonNullable<B>>
    : never
  : unknown
type QueryOf<P, M extends Method> = HasPaths extends true
  ? Op<P, M> extends { parameters: { query?: infer Q } }
    ? Q
    : never
  : Record<string, unknown>
type PathParamsOf<P, M extends Method> = HasPaths extends true
  ? Op<P, M> extends { parameters: { path?: infer A } }
    ? A
    : never
  : Record<string, number | string>

/** Những gì HttpClient cần từ bên ngoài — do createAppRuntime() truyền vào (§M.2). */
export interface HttpClientDeps {
  /** Gốc URL API, lấy từ env.VITE_API_BASE_URL. */
  baseURL: string
  /** Nguồn token + storeId; HttpClient gọi session.refresh() khi gặp 401. */
  session: Session
  /** Trả locale hiện tại để gắn header Accept-Language. */
  getLocale: () => string
  /** CHỈ dành cho test và Mock auth ở DEV: adapter của axios-mock-adapter. `unknown` có chủ đích → không lộ kiểu axios. */
  transport?: unknown
}

/** Tuỳ chọn cho từng request. */
export interface RequestOpts<P, M extends Method> {
  path?: PathParamsOf<P, M>
  query?: QueryOf<P, M>
  signal?: AbortSignal
  /** true = không gắn token, không vào hàng đợi refresh. Dùng cho request refresh của Session và cho login (401 = sai thông tin, không phải hết phiên). */
  skipAuth?: boolean
}

/** Mọi method trả thẳng `data`; lỗi LUÔN là ApiError (§O.1). */
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

interface Config extends InternalAxiosRequestConfig {
  skipAuth?: boolean
  /** Đã gửi lại sau refresh một lần — không refresh lần nữa. */
  retried?: boolean
}

export function createHttpClient(deps: HttpClientDeps): HttpClient {
  const { session } = deps
  const instance = axios.create({
    baseURL: deps.baseURL,
    timeout: 15_000,
    adapter: deps.transport as AxiosAdapter | undefined,
  })

  instance.interceptors.request.use((config: Config) => attachHeaders(config))
  instance.interceptors.response.use(undefined, retryAfterRefresh)
  // Đăng ký cuối cùng → chạy sau retryAfterRefresh.
  instance.interceptors.response.use(undefined, toApiError)

  /** 401 → chờ MỘT session.refresh() đang chạy, gửi lại request; refresh trả null → ném lỗi. */
  async function retryAfterRefresh(error: unknown) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error
    const config = error.config as Config | undefined
    if (!config || config.skipAuth || config.retried) throw error
    const token = await session.refresh()
    if (!token) throw error
    return instance.request({ ...config, retried: true } as Config)
  }

  function attachHeaders(config: Config) {
    const token = session.getAccessToken()
    if (token && !config.skipAuth) config.headers.set('Authorization', `Bearer ${token}`)
    const storeId = session.getStoreId()
    if (storeId) config.headers.set('X-Store-Id', storeId)
    config.headers.set('Accept-Language', deps.getLocale())
    return config
  }

  async function request(
    method: Method,
    url: string,
    body: unknown,
    opts: RequestOpts<string, Method> = {},
  ) {
    const res = await instance.request({
      method,
      url: fillPath(url, opts.path as Record<string, number | string> | undefined),
      data: body,
      params: opts.query,
      signal: opts.signal,
      skipAuth: opts.skipAuth,
    } as Config)
    return res.data
  }

  return {
    get: (url, opts) => request('get', url, undefined, opts),
    delete: (url, opts) => request('delete', url, undefined, opts),
    post: (url, body, opts) => request('post', url, body, opts),
    put: (url, body, opts) => request('put', url, body, opts),
    patch: (url, body, opts) => request('patch', url, body, opts),
  } as HttpClient
}

interface ErrorBody {
  code: string
  message?: string
  details?: { fields?: Record<string, string[]> }
}

function isErrorBody(data: unknown): data is ErrorBody {
  return typeof data === 'object' && data !== null && typeof (data as ErrorBody).code === 'string'
}

/** Mọi lỗi → ApiError (bảng §O.3). */
function toApiError(error: unknown): never {
  // Request bị huỷ: ném lại nguyên lỗi — không phải lỗi, không toast.
  if (error instanceof ApiError || axios.isCancel(error)) throw error
  if (!axios.isAxiosError(error)) throw new ApiError(0, ErrorCode.UNKNOWN, String(error))
  const res = error.response
  if (res) {
    const body = isErrorBody(res.data) ? res.data : undefined
    const requestId = res.headers?.['x-request-id'] as string | undefined
    throw new ApiError(
      res.status,
      body?.code ?? codeFromStatus(res.status),
      body?.message ?? error.message,
      body?.details?.fields,
      requestId,
    )
  }
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    throw new ApiError(0, ErrorCode.TIMEOUT, error.message)
  }
  throw new ApiError(0, ErrorCode.NETWORK_ERROR, error.message)
}

function fillPath(url: string, params?: Record<string, number | string>) {
  if (!params) return url
  return url.replace(/\{(\w+)\}/g, (_, key: string) => encodeURIComponent(String(params[key])))
}

export const HTTP_CLIENT_KEY: InjectionKey<HttpClient> = Symbol('HttpClient')

/** Dùng trong composable của *.api.ts (gọi trong setup). */
export function useHttpClient(): HttpClient {
  const http = inject(HTTP_CLIENT_KEY)
  if (!http) throw new Error('useHttpClient() cần createAppRuntime().plugin đã được cài.')
  return http
}
