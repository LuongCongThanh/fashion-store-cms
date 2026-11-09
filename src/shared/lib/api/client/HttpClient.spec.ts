import { QueryClient } from '@tanstack/vue-query'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@shared/lib/api/errors/ApiError'
import { createSession } from '@shared/lib/session/Session'

import type { AuthTokens, SessionSnapshot } from '@shared/lib/session/Session'

import { createHttpClient } from './HttpClient'

const BASE = 'http://api.test'

/** Chỉ test qua interface: createHttpClient({ transport: mock.adapter() }) (§O.3). */
function setup(opts: { callRefresh?: (rt: string) => Promise<AuthTokens>; initial?: SessionSnapshot } = {}) {
  const mock = new MockAdapter(axios.create())
  const session = createSession({
    pinia: createPinia(),
    queryClient: new QueryClient(),
    callRefresh: vi.fn(opts.callRefresh ?? (async () => ({ accessToken: 'fresh', refreshToken: 'rt-2' }))),
    initial: opts.initial ?? { accessToken: 'token-1', refreshToken: 'rt-1', storeId: 'store-1' },
  })
  const http = createHttpClient({
    baseURL: BASE,
    session,
    getLocale: () => 'vi',
    transport: mock.adapter(),
  })
  return { mock, session, http }
}

describe('HttpClient', () => {
  it('returns response data and sends auth, store and language headers', async () => {
    const { mock, http } = setup()
    mock.onGet(`${BASE}/products`).reply(200, [{ id: 1 }])

    const data = await http.get('/products')

    expect(data).toEqual([{ id: 1 }])
    const headers = mock.history.get[0]?.headers ?? {}
    expect(headers.Authorization).toBe('Bearer token-1')
    expect(headers['X-Store-Id']).toBe('store-1')
    expect(headers['Accept-Language']).toBe('vi')
  })

  it('omits Authorization for skipAuth requests but keeps the other headers', async () => {
    const { mock, http } = setup()
    mock.onPost(`${BASE}/auth/refresh`).reply(200, {})

    await http.post('/auth/refresh', { refreshToken: 'rt' }, { skipAuth: true })

    const headers = mock.history.post[0]?.headers ?? {}
    expect(headers.Authorization).toBeUndefined()
    expect(headers['Accept-Language']).toBe('vi')
  })

  it('omits X-Store-Id when no store is selected', async () => {
    const { mock, http } = setup({ initial: { accessToken: 't' } })
    mock.onGet(`${BASE}/me`).reply(200, {})

    await http.get('/me')

    expect(mock.history.get[0]?.headers?.['X-Store-Id']).toBeUndefined()
  })

  it('refreshes once for concurrent 401s and retries each request with the new token', async () => {
    const callRefresh = vi.fn(async () => ({ accessToken: 'fresh', refreshToken: 'rt-2' }))
    const { mock, http } = setup({ callRefresh })
    mock
      .onGet(new RegExp(`${BASE}/items/\\d`))
      .reply((config) => (config.headers?.Authorization === 'Bearer fresh' ? [200, { ok: config.url }] : [401, {}]))

    const results = await Promise.all([http.get('/items/1'), http.get('/items/2'), http.get('/items/3')])

    expect(callRefresh).toHaveBeenCalledTimes(1)
    expect(results).toEqual([{ ok: '/items/1' }, { ok: '/items/2' }, { ok: '/items/3' }])
  })

  it('rejects with UNAUTHORIZED and lets Session emit authFailure when refresh fails', async () => {
    const { mock, http, session } = setup({
      callRefresh: async () => Promise.reject(new Error('expired')),
    })
    const onFailure = vi.fn()
    session.on('authFailure', onFailure)
    mock.onGet(`${BASE}/me`).reply(401, {})

    const error = await http.get('/me').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 401, code: 'UNAUTHORIZED' })
    expect(onFailure).toHaveBeenCalledTimes(1)
  })

  it('maps a standard error body to ApiError with BE code, fields and request id', async () => {
    const { mock, http } = setup()
    mock.onPost(`${BASE}/products`).reply(
      422,
      {
        code: 'PRODUCT_SLUG_TAKEN',
        message: 'slug taken',
        details: { fields: { slug: ['taken'] } },
      },
      { 'x-request-id': 'req-42' },
    )

    const error = await http.post('/products', { slug: 'a' }).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 422,
      code: 'PRODUCT_SLUG_TAKEN',
      message: 'slug taken',
      fields: { slug: ['taken'] },
      requestId: 'req-42',
    })
  })

  it.each([
    [400, 'VALIDATION_FAILED'],
    [403, 'FORBIDDEN'],
    [404, 'NOT_FOUND'],
    [409, 'CONFLICT'],
    [429, 'RATE_LIMITED'],
    [503, 'SERVER_ERROR'],
  ])('falls back to a client code when a %i body is not standard', async (status, code) => {
    const { mock, http } = setup()
    mock.onGet(`${BASE}/x`).reply(status, '<html>oops</html>')

    await expect(http.get('/x')).rejects.toMatchObject({ status, code })
  })

  it('maps a network failure to ApiError NETWORK_ERROR with status 0', async () => {
    const { mock, http } = setup()
    mock.onGet(`${BASE}/x`).networkError()

    await expect(http.get('/x')).rejects.toMatchObject({ status: 0, code: 'NETWORK_ERROR' })
  })

  it('maps a timeout to ApiError TIMEOUT', async () => {
    const { mock, http } = setup()
    mock.onGet(`${BASE}/x`).timeout()

    const error = await http.get('/x').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 0, code: 'TIMEOUT' })
  })

  it('rethrows an aborted request as-is instead of an ApiError', async () => {
    const { mock, http } = setup()
    mock.onGet(`${BASE}/x`).reply(200, {})
    const controller = new AbortController()
    controller.abort()

    const error = await http.get('/x', { signal: controller.signal }).catch((e: unknown) => e)

    expect(error).not.toBeInstanceOf(ApiError)
    expect(axios.isCancel(error)).toBe(true)
  })
})
