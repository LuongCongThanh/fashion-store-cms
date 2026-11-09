<script setup lang="ts">
import { useLocale, useT } from '@shared/lib/i18n/I18n'

import type { AppLocale } from '@shared/lib/i18n/I18n'
const { locale, setLocale } = useLocale()
const { t } = useT()
</script>
<template>
  <select
    name="language"
    :aria-label="t('common.languageLabel')"
    :value="locale"
    class="rounded border border-default bg-default p-1 text-sm"
    @change="setLocale(($event.target as HTMLSelectElement).value as AppLocale)"
  >
    <option value="vi">Tiếng Việt</option>
    <option value="en">English</option>
  </select>
</template>
