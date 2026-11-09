<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'
defineProps<{
  label: string
  color: 'error' | 'info' | 'neutral' | 'primary' | 'success' | 'warning'
}>()
</script>

<template>
  <UBadge :color="color" variant="subtle">{{ label }}</UBadge>
</template>
