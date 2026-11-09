<script setup lang="ts">
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { OrderStatus } from '../types/Order.types'
defineProps<{ status: OrderStatus }>()
const { t } = useT()
const colors = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'primary',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'neutral',
} as const
</script>
<template>
  <StatusBadge :label="t(`orders.status.${status}`)" :color="colors[status]" />
</template>
