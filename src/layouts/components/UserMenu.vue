<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'
import { computed } from 'vue'

import { useTheme } from '@shared/composables/UseTheme'

import type { ThemeMode } from '@shared/composables/UseTheme'

const { mode } = useTheme()

// Plan 08 thay label bằng i18n; plan 09 thêm thông tin user + đăng xuất.
const THEMES: { icon: string; label: string; value: ThemeMode }[] = [
  { value: 'light', label: 'Sáng', icon: 'i-lucide-sun' },
  { value: 'dark', label: 'Tối', icon: 'i-lucide-moon' },
  { value: 'auto', label: 'Theo hệ thống', icon: 'i-lucide-monitor' },
]

const items = computed(() => [
  THEMES.map((theme) => ({
    label: theme.label,
    icon: theme.icon,
    type: 'checkbox' as const,
    checked: mode.value === theme.value,
    onSelect: () => {
      mode.value = theme.value
    },
  })),
])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton icon="i-lucide-user-round" color="neutral" variant="ghost" aria-label="User menu" />
  </UDropdownMenu>
</template>
