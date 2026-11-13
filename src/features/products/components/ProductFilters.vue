<script setup lang="ts">
import { computed } from 'vue'

import { PRODUCT_STATUSES } from '@features/products/types/Product.types'
import ActiveFilterTags from '@shared/components/list/ActiveFilterTags.vue'
import FilterBar from '@shared/components/list/FilterBar.vue'
import FilterSelect from '@shared/components/list/FilterSelect.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Category } from '@features/categories/types/Category.types'
import type { ProductListParams } from '@features/products/schemas/ProductList.schema'
const props = defineProps<{ params: ProductListParams; categories: Category[] }>()
const emit = defineEmits<{ filter: [key: string, value: unknown]; clear: [] }>()
const { t } = useT()

const statusItems = computed(() => PRODUCT_STATUSES.map((value) => ({ label: t(`products.status.${value}`), value })))
const categoryItems = computed(() => props.categories.map((category) => ({ label: category.name, value: category.id })))
const activeFilters = computed(() => {
  const filters: { key: string; label: string; value: string }[] = []
  if (props.params.search) filters.push({ key: 'search', label: t('common.search'), value: props.params.search })
  if (props.params.status)
    filters.push({ key: 'status', label: t('common.status'), value: t(`products.status.${props.params.status}`) })
  if (props.params.categoryId) {
    const category = props.categories.find((item) => item.id === props.params.categoryId)
    filters.push({ key: 'categoryId', label: t('products.category'), value: category?.name ?? props.params.categoryId })
  }
  return filters
})
</script>

<template>
  <FilterBar>
    <ListSearch
      :modelValue="params.search"
      size="sm"
      class="w-72 shrink-0"
      @update:modelValue="emit('filter', 'search', $event)"
    />
    <FilterSelect
      name="status"
      :label="t('common.status')"
      :modelValue="params.status"
      :items="statusItems"
      @update:modelValue="emit('filter', 'status', $event)"
    />
    <FilterSelect
      name="categoryId"
      :label="t('products.category')"
      :modelValue="params.categoryId"
      :items="categoryItems"
      @update:modelValue="emit('filter', 'categoryId', $event)"
    />
    <ActiveFilterTags :filters="activeFilters" @remove="emit('filter', $event, undefined)" @clear="emit('clear')" />
  </FilterBar>
</template>
