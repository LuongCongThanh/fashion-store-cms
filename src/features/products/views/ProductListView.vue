<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { useLocalStorage } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import { useCategoriesQuery } from '@features/categories/UseCategories'
import { useProductBulkMutation, useProductsQuery } from '@features/products/api/Products.api'
import ProductFilters from '@features/products/components/ProductFilters.vue'
import ProductTable from '@features/products/components/ProductTable.vue'
import ProductListPrototype from '@features/products/prototype/ProductListPrototype.vue'
import { productListSchema } from '@features/products/schemas/ProductList.schema'
import { useConfirm } from '@shared/components/confirm/UseConfirm'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTableBulkActions from '@shared/components/table/DataTableBulkActions.vue'
import DataTableColumnVisibility from '@shared/components/table/DataTableColumnVisibility.vue'
import DataTablePagination from '@shared/components/table/DataTablePagination.vue'
import { useListState } from '@shared/composables/UseListState'
import { usePrototypeVariant } from '@shared/composables/UsePrototypeVariant'
import { useT } from '@shared/lib/i18n/I18n'

const { t } = useT()
const variant = usePrototypeVariant(['A', 'B', 'C'])
const { can } = useAuth()
const confirm = useConfirm()
const router = useRouter()
const { params, setFilter, setPage, setSort } = useListState(productListSchema)
const query = useProductsQuery(params)
const categories = useCategoriesQuery()
const mutation = useProductBulkMutation()
const selection = ref<Record<string, boolean>>({})
const visibility = useLocalStorage<Record<string, boolean>>('cms.columns.products', {})
const ids = computed(() => Object.keys(selection.value).filter((id) => selection.value[id]))
watch(params, () => {
  selection.value = {}
})
async function bulk(action: 'publish' | 'unpublish' | 'delete', selectedIds = ids.value) {
  if (!can('product:write') || !selectedIds.length) return
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
  <ProductListPrototype v-if="variant" :variant="variant" />
  <div v-else class="space-y-4">
    <PageHeader :title="t('dashboard.products')">
      <template #actions>
        <UButton v-if="can('product:write')" to="/products/new">{{ t('common.create') }}</UButton>
      </template>
    </PageHeader>
    <ProductFilters :params="params" :categories="categories.data.value ?? []" @filter="setFilter" />
    <DataTableColumnVisibility
      v-model="visibility"
      :columns="[
        { id: 'name', label: t('common.name') },
        { id: 'price', label: t('products.price') },
        { id: 'status', label: t('common.status') },
      ]"
    />
    <DataTableBulkActions v-if="can('product:write')" :count="ids.length">
      <UButton
        v-for="action in ['publish', 'unpublish', 'delete'] as const"
        :key="action"
        :data-action="`bulk-${action}`"
        :loading="mutation.isPending.value"
        @click="bulk(action)"
        >{{ t(`products.${action}`) }}</UButton
      >
    </DataTableBulkActions>
    <ProductTable
      v-model:selection="selection"
      :data="query.data.value?.data ?? []"
      :loading="query.isPending.value"
      :error="query.error.value"
      :sort="params.sort"
      :visibility="visibility"
      :canWrite="can('product:write')"
      @sort="setSort"
      @retry="query.refetch()"
      @action="rowAction"
    />
    <DataTablePagination :meta="query.data.value?.meta" @page="setPage" @pageSize="setFilter('pageSize', $event)" />
  </div>
</template>
