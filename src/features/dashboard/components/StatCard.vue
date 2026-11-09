<script setup lang="ts">
import { useFormat } from '@shared/lib/format/Format'

const props = defineProps<{ value: number; money?: boolean }>()
const format = useFormat()
</script>

<template>
  <p class="font-display text-3xl font-bold tabular-nums">
    {{ props.money ? format.money(props.value) : format.number(props.value) }}
  </p>
</template>
