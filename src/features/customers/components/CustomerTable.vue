<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import { sortHeader } from '@shared/components/table/SortHeader'
import TableLink from '@shared/components/table/TableLink.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { Customer } from '@features/customers/types/Customer.types'
defineProps<{ data: Customer[]; loading: boolean; error?: unknown; sort: string }>()
const emit = defineEmits<{ sort: [value: string]; retry: [] }>()
const { t } = useT()
const format = useFormat()
const columns = computed<TableColumn<Customer>[]>(() => [
  {
    accessorKey: 'name',
    header: ({ column }) => sortHeader(column, t('common.name')),
    cell: ({ row }) =>
      h(TableLink, { to: `/customers/${encodeURIComponent(row.original.id)}`, label: row.original.name }),
  },
  { accessorKey: 'email', header: t('auth.login.email') },
  { accessorKey: 'phone', header: t('customers.phone') },
  { accessorKey: 'orderCount', header: t('nav.orders') },
  {
    accessorKey: 'totalSpent',
    header: ({ column }) => sortHeader(column, t('customers.totalSpent'), { align: 'right' }),
    cell: ({ row }) => h('span', { class: 'block text-right tabular-nums' }, format.money(row.original.totalSpent)),
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
