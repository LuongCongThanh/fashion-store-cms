<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import { useT } from '@shared/lib/i18n/I18n'

import StockStatusBadge from './StockStatusBadge.vue'

import type { InventoryItem } from '../types/Inventory.types'
const props = defineProps<{
  data: InventoryItem[]
  loading: boolean
  error?: unknown
  sort: string
  canWrite: boolean
}>()
const emit = defineEmits<{ sort: [value: string]; retry: []; adjust: [item: InventoryItem] }>()
const { t } = useT()
const columns = computed<TableColumn<InventoryItem>[]>(() => [
  {
    accessorKey: 'sku',
    header: ({ column }) => h('button', { onClick: () => column.toggleSorting() }, 'SKU'),
  },
  ...(['current', 'reserved', 'available'] as const).map((key) => ({
    accessorKey: key,
    header: t(`inventory.${key}`),
  })),
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => h(StockStatusBadge, { status: row.original.status }),
  },
  ...(props.canWrite
    ? [
        {
          id: 'actions',
          header: t('common.actions'),
          cell: ({ row }: { row: { original: InventoryItem } }) =>
            h(
              UButton,
              { 'data-action': 'adjust', onClick: () => emit('adjust', row.original) },
              () => t('inventory.adjust'),
            ),
        },
      ]
    : []),
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
