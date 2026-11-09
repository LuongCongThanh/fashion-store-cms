<script setup lang="ts">
import { computed } from 'vue'

import { useOrdersQuery } from '@features/orders/api/Orders.api'
import OrderFilters from '@features/orders/components/OrderFilters.vue'
import OrderTable from '@features/orders/components/OrderTable.vue'
import { orderListSchema } from '@features/orders/schemas/OrderList.schema'
import ActiveFilterTags from '@shared/components/list/ActiveFilterTags.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import DataTableToolbar from '@shared/components/table/DataTableToolbar.vue'
import { useListState } from '@shared/composables/UseListState'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'
const { t, tn } = useT()
const format = useFormat()
const { params, setFilter, setPage, setSort, reset } = useListState(orderListSchema)
const query = useOrdersQuery(params)
const filters = computed(() =>
  Object.entries(params.value)
    .filter(([key, value]) => !['page', 'pageSize', 'sort'].includes(key) && value !== '')
    .map(([key, value]) => ({
      key,
      label:
        key === 'status'
          ? t('common.status')
          : key === 'search'
            ? t('common.search')
            : key === 'from' || key === 'to'
              ? t(`common.${key}`)
              : t(`orders.${key as 'paymentStatus' | 'customerId' | 'minAmount' | 'maxAmount'}Label`),
      value: String(value),
    })),
)
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('nav.orders')" />
    <OrderFilters :params="params" @filter="setFilter" />
    <ActiveFilterTags :filters="filters" @remove="setFilter($event, undefined)" @clear="reset" />
    <DataTableToolbar
      :title="tn('common.results', query.data.value?.meta.total ?? 0, { n: format.number(query.data.value?.meta.total ?? 0) })"
      :count="0"
    />
    <OrderTable
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
