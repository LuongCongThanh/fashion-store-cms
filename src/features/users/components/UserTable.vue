<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import DataTable from '@shared/components/table/DataTable.vue'
import RowActions from '@shared/components/table/RowActions.vue'
import { sortHeader } from '@shared/components/table/SortHeader'
import TableLink from '@shared/components/table/TableLink.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { StaffUser } from '@features/users/types/User.types'
const props = defineProps<{
  data: StaffUser[]
  loading: boolean
  error?: unknown
  sort: string
  canWrite: boolean
}>()
const emit = defineEmits<{
  sort: [value: string]
  retry: []
  action: [action: string, id: string]
}>()
const { t } = useT()
const columns = computed<TableColumn<StaffUser>[]>(() => [
  {
    accessorKey: 'name',
    header: ({ column }) => sortHeader(column, t('common.name')),
    cell: ({ row }) =>
      props.canWrite
        ? h(TableLink, { to: `/users/${encodeURIComponent(row.original.id)}/edit`, label: row.original.name })
        : row.original.name,
  },
  { accessorKey: 'email', header: t('auth.login.email') },
  { id: 'roles', header: t('roles.title'), cell: ({ row }) => row.original.roleIds.join(', ') },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) =>
      h(StatusBadge, {
        label: t(`common.${row.original.status}`),
        color: row.original.status === 'active' ? 'success' : 'neutral',
      }),
  },
  {
    id: 'actions',
    header: t('common.actions'),
    cell: ({ row }) =>
      h(RowActions, {
        actions: [{ id: 'edit', label: t('common.edit'), allowed: props.canWrite }],
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
    :columns="columns"
    :loading="loading"
    :error="error"
    :sort="sort"
    @sort="emit('sort', $event)"
    @retry="emit('retry')"
  />
</template>
