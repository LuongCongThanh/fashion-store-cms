<script setup lang="ts">
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'
const props = defineProps<{ points: { label: string; value: number }[]; title: string }>()
use([CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent])
const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: props.points.map((point) => point.label) },
  yAxis: { type: 'value' },
  series: [{ type: 'line', data: props.points.map((point) => point.value) }],
}))
</script>

<template>
  <figure :aria-label="title">
    <VChart :option="option" autoresize class="h-64 w-full" />
    <figcaption class="sr-only">{{ title }}</figcaption>
  </figure>
</template>
