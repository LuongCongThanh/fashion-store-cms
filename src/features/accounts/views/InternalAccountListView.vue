<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useInternalAccountsQuery } from '@features/accounts/api/InternalAccounts.api'
import InternalAccountTable from '@features/accounts/components/InternalAccountTable.vue'
import { internalAccountListSchema } from '@features/accounts/schemas/InternalAccount.schema'
import { useAuth } from '@features/auth/UseAuth'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'
const { t } = useT()
const { can } = useAuth()
const { params, setFilter, setPage } = useListState(internalAccountListSchema)
const query = useInternalAccountsQuery(params)
</script>

<template>
  <div class="space-y-4">
    <PageHeader :title="t('internalAccounts.title')">
      <template #actions>
        <UButton v-if="can('ADMINISTRATION_INTERNAL_ACCOUNT_MANAGE')" to="/internal-accounts/new">{{
          t('common.create')
        }}</UButton>
      </template>
    </PageHeader>
    <InternalAccountTable
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
