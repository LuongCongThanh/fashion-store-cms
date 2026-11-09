<script setup lang="ts">
defineProps<{ items: { id: string; label: string; value: number }[] }>()
</script>
<template>
  <ul class="divide-y divide-default">
    <li v-for="item in items" :key="item.id" class="flex justify-between py-2">
      <RouterLink :to="`/orders/${encodeURIComponent(item.id)}`">{{ item.label }}</RouterLink>
      <span>{{ item.value }}</span>
    </li>
  </ul>
</template>
