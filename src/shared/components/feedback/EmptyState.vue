<script setup lang="ts">
import UEmpty from '@nuxt/ui/components/Empty.vue'

/** Trạng thái rỗng (§21). Text truyền vào đã dịch. */
const props = defineProps<{ title: string; description?: string; icon?: string }>()
</script>

<template>
  <UEmpty
    :icon="props.icon ?? 'i-lucide-inbox'"
    :title="props.title"
    :description="props.description"
  >
    <template #actions>
      <slot name="actions" />
    </template>
  </UEmpty>
</template>
