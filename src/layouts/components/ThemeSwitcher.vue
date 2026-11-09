<script setup lang="ts">
import { useTheme } from '@shared/composables/UseTheme'
import { useT } from '@shared/lib/i18n/I18n'
const { mode } = useTheme()
const { t } = useT()
</script>

<template>
  <select
    v-model="mode"
    name="theme"
    :aria-label="t('common.themeLabel')"
    class="rounded border border-default bg-default p-1 text-sm"
  >
    <option value="light">{{ t('common.theme.light') }}</option>
    <option value="dark">{{ t('common.theme.dark') }}</option>
    <option value="auto">{{ t('common.theme.auto') }}</option>
  </select>
</template>
