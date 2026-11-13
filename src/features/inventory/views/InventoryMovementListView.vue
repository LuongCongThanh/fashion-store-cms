<script setup lang="ts">
import { useInventoryMovementsQuery } from '@features/inventory/api/Inventory.api'
import InventoryMovementFilters from '@features/inventory/components/InventoryMovementFilters.vue'
import InventoryMovementTable from '@features/inventory/components/InventoryMovementTable.vue'
import { movementListSchema } from '@features/inventory/schemas/Inventory.schema'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
const { params, setFilter, setPage, setSort } = useListState(movementListSchema)
const query = useInventoryMovementsQuery(params)
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('inventory.movements')" />
    <InventoryMovementFilters :params="params" @filter="setFilter" />
    <InventoryMovementTable
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :sort="params.sort"
      @sort="setSort"
      @retry="query.refetch()"
    />
    <DataTablePagination
      v-if="!query.isPending.value && !query.isError.value && query.data.value?.meta"
      :meta="query.data.value?.meta"
      @page="setPage"
      @pageSize="setFilter('pageSize', $event)"
    />
  </div>
</template>
