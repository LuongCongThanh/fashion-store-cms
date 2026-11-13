<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import TableLink from '@shared/components/table/TableLink.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { Voucher } from '@features/vouchers/types/Voucher.types'

import VoucherStatusBadge from './VoucherStatusBadge.vue'
defineProps<{ data: Voucher[]; loading: boolean; error?: unknown }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useT()
const format = useFormat()
const columns = computed<TableColumn<Voucher>[]>(() => [
  {
    accessorKey: 'code',
    header: t('vouchers.code'),
    cell: ({ row }) =>
      h(TableLink, { to: `/vouchers/${encodeURIComponent(row.original.id)}/edit`, label: row.original.code }),
  },
  {
    accessorKey: 'value',
    header: t('vouchers.discount'),
    cell: ({ row }) =>
      row.original.type === 'PERCENT' ? `${String(row.original.value)}%` : format.money(row.original.value),
  },
  {
    accessorKey: 'usedCount',
    header: t('vouchers.usage'),
    cell: ({ row }) =>
      row.original.totalLimit === null
        ? format.number(row.original.usedCount)
        : `${format.number(row.original.usedCount)} / ${format.number(row.original.totalLimit)}`,
  },
  {
    accessorKey: 'endsAt',
    header: t('vouchers.period'),
    cell: ({ row }) => `${format.dateTime(row.original.startsAt)} – ${format.dateTime(row.original.endsAt)}`,
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => h(VoucherStatusBadge, { status: row.original.status }),
  },
])
</script>

<template>
  <DataTable :data="data" :columns="columns" :loading="loading" :error="error" @retry="emit('retry')" />
</template>
