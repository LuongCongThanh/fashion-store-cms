import { useLocale } from '@shared/lib/i18n/I18n'

import type { AppLocale } from '@shared/lib/i18n/I18n'

/** Giá trị thiếu hiện thành gạch ngang, không phải `0` hay `NaN`. */
const MISSING = '—'
/** Năm đủ 4 chữ số để không nhầm thế kỷ trong lịch sử đơn. */
const DATE_TIME: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}
const INTL_LOCALES: Record<AppLocale, string> = { vi: 'vi-VN', en: 'en-US' }

/** Format tiền / số / ngày theo locale của app, không theo locale trình duyệt (DESIGN.md). */
export function useFormat() {
  const { locale } = useLocale()
  const tag = () => INTL_LOCALES[locale.value]
  return {
    money: (value: number | null | undefined) =>
      value == null
        ? MISSING
        : new Intl.NumberFormat(tag(), { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value),
    number: (value: number | null | undefined) =>
      value == null ? MISSING : new Intl.NumberFormat(tag()).format(value),
    dateTime: (value: Date | string | null | undefined) => {
      if (value == null) return MISSING
      const date = value instanceof Date ? value : new Date(value)
      if (Number.isNaN(date.getTime())) return MISSING
      return new Intl.DateTimeFormat(tag(), DATE_TIME).format(date)
    },
  }
}
