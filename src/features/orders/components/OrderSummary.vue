<script setup lang="ts">
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { Order } from '@features/orders/types/Order.types'
defineProps<{ order: Order }>()
const { t } = useT()
const format = useFormat()
</script>

<template>
  <dl>
    <template v-for="key in ['subtotal', 'discount', 'shippingCost', 'total'] as const" :key="key">
      <dt>{{ t(`orders.${key}`) }}</dt>
      <dd>{{ format.money(order[key]) }}</dd>
    </template>
  </dl>
</template>
