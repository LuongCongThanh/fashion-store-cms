import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { createAppRuntime } from './Runtime'

const Blank = { render: () => null }

function memoryRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Blank },
      { path: '/login', name: 'auth.login', component: Blank },
    ],
  })
}

describe('createAppRuntime', () => {
  it('wires Session and locale into every HTTP request', async () => {
    const mock = new MockAdapter(axios.create())
    const runtime = createAppRuntime({
      transport: mock.adapter(),
      router: memoryRouter(),
      session: { accessToken: 'token-1', storeId: 'store-1' },
    })
    mock.onGet(/\/ping$/).reply(200, 'pong')

    await runtime.http.get('/ping')

    const headers = mock.history.get[0]?.headers ?? {}
    expect(headers.Authorization).toBe('Bearer token-1')
    expect(headers['X-Store-Id']).toBe('store-1')
    expect(headers['Accept-Language']).toBeTruthy()
  })

  it('navigates to auth.login when the session cannot be refreshed', async () => {
    const mock = new MockAdapter(axios.create())
    const router = memoryRouter()
    await router.push('/')
    const runtime = createAppRuntime({
      transport: mock.adapter(),
      router,
      session: { accessToken: 'expired' },
    })
    mock.onGet(/\/me$/).reply(401, {})

    await runtime.http.get('/me').catch(() => undefined)
    await router.isReady()
    await new Promise((r) => setTimeout(r))

    expect(router.currentRoute.value.name).toBe('auth.login')
  })

  it('navigates to auth.login after logout', async () => {
    const router = memoryRouter()
    await router.push('/')
    const runtime = createAppRuntime({ router, session: { accessToken: 't' } })

    await runtime.session.logout()
    await new Promise((r) => setTimeout(r))

    expect(router.currentRoute.value.name).toBe('auth.login')
  })

  it('toasts mutation errors globally unless the mutation handles them locally', async () => {
    const mock = new MockAdapter(axios.create())
    const notifier = { success: vi.fn(), error: vi.fn() }
    const runtime = createAppRuntime({
      transport: mock.adapter(),
      router: memoryRouter(),
      notifier,
      retry: false,
    })
    mock.onPost(/\/orders$/).reply(500, {})
    const cache = runtime.queryClient.getMutationCache()
    const run = (meta?: { errorHandling: 'local' }) =>
      cache
        .build(runtime.queryClient, { mutationFn: () => runtime.http.post('/orders', {}), meta })
        .execute(undefined)
        .catch(() => undefined)

    await run()
    expect(notifier.error).toHaveBeenCalledTimes(1)
    expect(notifier.error.mock.calls[0]?.[0]).toMatchObject({ status: 500, code: 'SERVER_ERROR' })

    await run({ errorHandling: 'local' })
    expect(notifier.error).toHaveBeenCalledTimes(1)
  })

  it('does not toast query errors (they are shown in place)', async () => {
    const mock = new MockAdapter(axios.create())
    const notifier = { success: vi.fn(), error: vi.fn() }
    const runtime = createAppRuntime({
      transport: mock.adapter(),
      router: memoryRouter(),
      notifier,
      retry: false,
    })
    mock.onGet(/\/products$/).reply(500, {})

    await runtime.queryClient
      .fetchQuery({ queryKey: ['products'], queryFn: () => runtime.http.get('/products') })
      .catch(() => undefined)

    expect(notifier.error).not.toHaveBeenCalled()
  })
})
