import { en as uiEn, vi as uiVi } from '@nuxt/ui/locale'
import { computed, inject, readonly, ref, watchEffect } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

import type { App, InjectionKey, Ref } from 'vue'

import en from '@locales/en.json'
import vi from '@locales/vi.json'

export type MessageSchema = typeof vi

/** Mọi key lá của MessageSchema, VD 'common.save' | 'errors.UNKNOWN'. */
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown> ? Leaves<T[K], `${P}${K}.`> : `${P}${K}`
}[keyof T & string]
export type MessageKey = Leaves<MessageSchema>
export type AppLocale = 'en' | 'vi'

interface AppLocaleState {
  locale: Ref<AppLocale>
  setLocale: (next: AppLocale) => void
}

const LOCALE_KEY: InjectionKey<AppLocaleState> = Symbol('locale')
const LOCALES: readonly AppLocale[] = ['vi', 'en']
const UI_LOCALES = { vi: uiVi, en: uiEn } as const
const isAppLocale = (v: unknown): v is AppLocale => LOCALES.includes(v as AppLocale)

/** Một instance = một nguồn locale. Không singleton, không side effect lúc import (§H, §V.2). */
export function createAppI18n(opts: { storageKey?: string } = {}) {
  const storageKey = opts.storageKey ?? 'cms.locale'
  const i18n = createI18n<[MessageSchema], AppLocale, false>({
    legacy: false,
    locale: 'vi',
    fallbackLocale: 'en',
    messages: { vi, en },
  })
  const locale = ref<AppLocale>('vi')
  const state: AppLocaleState = {
    locale,
    setLocale: (next) => {
      locale.value = next
    },
  }

  return {
    /** Cho HttpClient (Accept-Language) — đọc đúng instance này. */
    getLocale: () => locale.value,
    /** Dịch key động (VD errors.<code>) cho code ngoài setup (notifier). */
    translate: (key: string) => i18n.global.t(key),
    /** Key có tồn tại không. */
    has: (key: string) => i18n.global.te(key),
    install(app: App) {
      // Persist + <html lang> cài khi app.use(), không phải khi import.
      const saved = localStorage.getItem(storageKey)
      locale.value = isAppLocale(saved) ? saved : 'vi'
      watchEffect(() => {
        i18n.global.locale.value = locale.value
        document.documentElement.lang = locale.value
        localStorage.setItem(storageKey, locale.value)
      })
      app.use(i18n)
      app.provide(LOCALE_KEY, state)
    },
  }
}

/** Interface duy nhất để đọc/đổi ngôn ngữ. */
export function useLocale() {
  const state = inject(LOCALE_KEY)
  if (!state) throw new Error('useLocale() cần createAppI18n() đã được app.use()')
  return {
    locale: readonly(state.locale),
    /** Truyền vào <UApp :locale> để component Nuxt UI đổi ngôn ngữ theo. */
    uiLocale: computed(() => UI_LOCALES[state.locale.value]),
    setLocale: state.setLocale,
  }
}

/**
 * Dịch text trong component. Dùng thay `useI18n()`: `t` của vue-i18n nhận mọi string,
 * còn `t` ở đây chỉ nhận MessageKey → `t('sai.key')` báo lỗi typecheck (§H).
 */
export function useT() {
  const { t, te, n, d } = useI18n()
  return {
    t: (key: MessageKey, named?: Record<string, unknown>) => (named ? t(key, named) : t(key)),
    te,
    n,
    d,
  }
}
