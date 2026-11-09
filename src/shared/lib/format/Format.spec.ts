import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { useLocale } from '@shared/lib/i18n/I18n'
import { renderWithPlugins } from '@test/Render'

import { useFormat } from './Format'

/** Hiện chuỗi đã format + nút đổi sang tiếng Anh — test qua cái người dùng thấy. */
function probe(render: (format: ReturnType<typeof useFormat>) => string) {
  return defineComponent({
    setup() {
      const format = useFormat()
      const { setLocale } = useLocale()
      return () =>
        h(
          'button',
          {
            onClick: () => {
              setLocale('en')
            },
          },
          render(format),
        )
    },
  })
}

/** Intl dùng khoảng trắng không ngắt (U+00A0 / U+202F); chuẩn hoá để so sánh. */
const text = (value: string) => value.replace(/[  ]/g, ' ')

describe('useFormat', () => {
  it('formats money as VND in Vietnamese', () => {
    const { wrapper } = renderWithPlugins(probe((f) => f.money(1_890_000)))
    expect(text(wrapper.text())).toBe('1.890.000 ₫')
  })

  it('follows the app locale when the user switches to English', async () => {
    const { wrapper } = renderWithPlugins(probe((f) => f.money(1_890_000)))
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(text(wrapper.text())).toBe('₫1,890,000')
  })

  it.each([
    ['zero', 0, '0 ₫'],
    ['negative (discount)', -683_000, '-683.000 ₫'],
    ['missing', null, '—'],
    ['undefined', undefined, '—'],
  ])('formats money edge case: %s', (_name, value, expected) => {
    const { wrapper } = renderWithPlugins(probe((f) => f.money(value)))
    expect(text(wrapper.text())).toBe(expected)
  })

  it('formats plain numbers with the locale separator', () => {
    const { wrapper } = renderWithPlugins(probe((f) => `${f.number(12_905)}|${f.number(null)}`))
    expect(text(wrapper.text())).toBe('12.905|—')
  })

  it('formats date-time in the app locale (local time)', async () => {
    // Giờ local, không phụ thuộc múi giờ của máy chạy test.
    const at = new Date(2026, 10, 9, 8, 42)
    const { wrapper } = renderWithPlugins(probe((f) => f.dateTime(at)))
    expect(text(wrapper.text())).toBe('08:42 9/11/2026')
    await wrapper.find('button').trigger('click')
    await flushPromises()
    // Giờ 2 chữ số có chủ đích: cột thời gian trong timeline thẳng hàng.
    expect(text(wrapper.text())).toBe('11/9/2026, 08:42 AM')
  })

  it('accepts ISO strings and shows a dash for missing or invalid dates', () => {
    const iso = new Date(2026, 10, 9, 8, 42).toISOString()
    const { wrapper } = renderWithPlugins(
      probe((f) => `${f.dateTime(iso)}|${f.dateTime(null)}|${f.dateTime('not-a-date')}`),
    )
    expect(text(wrapper.text())).toBe('08:42 9/11/2026|—|—')
  })
})
