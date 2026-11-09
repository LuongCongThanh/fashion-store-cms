<script setup lang="ts">
defineProps<{ value: number }>()
</script>

<template>
  <p class="font-display text-3xl font-bold tabular-nums">{{ value.toLocaleString() }}</p>
</template>
