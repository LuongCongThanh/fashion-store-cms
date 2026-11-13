<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import DataTable from '@shared/components/table/DataTable.vue'
import TableLink from '@shared/components/table/TableLink.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Color } from '@features/colors/types/Color.types'

const props = defineProps<{ data: Color[]; loading: boolean; error?: unknown; canWrite: boolean }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<Color>[]>(() => [
  {
    accessorKey: 'code',
    header: t('colors.code'),
    cell: ({ row }) =>
      props.canWrite
        ? h(TableLink, { to: `/colors/${encodeURIComponent(row.original.id)}/edit`, label: row.original.code })
        : row.original.code,
  },
  { accessorKey: 'name', header: t('common.name') },
  {
    accessorKey: 'hex',
    header: t('colors.hex'),
    cell: ({ row }) =>
      h('span', { class: 'inline-flex items-center gap-2' }, [
        h('span', {
          class: 'size-4 rounded border border-default',
          style: { backgroundColor: row.original.hex },
          'aria-hidden': 'true',
        }),
        row.original.hex,
      ]),
  },
  {
    accessorKey: 'isHidden',
    header: t('common.status'),
    cell: ({ row }) =>
      h(StatusBadge, {
        label: row.original.isHidden ? t('colors.hidden') : t('colors.visible'),
        color: row.original.isHidden ? 'neutral' : 'success',
      }),
  },
])
</script>

<template>
  <DataTable :data="data" :columns="columns" :loading="loading" :error="error" @retry="emit('retry')" />
</template>
