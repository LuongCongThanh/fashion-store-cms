<script setup lang="ts">
import { useT } from '@shared/lib/i18n/I18n'

import type { Order } from '@features/orders/types/Order.types'
defineProps<{ items: Order['items'] }>()
const { t } = useT()
</script>

<template>
  <table class="w-full">
    <thead>
      <tr>
        <th>{{ t('common.name') }}</th>
        <th>SKU</th>
        <th>{{ t('orders.quantity') }}</th>
        <th>{{ t('products.price') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.sku }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.price }}</td>
      </tr>
    </tbody>
  </table>
</template>
