<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { ref } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'

import { useInventoryQuery, useStockAdjustMutation } from '../api/Inventory.api'
import InventoryFilters from '../components/InventoryFilters.vue'
import InventoryTable from '../components/InventoryTable.vue'
import StockAdjustDialog from '../components/StockAdjustDialog.vue'
import { inventoryListSchema, stockAdjustSchema } from '../schemas/Inventory.schema'

import type { InventoryItem } from '../types/Inventory.types'
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
        <UButton to="/inventory/movements" variant="outline">{{
          t('inventory.movements')
        }}</UButton>
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
