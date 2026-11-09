<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ name: string; src?: string }>()
const initial = computed(() => Array.from(props.name.trim())[0]?.toLocaleUpperCase() ?? '?')
</script>

<template>
  <img v-if="src" :src="src" alt="" class="size-10 shrink-0 rounded object-cover" />
  <span
    v-else
    data-product-thumbnail="fallback"
    aria-hidden="true"
    class="flex size-10 shrink-0 items-center justify-center rounded border border-dashed border-default bg-elevated text-sm font-medium text-dimmed"
    >{{ initial }}</span
  >
</template>
