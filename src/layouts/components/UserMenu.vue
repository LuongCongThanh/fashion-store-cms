<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'
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

const items = computed(() => [
  [{ label: user.value?.name ?? '', type: 'label' as const }],
  THEMES.map((theme) => ({
    label: t(`common.theme.${theme.value}`),
    icon: theme.icon,
    type: 'checkbox' as const,
    checked: mode.value === theme.value,
    onSelect: (): void => {
      mode.value = theme.value
    },
  })),
  LANGUAGES.map((lang) => ({
    label: t(`common.language.${lang}`),
    icon: 'i-lucide-languages',
    type: 'checkbox' as const,
    checked: locale.value === lang,
    onSelect: (): void => {
      setLocale(lang)
    },
  })),
  [{ label: t('common.logout'), icon: 'i-lucide-log-out', onSelect: (): void => void logout() }],
])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton icon="i-lucide-user-round" color="neutral" variant="ghost" :aria-label="t('common.userMenu')" />
  </UDropdownMenu>
</template>
