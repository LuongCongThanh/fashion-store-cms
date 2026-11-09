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
  <div v-else class="overflow-x-auto">
    <table class="w-full min-w-[32rem] text-sm">
      <thead>
        <tr>
          <th class="px-3 py-2 text-left text-xs text-muted">{{ t('common.name') }}</th>
          <th class="px-3 py-2 text-left text-xs text-muted">SKU</th>
          <th class="px-3 py-2 text-right text-xs text-muted">{{ t('orders.quantity') }}</th>
          <th class="px-3 py-2 text-right text-xs text-muted">{{ t('products.price') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td class="px-3 py-2.5">{{ item.name }}</td>
          <td class="px-3 py-2.5 font-mono">{{ item.sku }}</td>
          <td class="px-3 py-2.5 text-right tabular-nums">{{ format.number(item.quantity) }}</td>
          <td class="px-3 py-2.5 text-right tabular-nums">{{ format.money(item.price) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
