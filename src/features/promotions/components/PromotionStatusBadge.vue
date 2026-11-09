<script setup lang="ts">
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Promotion } from '../types/Promotion.types'
defineProps<{ status: Promotion['status'] }>()
const { t } = useT()
const colors = { draft: 'neutral', active: 'success', inactive: 'warning' } as const
</script>
<template>
  <StatusBadge :color="colors[status]" :label="t(`promotions.status.${status}`)" />
</template>
