<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { useLocalStorage } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useCategoriesQuery } from '@features/categories/UseCategories'
import { useProductBulkMutation, useProductsQuery } from '@features/products/api/Products.api'
import ProductFilters from '@features/products/components/ProductFilters.vue'
import ProductStatusPresets from '@features/products/components/ProductStatusPresets.vue'
import ProductTable from '@features/products/components/ProductTable.vue'
import { useProductStatusPresets } from '@features/products/composables/UseProductStatusPresets'
import { productListSchema } from '@features/products/schemas/ProductList.schema'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import DataTableToolbar from '@shared/components/table/DataTableToolbar.vue'
import { useListState } from '@shared/composables/UseListState'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

const { t, tn } = useT()
const format = useFormat()
const { can } = useAuth()
const confirm = useConfirm()
const router = useRouter()
const { params, setFilter, setPage, setSort, reset } = useListState(productListSchema)
const query = useProductsQuery(params)
const statusPresets = useProductStatusPresets(params)
const categories = useCategoriesQuery()
const mutation = useProductBulkMutation()
const selection = ref<Record<string, boolean>>({})
const visibility = useLocalStorage<Record<string, boolean>>('cms.columns.products', {})
const ids = computed(() => Object.keys(selection.value).filter((id) => selection.value[id]))
watch(params, () => {
  selection.value = {}
})
async function bulk(action: 'publish' | 'unpublish' | 'delete', selectedIds = ids.value) {
  if (!can('CATALOG_PRODUCT_MANAGE') || !selectedIds.length) return
  if (
    !(await confirm({
      title: t(`products.${action}`),
      color: action === 'delete' ? 'error' : 'primary',
    }))
  )
    return
  try {
    await mutation.mutateAsync({ ids: selectedIds, action })
    selection.value = {}
  } catch {
    /* The mutation policy displays the error. */
  }
}
function rowAction(action: string, id: string) {
  if (action === 'delete') void bulk('delete', [id])
  else void router.push(`/products/${encodeURIComponent(id)}${action === 'edit' ? '/edit' : ''}`)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader :title="t('dashboard.products')">
      <template #actions>
        <UButton v-if="can('CATALOG_PRODUCT_MANAGE')" to="/products/new">{{ t('common.create') }}</UButton>
      </template>
    </PageHeader>
    <ProductStatusPresets
      :presets="statusPresets.presets.value"
      :activeStatus="params.status"
      :hasError="statusPresets.hasError.value"
      @retry="statusPresets.retry"
    />
    <ProductFilters :params="params" :categories="categories.data.value ?? []" @filter="setFilter" @clear="reset" />
    <DataTableToolbar
      v-model:visibility="visibility"
      :title="
        tn('common.results', query.data.value?.meta.total ?? 0, { n: format.number(query.data.value?.meta.total ?? 0) })
      "
      :count="can('CATALOG_PRODUCT_MANAGE') ? ids.length : 0"
      :columns="[
        { id: 'name', label: t('common.name') },
        { id: 'price', label: t('products.price') },
        { id: 'status', label: t('common.status') },
      ]"
      @clear="selection = {}"
    >
      <template #bulk>
        <UButton
          v-for="action in ['publish', 'unpublish', 'delete'] as const"
          :key="action"
          :data-action="`bulk-${action}`"
          :color="action === 'delete' ? 'error' : 'neutral'"
          variant="outline"
          size="sm"
          :loading="mutation.isPending.value"
          @click="bulk(action)"
          >{{ t(`products.${action}`) }}</UButton
        >
      </template>
    </DataTableToolbar>
    <ProductTable
      v-model:selection="selection"
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :sort="params.sort"
      :visibility="visibility"
      :canWrite="can('CATALOG_PRODUCT_MANAGE')"
      @sort="setSort"
      @retry="query.refetch()"
      @action="rowAction"
    />
    <DataTablePagination
      v-if="!query.isPending.value && !query.isError.value && query.data.value?.meta"
      :meta="query.data.value?.meta"
      @page="setPage"
      @pageSize="setFilter('pageSize', $event)"
    />
  </div>
</template>
