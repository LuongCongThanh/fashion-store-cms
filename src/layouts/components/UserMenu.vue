<script setup lang="ts">
import UAvatar from '@nuxt/ui/components/Avatar.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'
import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import { useTheme } from '@shared/composables/UseTheme'
import { useLocale, useT } from '@shared/lib/i18n/I18n'

import type { ThemeMode } from '@shared/composables/UseTheme'
import type { AppLocale } from '@shared/lib/i18n/I18n'

const { t } = useT()
const { mode } = useTheme()
const { locale, setLocale } = useLocale()
const { user, logout } = useAuth()

const THEMES: { icon: string; value: ThemeMode }[] = [
  { value: 'light', icon: 'i-lucide-sun' },
  { value: 'dark', icon: 'i-lucide-moon' },
  { value: 'auto', icon: 'i-lucide-monitor' },
]
const LANGUAGES: AppLocale[] = ['vi', 'en']

// Từ lg trở lên header đã có LanguageSwitcher + ThemeSwitcher → menu chỉ giữ phần tài khoản, tránh trùng chức năng.
const isDesktop = useMediaQuery('(min-width: 1024px)')

const themeGroup = computed(() =>
  THEMES.map((theme) => ({
    label: t(`common.theme.${theme.value}`),
    icon: theme.icon,
    type: 'checkbox' as const,
    checked: mode.value === theme.value,
    onSelect: (): void => {
      mode.value = theme.value
    },
  })),
)
const languageGroup = computed(() =>
  LANGUAGES.map((lang) => ({
    label: t(`common.language.${lang}`),
    icon: 'i-lucide-languages',
    type: 'checkbox' as const,
    checked: locale.value === lang,
    onSelect: (): void => {
      setLocale(lang)
    },
  })),
)

const items = computed(() => [
  [
    {
      label: user.value?.name ?? '',
      description: user.value?.email,
      avatar: { alt: user.value?.name, icon: 'i-lucide-user-round' },
      type: 'label' as const,
    },
  ],
  ...(isDesktop.value ? [] : [themeGroup.value, languageGroup.value]),
  [
    {
      label: t('common.logout'),
      icon: 'i-lucide-log-out',
      color: 'error' as const,
      onSelect: (): void => void logout(),
    },
  ],
])
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'end' }" :ui="{ content: 'min-w-52' }">
    <UButton
      color="neutral"
      variant="ghost"
      trailingIcon="i-lucide-chevron-down"
      :aria-label="t('common.userMenu')"
      :ui="{ base: 'cursor-pointer gap-2 ps-1', trailingIcon: 'hidden size-4 text-dimmed lg:inline-block' }"
    >
      <UAvatar :alt="user?.name" icon="i-lucide-user-round" size="sm" />
      <span class="hidden max-w-32 truncate text-sm font-medium lg:inline">{{ user?.name }}</span>
    </UButton>
  </UDropdownMenu>
</template>
