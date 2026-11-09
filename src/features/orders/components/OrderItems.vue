<script setup lang="ts">
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { Order } from '@features/orders/types/Order.types'
defineProps<{ items: Order['items'] }>()
const { t } = useT()
const format = useFormat()
</script>

<template>
  <EmptyState v-if="!items.length" :title="t('orders.noItems')" icon="i-lucide-package-open" />
  <table v-else class="w-full">
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
        <td class="text-right tabular-nums">{{ format.number(item.quantity) }}</td>
        <td class="text-right tabular-nums">{{ format.money(item.price) }}</td>
      </tr>
    </tbody>
  </table>
</template>
