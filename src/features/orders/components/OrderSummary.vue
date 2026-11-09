<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'

import type { Order } from '../types/Order.types'
defineProps<{ order: Order }>()
const { t } = useT()
</script>
<template>
  <dl>
    <template v-for="key in ['subtotal', 'discount', 'shippingCost', 'total'] as const" :key="key">
      <dt>{{ t(`orders.${key}`) }}</dt>
      <dd>{{ (order[key] ?? 0).toLocaleString() }}</dd>
    </template>
  </dl>
</template>
