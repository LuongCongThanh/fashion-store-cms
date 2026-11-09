<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ filters: { key: string; label: string; value: string }[] }>()
const emit = defineEmits<{ remove: [key: string]; clear: [] }>()
const { t } = useT()
</script>
<template>
  <div v-if="filters.length" class="flex flex-wrap gap-2">
    <UButton
      v-for="filter in filters"
      :key="filter.key"
      variant="soft"
      trailingIcon="i-lucide-x"
      @click="emit('remove', filter.key)"
      >{{ filter.label }}: {{ filter.value }}</UButton
    ><UButton data-action="clear-filters" variant="ghost" @click="emit('clear')">{{ t('common.clearAll') }}</UButton>
  </div>
</template>
