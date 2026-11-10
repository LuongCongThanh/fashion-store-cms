<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { ref } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import { useInventoryQuery, useStockAdjustMutation } from '@features/inventory/api/Inventory.api'
import InventoryFilters from '@features/inventory/components/InventoryFilters.vue'
import InventoryTable from '@features/inventory/components/InventoryTable.vue'
import StockAdjustDialog from '@features/inventory/components/StockAdjustDialog.vue'
import { inventoryListSchema, stockAdjustSchema } from '@features/inventory/schemas/Inventory.schema'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'

import type { InventoryItem } from '@features/inventory/types/Inventory.types'
const { t } = useT()
const { can } = useAuth()
const { params, setFilter, setPage, setSort } = useListState(inventoryListSchema)
const query = useInventoryQuery(params)
const mutation = useStockAdjustMutation()
const selected = ref<InventoryItem>()
const errors = ref<Record<string, string>>({})
async function adjust(input: { quantity: number; reason: string }) {
  if (!selected.value || !can('inventory:write') || mutation.isPending.value) return
  const parsed = stockAdjustSchema.safeParse(input)
  if (!parsed.success) {
    errors.value = Object.fromEntries(
      parsed.error.issues.map((issue) => [issue.path.join('.'), t('auth.validation.required')]),
    )
    return
  }
  errors.value = {}
  try {
    await mutation.mutateAsync({ id: selected.value.id, ...parsed.data })
    selected.value = undefined
  } catch {
    /* Global mutation policy displays API errors. */
  }
}
function openAdjust(item: InventoryItem) {
  selected.value = item
  errors.value = {}
}
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('inventory.title')">
      <template #actions>
        <UButton to="/inventory/movements" variant="outline">{{ t('inventory.movements') }}</UButton>
      </template>
    </PageHeader>
    <InventoryFilters :search="params.search" :status="params.status" @filter="setFilter" />
    <InventoryTable
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :sort="params.sort"
      :canWrite="can('inventory:write')"
      @sort="setSort"
      @retry="query.refetch()"
      @adjust="openAdjust"
    />
    <DataTablePagination
      v-if="!query.isPending.value && !query.isError.value && query.data.value?.meta"
      :meta="query.data.value?.meta"
      @page="setPage"
      @pageSize="setFilter('pageSize', $event)"
    />
    <StockAdjustDialog
      v-if="selected"
      :key="selected.id"
      :open="true"
      :sku="selected.sku"
      :pending="mutation.isPending.value"
      :errors="errors"
      @close="selected = undefined"
      @submit="adjust"
    />
  </div>
</template>
