<script setup lang="ts">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import RowActions from '@shared/components/table/RowActions.vue'
import TableLink from '@shared/components/table/TableLink.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { Product } from '@features/products/types/Product.types'

import ProductStatusBadge from './ProductStatusBadge.vue'
const props = defineProps<{
  data: Product[]
  loading: boolean
  error?: unknown
  sort: string
  selection: Record<string, boolean>
  visibility: Record<string, boolean>
  canWrite: boolean
}>()
const emit = defineEmits<{
  sort: [value: string]
  'update:selection': [value: Record<string, boolean>]
  retry: []
  action: [action: string, id: string]
}>()
const { t } = useT()
const format = useFormat()
const columns = computed<TableColumn<Product>[]>(() => [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsAllPageRowsSelected(),
        'aria-label': t('common.selectAll'),
        'onUpdate:modelValue': (value) => {
          table.toggleAllPageRowsSelected(!!value)
        },
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'aria-label': row.original.name,
        'onUpdate:modelValue': (value) => {
          row.toggleSelected(!!value)
        },
      }),
  },
  {
    accessorKey: 'name',
    header: ({ column }) =>
      h(
        'button',
        {
          onClick: () => {
            column.toggleSorting()
          },
          type: 'button',
        },
        t('common.name'),
      ),
    cell: ({ row }) =>
      h(TableLink, { to: `/products/${encodeURIComponent(row.original.id)}`, label: row.original.name }),
  },
  {
    accessorKey: 'price',
    header: ({ column }) =>
      h(
        'button',
        {
          onClick: () => {
            column.toggleSorting()
          },
          type: 'button',
        },
        t('products.price'),
      ),
    cell: ({ row }) =>
      h('span', { 'data-cell': 'price', class: 'block text-right tabular-nums' }, format.money(row.original.price)),
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => h(ProductStatusBadge, { status: row.original.status }),
  },
  {
    id: 'actions',
    header: t('common.actions'),
    cell: ({ row }) =>
      h(RowActions, {
        actions: [
          { id: 'view', label: t('common.view'), allowed: true },
          { id: 'edit', label: t('common.edit'), allowed: props.canWrite },
          { id: 'delete', label: t('products.delete'), allowed: props.canWrite },
        ],
        onAction: (action: string) => {
          emit('action', action, row.original.id)
        },
      }),
  },
])
</script>

<template>
  <DataTable
    :data="data"
    :columns="canWrite ? columns : columns.filter((column) => column.id !== 'select')"
    :loading="loading"
    :error="error"
    :sort="sort"
    :selection="selection"
    :visibility="visibility"
    @sort="emit('sort', $event)"
    @update:selection="emit('update:selection', $event)"
    @retry="emit('retry')"
  />
</template>
