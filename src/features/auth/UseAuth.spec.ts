import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { buildUser } from '@test/factories/User.factory'
import { renderWithPlugins } from '@test/Render'

import type { SessionSnapshot } from '@shared/lib/session/Session'

import { useAuth } from './UseAuth'

const USER = buildUser({ name: 'Lan', role: 'STAFF', permissions: ['category:read'] })

/** Render một component dùng useAuth() và trả ra instance để gọi hành động. */
function renderAuth(session: SessionSnapshot = {}) {
  let auth!: ReturnType<typeof useAuth>
  const Host = defineComponent({
    setup() {
      auth = useAuth()
      return () => h('span', auth.user.value?.name ?? 'guest')
    },
  })
  const result = renderWithPlugins(Host, { session })
  return { ...result, auth: () => auth }
}

describe('useAuth', () => {
  it('logs in and stores the staff user returned by BE', async () => {
    const { http, wrapper, auth } = renderAuth()
    http.onPost(/\/auth\/login$/).reply(200, {
      accessToken: 'at-1',
      user: { id: USER.id, email: USER.email, fullName: USER.name, role: 'STAFF', emailVerified: true },
    })

    await auth().login({ email: 'lan@shop.vn', password: 'secret' })
    await flushPromises()

    expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
      email: 'lan@shop.vn',
      password: 'secret',
    })
    expect(auth().isAuthenticated.value).toBe(true)
    expect(wrapper.text()).toBe('Lan')
    expect(auth().can('category:read')).toBe(true)
    expect(auth().can('category:write')).toBe(false)
  })

  it('logs out: clears the user and goes back to login', async () => {
    const { http, wrapper, auth, runtime } = renderAuth({ accessToken: 'at' })
    http.onGet(/\/auth\/me$/).reply(200, {
      id: USER.id,
      email: USER.email,
      fullName: USER.name,
      role: USER.role,
      emailVerified: true,
    })
    await auth().ensureUser()
    await flushPromises()
    expect(wrapper.text()).toBe('Lan')

    http.onPost(/\/auth\/logout$/).reply(200, { message: 'ok' })
    await auth().logout()
    await flushPromises()

    expect(auth().isAuthenticated.value).toBe(false)
    expect(wrapper.text()).toBe('guest')
    expect(runtime.router.currentRoute.value.name).toBe('auth.login')
  })

  it('reloads the current user from a restored session only once', async () => {
    const { http, auth } = renderAuth({ accessToken: 'at' })
    http.onGet(/\/auth\/me$/).reply(200, {
      id: USER.id,
      email: USER.email,
      fullName: USER.name,
      role: USER.role,
      emailVerified: true,
    })

    await Promise.all([auth().ensureUser(), auth().ensureUser()])
    await auth().ensureUser()

    expect(http.history.get).toHaveLength(1)
    expect(auth().can('category:read')).toBe(true)
  })

  it('does not call /auth/me without a session', async () => {
    const { http, auth } = renderAuth()

    await auth().ensureUser()

    expect(http.history.get).toHaveLength(0)
  })
})
