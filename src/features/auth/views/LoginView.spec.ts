import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { buildUser } from '@test/factories/User.factory'
import { renderWithPlugins } from '@test/Render'

import LoginView from './LoginView.vue'

async function renderLogin(query = '') {
  const Blank = { render: () => null }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', name: 'auth.login', component: Blank },
      { path: '/forgot-password', name: 'auth.forgot-password', component: Blank },
      { path: '/:rest(.*)*', name: 'home', component: Blank },
    ],
  })
  await router.push(`/login${query}`)
  const result = renderWithPlugins(LoginView, { router, session: {} })
  return { ...result, router }
}

async function fill(wrapper: Awaited<ReturnType<typeof renderLogin>>['wrapper'], email: string, password: string) {
  await wrapper.find('input[name="email"]').setValue(email)
  await wrapper.find('input[name="password"]').setValue(password)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
}

describe('LoginView', () => {
  it('shows validation errors and sends nothing when fields are invalid', async () => {
    const { wrapper, http } = await renderLogin()

    await fill(wrapper, 'not-an-email', '')

    expect(wrapper.text()).toContain('Email không hợp lệ')
    expect(wrapper.text()).toContain('Không được để trống')
    expect(http.history.post).toHaveLength(0)
  })

  it('signs in and goes to the safe redirect target', async () => {
    const { wrapper, http, router } = await renderLogin('?redirect=/design-system')
    http.onPost(/\/auth\/login$/).reply(200, { accessToken: 'at-1', refreshToken: 'rt-1' })
    http.onGet(/\/auth\/me$/).reply(200, buildUser())

    await fill(wrapper, 'lan@shop.vn', 'secret')

    expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
      email: 'lan@shop.vn',
      password: 'secret',
    })
    expect(router.currentRoute.value.fullPath).toBe('/design-system')
    expect(localStorage.getItem('cms.session.accessToken')).toBe('at-1')
  })

  it('ignores an external redirect and goes to /', async () => {
    const { wrapper, http, router } = await renderLogin('?redirect=//evil.com')
    http.onPost(/\/auth\/login$/).reply(200, { accessToken: 'at-1', refreshToken: 'rt-1' })
    http.onGet(/\/auth\/me$/).reply(200, buildUser())

    await fill(wrapper, 'lan@shop.vn', 'secret')

    expect(router.currentRoute.value.fullPath).toBe('/')
  })

  it('keeps the session only in this tab when Remember me is unchecked', async () => {
    const { wrapper, http } = await renderLogin()
    http.onPost(/\/auth\/login$/).reply(200, { accessToken: 'at-1', refreshToken: 'rt-1' })
    http.onGet(/\/auth\/me$/).reply(200, buildUser())

    await wrapper.find('[role="checkbox"]').trigger('click')
    await fill(wrapper, 'lan@shop.vn', 'secret')

    expect(sessionStorage.getItem('cms.session.accessToken')).toBe('at-1')
    expect(localStorage.getItem('cms.session.accessToken')).toBeNull()
  })

  it('shows one generic message on wrong credentials', async () => {
    const { wrapper, http, router, notifier } = await renderLogin()
    http.onPost(/\/auth\/login$/).reply(401, { code: 'UNAUTHORIZED', message: 'bad' })

    await fill(wrapper, 'lan@shop.vn', 'wrong')

    expect(wrapper.text()).toContain('Email hoặc mật khẩu không đúng')
    expect(router.currentRoute.value.name).toBe('auth.login')
    expect(notifier.error).not.toHaveBeenCalled()
  })

  it('hands other errors to the notifier', async () => {
    const { wrapper, http, notifier } = await renderLogin()
    http.onPost(/\/auth\/login$/).reply(500, {})

    await fill(wrapper, 'lan@shop.vn', 'secret')

    expect(notifier.error).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).not.toContain('Email hoặc mật khẩu không đúng')
  })

  it('disables the submit button while signing in', async () => {
    const { wrapper, http } = await renderLogin()
    http.onPost(/\/auth\/login$/).reply(() => new Promise(() => {}))

    await fill(wrapper, 'lan@shop.vn', 'secret')

    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('toggles password visibility', async () => {
    const { wrapper } = await renderLogin()
    const input = () => wrapper.find('input[name="password"]')
    expect(input().attributes('type')).toBe('password')

    await wrapper.find('[data-action="toggle-password"]').trigger('click')

    expect(input().attributes('type')).toBe('text')
  })

  it('links to forgot password', async () => {
    const { wrapper } = await renderLogin()

    expect(wrapper.find('a[href="/forgot-password"]').exists()).toBe(true)
  })
})
