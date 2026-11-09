<script setup lang="ts">
import FilterBar from '@shared/components/list/FilterBar.vue'
import ListSearch from '@shared/components/list/ListSearch.vue'
import { useT } from '@shared/lib/i18n/I18n'

import type { ProductListParams } from '../schemas/ProductList.schema'
import type { ProductCategoryOption as Category } from '../types/Product.types'
defineProps<{ params: ProductListParams; categories: Category[] }>()
const emit = defineEmits<{ filter: [key: string, value: unknown] }>()
const { t } = useT()
</script>
<template>
  <FilterBar>
    <ListSearch :modelValue="params.search" @update:modelValue="emit('filter', 'search', $event)" />
    <label
      >{{ t('common.status')
      }}<select
        name="status"
        :value="params.status ?? ''"
        @change="emit('filter', 'status', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">{{ t('common.all') }}</option>
        <option
          v-for="status in ['draft', 'published', 'archived'] as const"
          :key="status"
          :value="status"
        >
          {{ t(`products.status.${status}`) }}
        </option>
      </select>
    </label>
    <label
      >{{ t('products.category')
      }}<select
        name="categoryId"
        :value="params.categoryId ?? ''"
        @change="emit('filter', 'categoryId', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">{{ t('common.all') }}</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </label>
    <label v-for="key in ['minPrice', 'maxPrice'] as const" :key="key"
      >{{ t(`products.${key}`)
      }}<input
        :name="key"
        type="number"
        min="0"
        :value="params[key]"
        @change="emit('filter', key, ($event.target as HTMLInputElement).value)"
      />
    </label>
  </FilterBar>
</template>
