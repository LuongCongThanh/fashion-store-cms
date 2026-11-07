import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, expect, it } from 'vitest'
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
})
