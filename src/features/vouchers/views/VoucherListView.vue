<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useAuth } from '@features/auth/UseAuth'
import { useVouchersQuery } from '@features/vouchers/api/Vouchers.api'
import VoucherFilters from '@features/vouchers/components/VoucherFilters.vue'
import VoucherTable from '@features/vouchers/components/VoucherTable.vue'
import { voucherListSchema } from '@features/vouchers/schemas/Voucher.schema'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
const { can } = useAuth()
const { params, setFilter, setPage } = useListState(voucherListSchema)
const query = useVouchersQuery(params)
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('vouchers.title')">
      <template #actions>
        <UButton v-if="can('PRICING_VOUCHER_MANAGE')" to="/vouchers/new">{{ t('common.create') }}</UButton>
      </template>
    </PageHeader>
    <VoucherFilters :search="params.search" :status="params.status" @filter="setFilter" />
    <VoucherTable
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
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
