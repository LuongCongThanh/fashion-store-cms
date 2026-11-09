<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Order } from '@features/orders/types/Order.types'

import OrderStatusBadge from './OrderStatusBadge.vue'
import PaymentStatusBadge from './PaymentStatusBadge.vue'
defineProps<{ data: Order[]; loading: boolean; error?: unknown; sort: string }>()
const emit = defineEmits<{ sort: [value: string]; retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<Order>[]>(() => [
  {
    accessorKey: 'number',
    header: t('nav.orders'),
    cell: ({ row }) => h('a', { href: `/orders/${encodeURIComponent(row.original.id)}` }, row.original.number),
  },
  {
    id: 'customer',
    header: t('dashboard.customers'),
    cell: ({ row }) => row.original.customer.name,
  },
  {
    accessorKey: 'total',
    header: ({ column }) => h('button', { onClick: () => column.toggleSorting() }, t('orders.total')),
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
    header: ({ column }) => h('button', { onClick: () => column.toggleSorting() }, t('common.createdAt')),
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
