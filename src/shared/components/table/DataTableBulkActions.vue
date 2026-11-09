<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ count: number }>()
const { t } = useT()
</script>

<template>
  <div v-if="count" class="flex items-center gap-3 rounded bg-muted p-3">
    <span>{{ count }} {{ t('common.selected') }}</span
    ><slot />
  </div>
</template>
