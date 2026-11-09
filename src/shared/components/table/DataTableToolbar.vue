<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'
import { computed } from 'vue'

import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

/**
 * Hàng tiêu đề của bảng (DESIGN.md mục Bảng): bình thường là tiêu đề + nút chọn cột;
 * khi có dòng được chọn thì thanh thao tác hàng loạt thay vào đúng chỗ đó.
 */
const props = defineProps<{
  title: string
  count: number
  columns?: { id: string; label: string }[]
  visibility?: Record<string, boolean>
}>()
const emit = defineEmits<{ clear: []; 'update:visibility': [value: Record<string, boolean>] }>()
const { t } = useT()
const format = useFormat()

const columnItems = computed(() =>
  (props.columns ?? []).map((column) => ({
    label: column.label,
    type: 'checkbox' as const,
    checked: props.visibility?.[column.id] !== false,
    onUpdateChecked: (checked: boolean) => {
      emit('update:visibility', { ...props.visibility, [column.id]: checked })
    },
  })),
)
</script>

<template>
  <div class="flex min-h-10 items-center justify-between gap-3 rounded-lg" :class="count ? 'bg-primary/10 px-2' : ''">
    <template v-if="count">
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          :aria-label="t('common.clearSelection')"
          @click="emit('clear')"
        />
        <span class="text-sm font-medium tabular-nums">{{ format.number(count) }} {{ t('common.selected') }}</span>
      </div>
      <div class="flex items-center gap-2"><slot name="bulk" /></div>
    </template>
    <template v-else>
      <h2 class="font-display text-base font-semibold text-highlighted">{{ title }}</h2>
      <UDropdownMenu v-if="columnItems.length" :items="columnItems">
        <UButton
          icon="i-lucide-columns-3"
          color="neutral"
          variant="outline"
          size="sm"
          :aria-label="t('common.columns')"
        />
      </UDropdownMenu>
    </template>
  </div>
</template>
