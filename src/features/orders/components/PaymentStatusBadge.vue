<script setup lang="ts">
import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { PaymentStatus } from '../types/Order.types'
defineProps<{ status: PaymentStatus }>()
const { t } = useT()
const colors = { paid: 'success', unpaid: 'warning', refunded: 'neutral' } as const
</script>
<template>
  <StatusBadge :label="t(`orders.paymentStatus.${status}`)" :color="colors[status]" />
</template>
