<script setup lang="ts">
import USelect from '@nuxt/ui/components/Select.vue'

import { useLocale, useT } from '@shared/lib/i18n/I18n'

import type { AppLocale } from '@shared/lib/i18n/I18n'
const { locale, setLocale } = useLocale()
const { t } = useT()

// Tên ngôn ngữ viết bằng chính ngôn ngữ đó, không dịch.
const ITEMS: { label: string; value: AppLocale }[] = [
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'English', value: 'en' },
]
</script>

<template>
  <USelect
    :modelValue="locale"
    :items="ITEMS"
    :aria-label="t('common.languageLabel')"
    size="sm"
    color="neutral"
    variant="ghost"
    icon="i-lucide-languages"
    :ui="{ base: 'cursor-pointer' }"
    @update:modelValue="setLocale($event as AppLocale)"
  />
</template>
