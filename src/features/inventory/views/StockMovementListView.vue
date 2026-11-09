<script setup lang="ts">
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'

import { useStockMovementsQuery } from '../api/Inventory.api'
import StockMovementFilters from '../components/StockMovementFilters.vue'
import StockMovementTable from '../components/StockMovementTable.vue'
import { movementListSchema } from '../schemas/Inventory.schema'
const { t } = useT()
const { params, setFilter, setPage, setSort } = useListState(movementListSchema)
const query = useStockMovementsQuery(params)
</script>
<template>
  <div class="space-y-4">
    <PageHeader :title="t('inventory.movements')" />
    <StockMovementFilters :params="params" @filter="setFilter" />
    <StockMovementTable
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :sort="params.sort"
      @sort="setSort"
      @retry="query.refetch()"
    />
    <DataTablePagination
      :meta="query.data.value?.meta"
      @page="setPage"
      @pageSize="setFilter('pageSize', $event)"
    />
  </div>
</template>
