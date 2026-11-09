<script setup lang="ts">
import { useFormat } from '@shared/lib/format/Format'

defineProps<{ items: { id: string; label: string; value: number }[] }>()
const format = useFormat()
</script>

<template>
  <ul class="divide-y divide-default">
    <li v-for="item in items" :key="item.id" class="flex justify-between py-2">
      <RouterLink :to="`/inventory?search=${encodeURIComponent(item.label)}`">{{ item.label }}</RouterLink>
      <span class="tabular-nums">{{ format.number(item.value) }}</span>
    </li>
  </ul>
</template>
