<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useAuth } from '@features/auth/UseAuth'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'

import { usePromotionsQuery } from '../api/Promotions.api'
import PromotionFilters from '../components/PromotionFilters.vue'
import PromotionTable from '../components/PromotionTable.vue'
import { promotionListSchema } from '../schemas/Promotion.schema'
const { t } = useT()
const { can } = useAuth()
const { params, setFilter, setPage, setSort } = useListState(promotionListSchema)
const query = usePromotionsQuery(params)
</script>
<template>
  <div class="space-y-4">
    <PageHeader :title="t('promotions.title')">
      <template #actions>
        <UButton v-if="can('promotion:write')" to="/promotions/new">{{
          t('common.create')
        }}</UButton>
      </template>
    </PageHeader>
    <PromotionFilters
      :search="params.search"
      :status="params.status"
      :type="params.type"
      @filter="setFilter"
    />
    <PromotionTable
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :sort="params.sort"
      :canWrite="can('promotion:write')"
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
