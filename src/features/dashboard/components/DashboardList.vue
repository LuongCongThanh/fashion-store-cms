<script setup lang="ts">
import { useFormat } from '@shared/lib/format/Format'

import type { DashboardItem } from '@features/dashboard/types/Dashboard.types'
import type { ValueFormat } from '@shared/lib/format/Format'

/** Danh sách widget dashboard: nhãn là link, giá trị định dạng theo `format` của widget. */
defineProps<{ items: DashboardItem[]; format: ValueFormat; linkTo: (item: DashboardItem) => string; soldOutLabel?: string }>()
const formatter = useFormat()
</script>

<template>
  <ul class="divide-y divide-default">
    <li v-for="item in items" :key="item.id" class="flex justify-between gap-3 py-2">
      <RouterLink :to="linkTo(item)">{{ item.label }}</RouterLink>
      <span class="text-right tabular-nums">{{ soldOutLabel && item.value === 0 ? soldOutLabel : formatter.value(item.value, format) }}</span>
    </li>
  </ul>
</template>
