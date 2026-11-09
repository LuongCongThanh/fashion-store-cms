<script setup lang="ts">
import USkeleton from '@nuxt/ui/components/Skeleton.vue'

import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
</script>

<template>
  <div role="status" :aria-label="t('common.loading')" class="space-y-3">
    <USkeleton v-for="row in 3" :key="row" class="h-10 w-full" />
  </div>
</template>
