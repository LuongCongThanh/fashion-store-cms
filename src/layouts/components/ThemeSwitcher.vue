<script setup lang="ts">
import USelect from '@nuxt/ui/components/Select.vue'
import { computed } from 'vue'

import { useTheme } from '@shared/composables/UseTheme'
import { useT } from '@shared/lib/i18n/I18n'

import type { ThemeMode } from '@shared/composables/UseTheme'
const { mode } = useTheme()
const { t } = useT()

const MODES: ThemeMode[] = ['light', 'dark', 'auto']
const items = computed(() => MODES.map((value) => ({ label: t(`common.theme.${value}`), value })))
</script>

<template>
  <USelect
    v-model="mode"
    :items="items"
    :aria-label="t('common.themeLabel')"
    size="sm"
    color="neutral"
    variant="ghost"
  />
</template>
