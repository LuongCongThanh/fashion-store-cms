<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import USelect from '@nuxt/ui/components/Select.vue'

import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { Paginated } from '@shared/types/Pagination.types'
defineProps<{ meta?: Paginated<unknown>['meta'] }>()
const emit = defineEmits<{ page: [page: number]; pageSize: [size: number] }>()
const { t, tn } = useT()
const format = useFormat()

const PAGE_SIZES = [10, 20, 50, 100].map((size) => ({ label: String(size), value: size }))
</script>

<template>
  <nav v-if="meta" :aria-label="t('common.pagination')" class="flex items-center justify-end gap-3">
    <span data-total>{{ tn('common.results', meta.total, { n: format.number(meta.total) }) }}</span>
    <USelect
      :modelValue="meta.pageSize"
      :items="PAGE_SIZES"
      :aria-label="t('common.pageSize')"
      size="sm"
      class="w-20"
      @update:modelValue="emit('pageSize', Number($event))"
    />
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
