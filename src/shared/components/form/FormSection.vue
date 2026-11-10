<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <section class="space-y-4 rounded-lg border border-default bg-default p-5">
    <h2 class="text-base font-semibold">{{ title }}</h2>
    <p v-if="description" class="text-sm text-muted">{{ description }}</p>
    <slot />
  </section>
</template>
