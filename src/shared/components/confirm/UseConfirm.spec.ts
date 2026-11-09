import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { renderWithPlugins } from '@test/Render'

import { useConfirm } from './UseConfirm'

import type { ConfirmOptions } from './UseConfirm'

/** Nút "open" gọi confirm() và in kết quả ra text — test chỉ thấy cái người dùng thấy. */
function renderHost(options: ConfirmOptions) {
  const Host = defineComponent({
    setup() {
      const confirm = useConfirm()
      const result = ref('pending')
      const open = async () => {
        result.value = String(await confirm(options))
      }
      return () => h('button', { id: 'open', onClick: open }, result.value)
    },
  })
  return renderWithPlugins(Host, { mount: { attachTo: document.body } })
}

function buttonByText(text: string) {
  const button = [...document.body.querySelectorAll('button')].find((b) => b.textContent.trim() === text)
  if (!button) throw new Error(`No button "${text}" in: ${document.body.innerHTML}`)
  return button
}

describe('useConfirm', () => {
  it('resolves true when the user confirms', async () => {
    const { wrapper } = renderHost({ title: 'Xoá sản phẩm?', confirmLabel: 'Xoá' })

    await wrapper.find('#open').trigger('click')
    await flushPromises()
    expect(document.body.textContent).toContain('Xoá sản phẩm?')

    buttonByText('Xoá').click()
    await flushPromises()

    expect(wrapper.find('#open').text()).toBe('true')
  })

  it('resolves false when the user cancels', async () => {
    const { wrapper } = renderHost({
      title: 'Huỷ đơn?',
      confirmLabel: 'Đồng ý',
      cancelLabel: 'Thôi',
    })

    await wrapper.find('#open').trigger('click')
    await flushPromises()
    buttonByText('Thôi').click()
    await flushPromises()

    expect(wrapper.find('#open').text()).toBe('false')
  })
})
