<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import DataTable from '@shared/components/table/DataTable.vue'
import TableLink from '@shared/components/table/TableLink.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Role } from '@features/roles/types/Role.types'
defineProps<{
  data: Role[]
  loading: boolean
  error?: unknown
}>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<Role>[]>(() => [
  {
    accessorKey: 'name',
    header: t('common.name'),
    cell: ({ row }) =>
      h('span', { class: 'inline-flex items-center gap-2' }, [
        h(TableLink, { to: `/roles/${encodeURIComponent(row.original.id)}/edit`, label: row.original.name }),
        row.original.isSystem ? h(StatusBadge, { label: t('roles.system'), color: 'neutral' }) : null,
      ]),
  },
  {
    accessorKey: 'description',
    header: t('roles.description'),
    cell: ({ row }) => row.original.description ?? '',
  },
  {
    id: 'permissions',
    header: t('roles.permissions'),
    cell: ({ row }) => row.original.permissions.length,
  },
  {
    accessorKey: 'accountCount',
    header: t('roles.accounts'),
  },
])
</script>

<template>
  <DataTable :data="data" :columns="columns" :loading="loading" :error="error" @retry="emit('retry')" />
</template>
