<script setup lang="ts">
import { useStockMovementsQuery } from '@features/inventory/api/Inventory.api'
import StockMovementFilters from '@features/inventory/components/StockMovementFilters.vue'
import StockMovementTable from '@features/inventory/components/StockMovementTable.vue'
import { movementListSchema } from '@features/inventory/schemas/Inventory.schema'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import DataTableToolbar from '@shared/components/table/DataTableToolbar.vue'
import { useListState } from '@shared/composables/UseListState'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'
const { t, tn } = useT()
const format = useFormat()
const { params, setFilter, setPage, setSort } = useListState(movementListSchema)
const query = useStockMovementsQuery(params)
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('inventory.movements')" />
    <StockMovementFilters :params="params" @filter="setFilter" />
    <DataTableToolbar
      :title="
        tn('common.results', query.data.value?.meta.total ?? 0, { n: format.number(query.data.value?.meta.total ?? 0) })
      "
      :count="0"
    />
    <StockMovementTable
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :sort="params.sort"
      @sort="setSort"
      @retry="query.refetch()"
    />
    <DataTablePagination :meta="query.data.value?.meta" @page="setPage" @pageSize="setFilter('pageSize', $event)" />
  </div>
</template>
