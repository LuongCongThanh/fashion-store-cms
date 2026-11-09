<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { z } from 'zod'

import { useAuth } from '@features/auth/UseAuth'
import { useCustomerQuery } from '@features/customers/api/Customers.api'
import CustomerActivity from '@features/customers/components/CustomerActivity.vue'
import CustomerAddressList from '@features/customers/components/CustomerAddressList.vue'
import CustomerOrderTable from '@features/customers/components/CustomerOrderTable.vue'
import CustomerProfile from '@features/customers/components/CustomerProfile.vue'
import { useOrdersQuery } from '@features/orders/UseOrders'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import PageTabs from '@shared/components/page/PageTabs.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'
const route = useRoute()
const { t } = useT()
const { can } = useAuth()
const query = useCustomerQuery(() => String(route.params.id))
const tabs = computed(() => [
  { id: 'profile', label: t('customers.profile') },
  { id: 'addresses', label: t('customers.addresses') },
  ...(can('order:read') ? [{ id: 'orders', label: t('nav.orders') }] : []),
  { id: 'activity', label: t('customers.activity') },
])
const tab = computed(() => (tabs.value.some((tab) => tab.id === route.query.tab) ? String(route.query.tab) : 'profile'))
const {
  params: orderParams,
  setPage,
  setFilter,
} = useListState(
  z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  }),
)
const orders = useOrdersQuery(
  () => ({ customerId: String(route.params.id), ...orderParams.value, sort: '-createdAt' }),
  () => tab.value === 'orders' && can('order:read'),
)
</script>
<template>
  <LoadingState v-if="query.isPending.value" />
  <ErrorState v-else-if="query.isError.value" :error="query.error.value" @retry="query.refetch()" />
  <div v-else-if="query.data.value" class="space-y-4">
    <PageHeader :title="query.data.value.name" />
    <PageTabs :tabs="tabs" />
    <div role="tabpanel">
      <CustomerProfile v-if="tab === 'profile'" :customer="query.data.value" />
      <CustomerAddressList v-else-if="tab === 'addresses'" :addresses="query.data.value.addresses" />
      <CustomerOrderTable
        v-else-if="tab === 'orders'"
        :data="orders.data.value?.data ?? []"
        :loading="orders.isPending.value"
        :error="orders.error.value"
        @retry="orders.refetch()"
      />
      <CustomerActivity v-else :activity="query.data.value.activity" />
      <DataTablePagination
        v-if="tab === 'orders'"
        :meta="orders.data.value?.meta"
        @page="setPage"
        @pageSize="setFilter('pageSize', $event)"
      />
    </div>
  </div>
</template>
