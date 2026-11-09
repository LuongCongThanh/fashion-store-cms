<script setup lang="ts">
import { useFormat } from '@shared/lib/format/Format'

import type { ValueFormat } from '@shared/lib/format/Format'

const props = defineProps<{ value: number; format: ValueFormat }>()
const formatter = useFormat()
</script>

<template>
  <p class="font-display text-3xl font-bold tabular-nums">
    {{ formatter.value(props.value, props.format) }}
  </p>
</template>
