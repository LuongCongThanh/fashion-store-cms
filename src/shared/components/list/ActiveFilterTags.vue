<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UIcon from '@nuxt/ui/components/Icon.vue'

import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ filters: { key: string; label: string; value: string }[] }>()
const emit = defineEmits<{ remove: [key: string]; clear: [] }>()
const { t } = useT()
</script>

<template>
  <div v-if="filters.length" class="flex shrink-0 items-center gap-2">
    <UBadge
      v-for="filter in filters"
      :key="filter.key"
      color="primary"
      variant="soft"
      size="sm"
      class="gap-1 whitespace-nowrap"
    >
      {{ filter.label }}: {{ filter.value }}
      <button
        type="button"
        :aria-label="t('common.removeFilter', { label: filter.label })"
        class="rounded-sm px-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        @click="emit('remove', filter.key)"
      >
        <UIcon name="i-lucide-x" aria-hidden="true" />
      </button>
    </UBadge>
    <UButton data-action="clear-filters" variant="ghost" size="sm" @click="emit('clear')">{{
      t('common.clearAll')
    }}</UButton>
  </div>
</template>
