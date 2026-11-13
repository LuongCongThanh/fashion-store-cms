<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import StatusBadge from '@shared/components/feedback/StatusBadge.vue'
import DataTable from '@shared/components/table/DataTable.vue'
import TableLink from '@shared/components/table/TableLink.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { InternalAccount } from '@features/accounts/types/InternalAccount.types'

defineProps<{ data: InternalAccount[]; loading: boolean; error?: unknown }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<InternalAccount>[]>(() => [
  {
    accessorKey: 'name',
    header: t('common.name'),
    cell: ({ row }) =>
      h(TableLink, { to: `/internal-accounts/${encodeURIComponent(row.original.id)}/edit`, label: row.original.name }),
  },
  { accessorKey: 'email', header: t('auth.login.email') },
  { id: 'roles', header: t('roles.title'), cell: ({ row }) => row.original.roles.map((role) => role.name).join(', ') },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) =>
      h(StatusBadge, {
        label: row.original.status === 'ACTIVE' ? t('common.active') : t('common.inactive'),
        color: row.original.status === 'ACTIVE' ? 'success' : 'neutral',
      }),
  },
])
</script>

<template>
  <DataTable :data="data" :columns="columns" :loading="loading" :error="error" @retry="emit('retry')" />
</template>
