<script setup lang="ts">
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import { useT } from '@shared/lib/i18n/I18n'

const { t } = useT()
</script>

<template>
  <EmptyState icon="i-lucide-search-x" :title="t('errors.NOT_FOUND')" />
</template>
