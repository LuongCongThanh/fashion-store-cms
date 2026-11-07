# 08 — i18n

Status: ready-for-agent
Blocked by: 05
Nguồn: Step 3c trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41, trong đó D24, D32 đã huỷ), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 3c — i18n

**Làm gì**

- `I18n.ts` theo §H: `createAppI18n()` (plugin sở hữu locale), `useLocale()`; không singleton; `vi.json`/`en.json` có nhóm `common`.
- `App.vue` dùng `uiLocale` từ `useLocale()`.
- Spec (qua `renderWithPlugins()`): `useLocale().setLocale('en')` → text UI đổi sang tiếng Anh, `<html lang>`, `localStorage`, và `runtime.http` gửi `Accept-Language: en`.

**Kiểm tra:** chuyển vi/en đổi cả text và component Nuxt UI, F5 vẫn giữ ngôn ngữ; `t('sai.key')` báo lỗi typecheck; không còn `app/stores/`; không còn export singleton `i18n` (§V.2).

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

### H. Cấu hình i18n (vue-i18n)

- Dùng Composition API (`legacy: false`), locale mặc định `vi`, fallback `en`.
- Locale do **instance** sở hữu: `createAppI18n()` trả về plugin; khi `app.use()` nó đọc/persist `localStorage` (key `cms.locale`), đồng bộ `<html lang>` và locale Nuxt UI. `useLocale()` → `{ locale, uiLocale, setLocale }` inject chính instance đó. Không store nào khác giữ locale.
- **Không** export singleton `i18n`, **không** side effect lúc import. Mỗi app/test có đúng một instance do `createAppRuntime()` tạo (D37). Code ngoài setup (HttpClient) nhận `getLocale` do runtime truyền vào, đọc đúng instance đó.
- Một file JSON cho mỗi ngôn ngữ ở `src/locales/`; tách theo feature khi file > ~500 dòng (`locales/vi/products.json`).
- Key theo §B.2 (`feature.scope.key`); nhóm dùng chung là `common.*` (nút, trạng thái), `validation.*` (lỗi Zod), `errors.*` (mã lỗi API).
- Type-safe key: khai báo `MessageSchema = typeof vi` để `t('...')` sai key thì báo lỗi type.
- Nuxt UI: truyền locale tương ứng (`vi`, `en` từ `@nuxt/ui/locale`) vào `<UApp :locale>`.
- Format số/tiền/ngày: `numberFormats` (`currency: 'VND'`), `datetimeFormats`; không tự ghép chuỗi.
- Không hard-code text tiếng Việt/Anh trong `.vue` (kiểm tra khi review; có thể thêm `@intlify/eslint-plugin-vue-i18n` sau).

```ts
// src/shared/lib/i18n/I18n.ts
import { en as uiEn, vi as uiVi } from '@nuxt/ui/locale'
import {
  computed,
  inject,
  readonly,
  ref,
  watchEffect,
  type App,
  type InjectionKey,
  type Ref,
} from 'vue'
import { createI18n } from 'vue-i18n'

import en from '@locales/en.json'
import vi from '@locales/vi.json'

export type MessageSchema = typeof vi
export type AppLocale = 'vi' | 'en'

const UI_LOCALES = { vi: uiVi, en: uiEn } as const

const LOCALE_KEY: InjectionKey<AppLocaleState> = Symbol('locale')

interface AppLocaleState {
  locale: Ref<AppLocale>
  setLocale: (next: AppLocale) => void
}

/** Một instance = một nguồn locale. Persist + <html lang> được cài khi app.use(), không phải khi import. */
export function createAppI18n(opts: { storageKey?: string } = {}) {
  const key = opts.storageKey ?? 'cms.locale'
  const i18n = createI18n<[MessageSchema], AppLocale>({
    legacy: false,
    locale: 'vi',
    fallbackLocale: 'en',
    messages: { vi, en },
    numberFormats: {
      vi: { currency: { style: 'currency', currency: 'VND' } },
      en: { currency: { style: 'currency', currency: 'VND' } },
    },
  })
  const locale = ref<AppLocale>('vi')
  const state: AppLocaleState = {
    locale,
    setLocale: (next) => {
      locale.value = next
    },
  }

  return {
    getLocale: () => locale.value, // cho HttpClient (Accept-Language)
    install(app: App) {
      locale.value = (localStorage.getItem(key) as AppLocale | null) ?? 'vi'
      watchEffect(() => {
        i18n.global.locale.value = locale.value
        document.documentElement.lang = locale.value
        localStorage.setItem(key, locale.value)
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
    uiLocale: computed(() => UI_LOCALES[state.locale.value]),
    setLocale: state.setLocale,
  }
}
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { useLocale } from '@shared/lib/i18n/I18n'
const { uiLocale } = useLocale()
</script>

<template>
  <UApp :locale="uiLocale"><RouterView /></UApp>
</template>
```
