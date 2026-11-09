<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useT } from '@shared/lib/i18n/I18n'

import type { Paginated } from '@shared/types/Pagination.types'
defineProps<{ meta?: Paginated<unknown>['meta'] }>()
const emit = defineEmits<{ page: [page: number]; pageSize: [size: number] }>()
const { t } = useT()
</script>
<template>
  <nav v-if="meta" :aria-label="t('common.pagination')" class="flex items-center justify-end gap-3">
    <span>{{ meta.total }} {{ t('common.results') }}</span>
    <select
      name="pageSize"
      :value="meta.pageSize"
      :aria-label="t('common.pageSize')"
      @change="emit('pageSize', Number(($event.target as HTMLSelectElement).value))"
    >
      <option v-for="size in [10, 20, 50, 100]" :key="size" :value="size">{{ size }}</option>
    </select>
    <UButton
      :disabled="meta.page <= 1"
      :aria-label="t('common.previous')"
      icon="i-lucide-chevron-left"
      @click="emit('page', meta.page - 1)"
    />
    <span>{{ meta.page }} / {{ meta.totalPages }}</span>
    <UButton
      :disabled="meta.page >= meta.totalPages"
      :aria-label="t('common.next')"
      icon="i-lucide-chevron-right"
      @click="emit('page', meta.page + 1)"
    />
  </nav>
</template>
