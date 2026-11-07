import UAlert from '@nuxt/ui/components/Alert.vue'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { renderWithPlugins } from '@test/Render'

import { useLocale, useT } from './I18n'

/** Hiện text đã dịch + nút đổi sang tiếng Anh — test qua cái người dùng thấy. */
const LocaleProbe = defineComponent({
  setup() {
    const { t } = useT()
    const { setLocale } = useLocale()
    return () => h('button', { onClick: () => setLocale('en') }, t('common.save'))
  },
})

describe('useLocale', () => {
  it('switches visible text to English', async () => {
    const { wrapper } = renderWithPlugins(LocaleProbe)
    expect(wrapper.text()).toBe('Lưu')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toBe('Save')
  })

  it('syncs <html lang>, persists the choice and sends Accept-Language', async () => {
    const { wrapper, http, runtime } = renderWithPlugins(LocaleProbe)
    http.onGet(/\/ping$/).reply(200, {})

    await wrapper.find('button').trigger('click')
    await flushPromises()
    await runtime.http.get('/ping')

    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('cms.locale')).toBe('en')
    expect(http.history.get[0]?.headers?.['Accept-Language']).toBe('en')
  })

  it('restores the saved language after a reload', () => {
    localStorage.setItem('cms.locale', 'en')

    const { wrapper } = renderWithPlugins(LocaleProbe)

    expect(wrapper.text()).toBe('Save')
  })

  it('switches Nuxt UI component texts too', async () => {
    const UiProbe = defineComponent({
      setup() {
        const { setLocale } = useLocale()
        return () => [
          h(UAlert, { title: 'x', close: true }),
          h('button', { id: 'en', onClick: () => setLocale('en') }),
        ]
      },
    })
    const { wrapper } = renderWithPlugins(UiProbe)
    const closeLabel = () =>
      wrapper.find('[aria-label="Đóng"], [aria-label="Close"]').attributes('aria-label')
    expect(closeLabel()).toBe('Đóng')

    await wrapper.find('#en').trigger('click')
    await flushPromises()

    expect(closeLabel()).toBe('Close')
  })
})
