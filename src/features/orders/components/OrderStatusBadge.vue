<script setup lang="ts">
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { OrderStatus } from '@features/orders/types/Order.types'
defineProps<{ status: OrderStatus }>()
const { t } = useT()
const colors = {
  PENDING_PAYMENT: 'warning',
  PLACED: 'warning',
  CONFIRMED: 'info',
  PACKING: 'primary',
  SHIPPING: 'info',
  DELIVERED: 'success',
  COMPLETED: 'success',
  CANCELLED: 'error',
  RETURNED_TO_SENDER: 'neutral',
} as const
</script>

<template>
  <StatusBadge :label="t(`orders.status.${status}`)" :color="colors[status]" />
</template>
