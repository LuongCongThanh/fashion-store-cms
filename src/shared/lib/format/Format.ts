import { useLocale } from '@shared/lib/i18n/I18n'

import type { AppLocale } from '@shared/lib/i18n/I18n'

/** Cách hiển thị một giá trị số: tiền (VND) hay số đếm. */
export type ValueFormat = 'money' | 'number'

/** Giá trị thiếu hiện thành gạch ngang, không phải `0` hay `NaN`. */
const MISSING = '—'
/** Năm đủ 4 chữ số để không nhầm thế kỷ; giờ 2 chữ số để cột thời gian thẳng hàng. */
const DATE_TIME: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}
const INTL_LOCALES: Record<AppLocale, string> = { vi: 'vi-VN', en: 'en-US' }

/** Tiền VND theo locale của app: `1.890.000 ₫` (vi) / `₫1,890,000` (en). Dùng được ngoài `setup`. */
export function formatMoney(value: number | null | undefined, locale: AppLocale): string {
  if (value == null) return MISSING
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Số đếm có dấu phân cách theo locale của app. */
export function formatNumber(value: number | null | undefined, locale: AppLocale): string {
  return value == null ? MISSING : new Intl.NumberFormat(INTL_LOCALES[locale]).format(value)
}

/** Ngày giờ (giờ local) theo locale của app; nhận `Date` hoặc chuỗi ISO, sai định dạng → `—`. */
export function formatDateTime(value: Date | string | null | undefined, locale: AppLocale): string {
  if (value == null) return MISSING
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return MISSING
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], DATE_TIME).format(date)
}

/** Trong component: các formatter trên, tự theo locale hiện tại của app (DESIGN.md). */
export function useFormat() {
  const { locale } = useLocale()
  return {
    money: (value: number | null | undefined) => formatMoney(value, locale.value),
    number: (value: number | null | undefined) => formatNumber(value, locale.value),
    dateTime: (value: Date | string | null | undefined) => formatDateTime(value, locale.value),
    value: (value: number | null | undefined, kind: ValueFormat) =>
      kind === 'money' ? formatMoney(value, locale.value) : formatNumber(value, locale.value),
  }
}
