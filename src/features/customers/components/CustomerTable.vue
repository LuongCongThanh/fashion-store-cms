<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Customer } from '@features/customers/types/Customer.types'
defineProps<{ data: Customer[]; loading: boolean; error?: unknown; sort: string }>()
const emit = defineEmits<{ sort: [value: string]; retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<Customer>[]>(() => [
  {
    accessorKey: 'name',
    header: ({ column }) => h('button', { onClick: () => column.toggleSorting() }, t('common.name')),
    cell: ({ row }) => h('a', { href: `/customers/${encodeURIComponent(row.original.id)}` }, row.original.name),
  },
  { accessorKey: 'email', header: t('auth.login.email') },
  { accessorKey: 'phone', header: t('customers.phone') },
  { accessorKey: 'orderCount', header: t('nav.orders') },
  {
    accessorKey: 'totalSpent',
    header: ({ column }) => h('button', { onClick: () => column.toggleSorting() }, t('customers.totalSpent')),
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
