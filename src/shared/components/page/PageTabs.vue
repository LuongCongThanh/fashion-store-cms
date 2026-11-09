<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const props = defineProps<{ tabs: { id: string; label: string }[] }>()
const route = useRoute()
const router = useRouter()
const active = computed(() =>
  props.tabs.some((tab) => tab.id === route.query.tab)
    ? String(route.query.tab)
    : props.tabs[0]?.id,
)
</script>
<template>
  <div role="tablist" class="flex gap-2 border-b border-default">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      :data-tab="tab.id"
      :aria-selected="active === tab.id"
      class="px-4 py-3"
      :class="active === tab.id ? 'border-b-2 border-primary text-primary' : 'text-muted'"
      @click="router.push({ query: { ...route.query, tab: tab.id } })"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
