import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { renderWithPlugins } from '@test/Render'

import ResetPasswordView from './ResetPasswordView.vue'

const DONE = 'Mật khẩu đã được đặt lại'
const INVALID_LINK = 'Liên kết đặt lại mật khẩu không hợp lệ'

async function render(query: Record<string, string> = { token: 'tok-1' }) {
  const Blank = { render: () => null }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Blank },
      { path: '/login', name: 'auth.login', component: Blank },
      { path: '/forgot-password', name: 'auth.forgot-password', component: Blank },
      { path: '/reset-password', name: 'auth.reset-password', component: Blank },
    ],
  })
  await router.push({ name: 'auth.reset-password', query })
  return renderWithPlugins(ResetPasswordView, { session: {}, router })
}

async function fill(wrapper: Awaited<ReturnType<typeof render>>['wrapper'], password: string, confirm: string) {
  await wrapper.find('input[name="password"]').setValue(password)
  await wrapper.find('input[name="confirmPassword"]').setValue(confirm)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
}

describe('ResetPasswordView', () => {
  it('explains an invalid link instead of showing the form when the token is missing', async () => {
    const { wrapper } = await render({})

    expect(wrapper.text()).toContain(INVALID_LINK)
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('rejects mismatched passwords without calling the API', async () => {
    const { wrapper, http } = await render()

    await fill(wrapper, 'secret-1', 'secret-2')

    expect(http.history.post).toHaveLength(0)
  })

  it('sends the token from the link with the new password', async () => {
    const { wrapper, http } = await render()
    http.onPost(/\/auth\/reset-password$/).reply(204)

    await fill(wrapper, 'secret-1', 'secret-1')

    expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
      token: 'tok-1',
      password: 'secret-1',
      confirmPassword: 'secret-1',
    })
    expect(wrapper.text()).toContain(DONE)
  })

  it('explains an expired link inline and offers a new email instead of a toast', async () => {
    const { wrapper, http, notifier } = await render()
    http.onPost(/\/auth\/reset-password$/).reply(400, { code: 'VALIDATION_FAILED', message: 'expired' })

    await fill(wrapper, 'secret-1', 'secret-1')

    expect(wrapper.text()).toContain('Liên kết đã hết hạn hoặc đã được sử dụng.')
    expect(wrapper.text()).toContain('Gửi lại email')
    expect(notifier.error).not.toHaveBeenCalled()
  })

  it('shows a loading submit button while resetting', async () => {
    const { wrapper, http } = await render()
    http.onPost(/\/auth\/reset-password$/).reply(() => new Promise(() => {}))

    await fill(wrapper, 'secret-1', 'secret-1')

    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('hands server errors to the notifier', async () => {
    const { wrapper, http, notifier } = await render()
    http.onPost(/\/auth\/reset-password$/).reply(500)

    await fill(wrapper, 'secret-1', 'secret-1')

    expect(notifier.error).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).not.toContain(DONE)
  })
})
