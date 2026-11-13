<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import DataTable from '@shared/components/table/DataTable.vue'
import TableLink from '@shared/components/table/TableLink.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Size } from '@features/sizes/types/Size.types'

const props = defineProps<{ data: Size[]; loading: boolean; error?: unknown; canWrite: boolean }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<Size>[]>(() => [
  {
    accessorKey: 'code',
    header: t('sizes.code'),
    cell: ({ row }) =>
      props.canWrite
        ? h(TableLink, { to: `/sizes/${encodeURIComponent(row.original.id)}/edit`, label: row.original.code })
        : row.original.code,
  },
  { accessorKey: 'name', header: t('common.name') },
  { accessorKey: 'sortOrder', header: t('sizes.sortOrder') },
  {
    accessorKey: 'isHidden',
    header: t('common.status'),
    cell: ({ row }) =>
      h(StatusBadge, {
        label: row.original.isHidden ? t('sizes.hidden') : t('sizes.visible'),
        color: row.original.isHidden ? 'neutral' : 'success',
      }),
  },
])
</script>

<template>
  <DataTable :data="data" :columns="columns" :loading="loading" :error="error" @retry="emit('retry')" />
</template>
