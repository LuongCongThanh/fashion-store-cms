<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Promotion } from '@features/promotions/types/Promotion.types'

import PromotionStatusBadge from './PromotionStatusBadge.vue'
const props = defineProps<{
  data: Promotion[]
  loading: boolean
  error?: unknown
  sort: string
  canWrite: boolean
}>()
const emit = defineEmits<{ sort: [value: string]; retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<Promotion>[]>(() => [
  {
    accessorKey: 'name',
    header: ({ column }) =>
      h(
        'button',
        {
          onClick: () => {
            column.toggleSorting()
          },
        },
        t('common.name'),
      ),
    cell: ({ row }) =>
      props.canWrite
        ? h('a', { href: `/promotions/${encodeURIComponent(row.original.id)}/edit` }, row.original.name)
        : row.original.name,
  },
  { accessorKey: 'code', header: t('promotions.code') },
  { accessorKey: 'value', header: t('promotions.value') },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => h(PromotionStatusBadge, { status: row.original.status }),
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
