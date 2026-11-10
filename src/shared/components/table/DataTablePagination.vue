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
  <nav
    v-if="meta"
    :aria-label="t('common.pagination')"
    class="flex flex-wrap items-center justify-between gap-3 px-1 text-sm text-muted"
  >
    <span data-total class="tabular-nums">{{
      tn('common.results', meta.total, { n: format.number(meta.total) })
    }}</span>
    <div class="flex items-center gap-2">
      <USelect
        :modelValue="meta.pageSize"
        :items="PAGE_SIZES"
        :aria-label="t('common.pageSize')"
        size="sm"
        color="neutral"
        variant="outline"
        class="w-20"
        @update:modelValue="emit('pageSize', Number($event))"
      />
      <div class="flex items-center gap-1">
        <UButton
          :disabled="meta.page <= 1"
          :aria-label="t('common.previous')"
          icon="i-lucide-chevron-left"
          color="neutral"
          variant="outline"
          size="sm"
          @click="emit('page', meta.page - 1)"
        />
        <span class="min-w-16 text-center font-medium text-highlighted tabular-nums"
          >{{ meta.page }} / {{ meta.totalPages }}</span
        >
        <UButton
          :disabled="meta.page >= meta.totalPages"
          :aria-label="t('common.next')"
          icon="i-lucide-chevron-right"
          color="neutral"
          variant="outline"
          size="sm"
          @click="emit('page', meta.page + 1)"
        />
      </div>
    </div>
  </nav>
</template>
