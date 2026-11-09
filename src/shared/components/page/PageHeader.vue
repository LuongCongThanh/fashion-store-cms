<script setup lang="ts">
/** Tiêu đề trang chuẩn — gắn sẵn font-display (§L.5). Text truyền vào đã dịch. */
const props = defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="mb-6 flex items-start justify-between gap-4">
    <div>
      <h1 class="font-display text-2xl font-semibold text-highlighted">{{ props.title }}</h1>
      <slot name="description">
        <p v-if="props.description" class="mt-1 text-sm text-muted">{{ props.description }}</p>
      </slot>
    </div>
    <slot name="actions" />
  </div>
</template>
