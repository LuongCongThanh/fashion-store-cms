<script setup lang="ts">
import { useCustomersQuery } from '@features/customers/api/Customers.api'
import CustomerFilters from '@features/customers/components/CustomerFilters.vue'
import CustomerTable from '@features/customers/components/CustomerTable.vue'
import { customerListSchema } from '@features/customers/schemas/CustomerList.schema'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
const { params, setFilter, setPage, setSort } = useListState(customerListSchema)
const query = useCustomersQuery(params)
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('dashboard.customers')" />
    <CustomerFilters :search="params.search" :status="params.status" @filter="setFilter" />
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
