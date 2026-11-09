import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import { plainSpaces, withLocaleSwitch } from '@test/Intl'
import { renderWithPlugins } from '@test/Render'

import { formatDateTime, formatMoney, formatNumber, useFormat } from './Format'

/** Render chuỗi do `useFormat()` tạo ra, kèm nút đổi sang tiếng Anh. */
function probe(render: (format: ReturnType<typeof useFormat>) => string) {
  return withLocaleSwitch(() => {
    const format = useFormat()
    return () => h('output', render(format))
  })
}

async function shownInViThenEn(render: (format: ReturnType<typeof useFormat>) => string) {
  const { wrapper } = renderWithPlugins(probe(render))
  const vi = plainSpaces(wrapper.find('output').text())
  await wrapper.find('[data-action="locale-en"]').trigger('click')
  await flushPromises()
  return { vi, en: plainSpaces(wrapper.find('output').text()) }
}

describe('useFormat', () => {
  it('formats money as VND and follows the app locale', async () => {
    expect(await shownInViThenEn((f) => f.money(1_890_000))).toEqual({ vi: '1.890.000 ₫', en: '₫1,890,000' })
  })

  it('formats numbers with the locale separator and follows the app locale', async () => {
    expect(await shownInViThenEn((f) => f.number(12_905))).toEqual({ vi: '12.905', en: '12,905' })
  })

  it('formats date-time in local time with a 4-digit year and follows the app locale', async () => {
    // Giờ local → không phụ thuộc múi giờ của máy chạy test.
    const at = new Date(2026, 10, 9, 8, 42)
    expect(await shownInViThenEn((f) => f.dateTime(at))).toEqual({
      vi: '08:42 9/11/2026',
      en: '11/9/2026, 08:42 AM',
    })
  })

  it('formats a value by its declared kind', async () => {
    expect(await shownInViThenEn((f) => `${f.value(1_842, 'number')}|${f.value(1_842, 'money')}`)).toEqual({
      vi: '1.842|1.842 ₫',
      en: '1,842|₫1,842',
    })
  })
})

describe('formatters outside a component', () => {
  it.each([
    ['zero', 0, '0 ₫', '0'],
    ['negative (discount)', -683_000, '-683.000 ₫', '-683.000'],
    ['missing', null, '—', '—'],
    ['undefined', undefined, '—', '—'],
  ])('money and number edge case: %s', (_name, value, money, number) => {
    expect(plainSpaces(formatMoney(value, 'vi'))).toBe(money)
    expect(plainSpaces(formatNumber(value, 'vi'))).toBe(number)
  })

  it('formats in English without a Vue app', () => {
    expect(plainSpaces(formatMoney(-683_000, 'en'))).toBe('-₫683,000')
    expect(formatNumber(0, 'en')).toBe('0')
  })

  it('accepts ISO strings and shows a dash for missing or invalid dates', () => {
    const iso = new Date(2026, 10, 9, 8, 42).toISOString()
    expect(plainSpaces(formatDateTime(iso, 'vi'))).toBe('08:42 9/11/2026')
    expect(formatDateTime(null, 'vi')).toBe('—')
    expect(formatDateTime('not-a-date', 'vi')).toBe('—')
  })
})
