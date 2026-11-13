<script setup lang="ts">
import { computed } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { InventoryMovement } from '@features/inventory/types/Inventory.types'
defineProps<{ data: InventoryMovement[]; loading: boolean; error?: unknown; sort: string }>()
const emit = defineEmits<{ sort: [value: string]; retry: [] }>()
const { t } = useT()
const columns = computed<TableColumn<InventoryMovement>[]>(() => [
  { accessorKey: 'sku', header: 'SKU' },
  ...(['type', 'quantity', 'reason', 'reference', 'createdAt', 'createdBy'] as const).map((key) => ({
    accessorKey: key,
    header: t(`inventory.${key}`),
  })),
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
