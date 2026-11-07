import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { renderWithPlugins } from '@test/Render'

import ForgotPasswordView from './ForgotPasswordView.vue'

const SENT = 'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.'

async function submit(email: string, status: number) {
  const { wrapper, http, notifier } = renderWithPlugins(ForgotPasswordView, { session: {} })
  http.onPost(/\/auth\/forgot-password$/).reply(status)
  await wrapper.find('input[name="email"]').setValue(email)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  return { wrapper, http, notifier }
}

describe('ForgotPasswordView', () => {
  it('validates the email before sending', async () => {
    const { wrapper, http } = await submit('nope', 204)

    expect(wrapper.text()).toContain('Email không hợp lệ')
    expect(http.history.post).toHaveLength(0)
  })

  it('sends the email and shows the neutral confirmation', async () => {
    const { wrapper, http } = await submit('lan@shop.vn', 204)

    expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({ email: 'lan@shop.vn' })
    expect(wrapper.text()).toContain(SENT)
  })

  it('shows the same confirmation when the email is unknown', async () => {
    const { wrapper, notifier } = await submit('ghost@shop.vn', 404)

    expect(wrapper.text()).toContain(SENT)
    expect(notifier.error).not.toHaveBeenCalled()
  })

  it('hands server errors to the notifier', async () => {
    const { wrapper, notifier } = await submit('lan@shop.vn', 500)

    expect(notifier.error).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).not.toContain(SENT)
  })
})
