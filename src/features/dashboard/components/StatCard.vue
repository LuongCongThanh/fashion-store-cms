<script setup lang="ts">
import { useFormat } from '@shared/lib/format/Format'

import type { ValueFormat } from '@shared/lib/format/Format'

const props = withDefaults(defineProps<{ value: number; format: ValueFormat; size?: 'hero' | 'secondary' }>(), {
  size: 'secondary',
})
const formatter = useFormat()
</script>

<template>
  <p class="font-display tabular-nums" :class="size === 'hero' ? 'text-4xl font-bold' : 'text-2xl font-semibold'">
    {{ formatter.value(props.value, props.format) }}
  </p>
</template>
