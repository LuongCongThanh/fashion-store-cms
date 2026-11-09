<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <section class="space-y-4 rounded-xl border border-default p-5">
    <h2 class="font-display text-lg font-semibold">{{ title }}</h2>
    <p v-if="description" class="text-sm text-muted">{{ description }}</p>
    <slot />
  </section>
</template>
