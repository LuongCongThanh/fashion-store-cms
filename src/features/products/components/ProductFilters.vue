<script setup lang="ts">
import UFormField from '@nuxt/ui/components/FormField.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import { computed } from 'vue'

import FilterBar from '@shared/components/list/FilterBar.vue'
import FilterSelect from '@shared/components/list/FilterSelect.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { Category } from '@features/categories/types/Category.types'
import type { ProductListParams } from '@features/products/schemas/ProductList.schema'
const props = defineProps<{ params: ProductListParams; categories: Category[] }>()
const emit = defineEmits<{ filter: [key: string, value: unknown] }>()
const { t } = useT()

const STATUSES = ['draft', 'published', 'archived'] as const
const statusItems = computed(() => STATUSES.map((value) => ({ label: t(`products.status.${value}`), value })))
const categoryItems = computed(() => props.categories.map((category) => ({ label: category.name, value: category.id })))
</script>

<template>
  <FilterBar>
    <ListSearch :modelValue="params.search" @update:modelValue="emit('filter', 'search', $event)" />
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
    <UFormField
      v-for="key in ['minPrice', 'maxPrice'] as const"
      :key="key"
      :label="t(`products.${key}`)"
      :name="key"
      size="sm"
    >
      <UInput
        :name="key"
        type="number"
        min="0"
        :modelValue="params[key]"
        class="w-32"
        @change="emit('filter', key, ($event.target as HTMLInputElement).value)"
      />
    </UFormField>
  </FilterBar>
</template>
