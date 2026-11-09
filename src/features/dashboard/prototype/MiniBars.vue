<script setup lang="ts">
// PROTOTYPE — biểu đồ cột SVG tối giản, không phụ thuộc ECharts, kèm bảng tóm tắt cho screen reader.
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ points: { label: string; value: number }[]; height?: number; showLabels?: boolean }>(),
  { height: 160, showLabels: true },
)
const max = computed(() => Math.max(...props.points.map((point) => point.value)))
const peak = computed(() => props.points.reduce((a, b) => (b.value > a.value ? b : a)))
</script>

<template>
  <figure>
    <div class="flex items-end gap-2" :style="{ height: `${height}px` }" aria-hidden="true">
      <div v-for="point in points" :key="point.label" class="flex h-full flex-1 flex-col justify-end gap-1">
        <div
          class="w-full rounded-t-sm"
          :class="point === peak ? 'bg-primary' : 'bg-accented'"
          :style="{ height: `${(point.value / max) * 100}%` }"
        />
      </div>
    </div>
    <div v-if="showLabels" class="mt-2 flex gap-2 text-xs text-muted" aria-hidden="true">
      <span v-for="point in points" :key="point.label" class="flex-1 text-center">{{ point.label }}</span>
    </div>
    <figcaption class="sr-only">Cao nhất {{ peak.label }}: {{ peak.value.toLocaleString('vi-VN') }}</figcaption>
  </figure>
</template>
