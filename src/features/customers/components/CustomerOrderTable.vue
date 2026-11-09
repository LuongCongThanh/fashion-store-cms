<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Order } from '@features/orders/types/Order.types'
defineProps<{ data: Order[]; loading: boolean; error?: unknown }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<Order>[]>(() => [
  {
    accessorKey: 'number',
    header: t('nav.orders'),
    cell: ({ row }) =>
      h('a', { href: `/orders/${encodeURIComponent(row.original.id)}` }, row.original.number),
  },
  { accessorKey: 'total', header: t('orders.total') },
])
</script>
<template>
  <DataTable
    :data="data"
    :columns="columns"
    :loading="loading"
    :error="error"
    @retry="emit('retry')"
  />
</template>
