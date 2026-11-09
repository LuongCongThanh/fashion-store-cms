<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useT } from '@shared/lib/i18n/I18n'
defineProps<{ canWrite: boolean }>()
const { t } = useT()
</script>
<template>
  <UButton v-if="canWrite" to="/categories/new">{{ t('common.create') }}</UButton>
</template>
