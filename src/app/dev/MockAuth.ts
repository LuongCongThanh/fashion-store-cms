// Mock auth: CHỈ chạy ở DEV khi `VITE_MOCK_AUTH=true` (xem GLOSSARY). Runtime import động file này
// sau điều kiện `import.meta.env.DEV` nên bản build production không chứa nó.
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import type { RouteRecordRaw } from 'vue-router'

import { routes } from '@app/router/Routes'
import { MOCK_ACCOUNT } from '@features/auth/types/MockAccount'

import type { CurrentUser } from '@features/auth/types/Auth.types'

function collectPermissions(list: readonly RouteRecordRaw[]): string[] {
  return list.flatMap((r) => [
    ...(r.meta?.permission ? [r.meta.permission] : []),
    ...collectPermissions(r.children ?? []),
  ])
}

const tokens = () => ({
  accessToken: `mock-at-${Date.now()}`,
  refreshToken: `mock-rt-${Date.now()}`,
})

/** Adapter axios giả lập /auth/*; request khác đi thẳng tới backend thật. */
export function createMockAuthTransport({ delayMs = 300 } = {}): unknown {
  const mock = new MockAdapter(axios.create(), { delayResponse: delayMs, onNoMatch: 'passthrough' })
  const user: CurrentUser = {
    id: 'mock-admin',
    name: 'Mock Admin',
    email: MOCK_ACCOUNT.email,
    permissions: [...new Set(collectPermissions(routes))],
  }

  mock.onPost(/\/auth\/login$/).reply((config) => {
    const body = JSON.parse(String(config.data)) as { email: string; password: string }
    return body.email === MOCK_ACCOUNT.email && body.password === MOCK_ACCOUNT.password
      ? [200, tokens()]
      : [401, { code: 'UNAUTHORIZED', message: 'Invalid credentials' }]
  })
  mock.onGet(/\/auth\/me$/).reply(200, user)
  mock.onPost(/\/auth\/refresh$/).reply(() => [200, tokens()])
  mock.onPost(/\/auth\/forgot-password$/).reply(204)
  return mock.adapter()
}
