<script setup lang="ts">
import { useCustomersQuery } from '@features/customers/api/Customers.api'
import CustomerFilters from '@features/customers/components/CustomerFilters.vue'
import CustomerTable from '@features/customers/components/CustomerTable.vue'
import { customerListSchema } from '@features/customers/schemas/CustomerList.schema'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import DataTableToolbar from '@shared/components/table/DataTableToolbar.vue'
import { useListState } from '@shared/composables/UseListState'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'
const { t, tn } = useT()
const format = useFormat()
const { params, setFilter, setPage, setSort } = useListState(customerListSchema)
const query = useCustomersQuery(params)
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('dashboard.customers')" />
    <CustomerFilters :search="params.search" :status="params.status" @filter="setFilter" />
    <DataTableToolbar
      :title="
        tn('common.results', query.data.value?.meta.total ?? 0, { n: format.number(query.data.value?.meta.total ?? 0) })
      "
      :count="0"
    />
    <CustomerTable
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
