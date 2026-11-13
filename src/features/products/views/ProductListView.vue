<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

import { useAuth } from '@features/auth/UseAuth'
import { useCategoriesQuery } from '@features/categories/UseCategories'
import { useProductsQuery } from '@features/products/api/Products.api'
import ProductFilters from '@features/products/components/ProductFilters.vue'
import ProductTable from '@features/products/components/ProductTable.vue'
import { productListSchema } from '@features/products/schemas/ProductList.schema'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { useT } from '@shared/lib/i18n/I18n'

const { t } = useT()
const { can } = useAuth()
const { params, setFilter, setPage, reset } = useListState(productListSchema)
const query = useProductsQuery(params)
const categories = useCategoriesQuery()
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('dashboard.products')">
      <template #actions>
        <UButton v-if="can('CATALOG_PRODUCT_MANAGE')" to="/products/new">{{ t('common.create') }}</UButton>
      </template>
    </PageHeader>
    <ProductFilters :params="params" :categories="categories.data.value ?? []" @filter="setFilter" @clear="reset" />
    <ProductTable
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :categories="categories.data.value ?? []"
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
