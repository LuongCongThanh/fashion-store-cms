<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import { sortHeader } from '@shared/components/table/SortHeader'
import TableLink from '@shared/components/table/TableLink.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { Order } from '@features/orders/types/Order.types'

import OrderStatusBadge from './OrderStatusBadge.vue'
import PaymentStatusBadge from './PaymentStatusBadge.vue'
defineProps<{ data: Order[]; loading: boolean; error?: unknown; sort: string }>()
const emit = defineEmits<{ sort: [value: string]; retry: [] }>()
const { t } = useT()
const format = useFormat()
const columns = computed<TableColumn<Order>[]>(() => [
  {
    accessorKey: 'number',
    header: t('nav.orders'),
    cell: ({ row }) =>
      h(TableLink, { to: `/orders/${encodeURIComponent(row.original.id)}`, label: row.original.number }),
  },
  {
    id: 'customer',
    header: t('dashboard.customers'),
    cell: ({ row }) => row.original.customer.name,
  },
  {
    accessorKey: 'total',
    header: ({ column }) => sortHeader(column, t('orders.total'), { align: 'right' }),
    cell: ({ row }) => h('span', { class: 'block text-right tabular-nums' }, format.money(row.original.total)),
  },
  {
    accessorKey: 'paymentStatus',
    header: t('orders.payment'),
    cell: ({ row }) => h(PaymentStatusBadge, { status: row.original.paymentStatus }),
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => h(OrderStatusBadge, { status: row.original.status }),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => sortHeader(column, t('common.createdAt')),
  },
])
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    :loading="loading"
    :error="error"
    :sort="sort"
    @sort="emit('sort', $event)"
    @retry="emit('retry')"
  />
</template>
