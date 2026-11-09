<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import TableLink from '@shared/components/table/TableLink.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Role } from '@features/roles/types/Role.types'
const props = defineProps<{
  data: Role[]
  loading: boolean
  error?: unknown
  sort: string
  canWrite: boolean
}>()
const emit = defineEmits<{ sort: [value: string]; retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<Role>[]>(() => [
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
        ? h(TableLink, { to: `/roles/${encodeURIComponent(row.original.id)}/edit`, label: row.original.name })
        : row.original.name,
  },
  {
    id: 'permissions',
    header: t('roles.permissions'),
    cell: ({ row }) => row.original.permissions.length,
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
