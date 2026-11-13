<script setup lang="ts">
import { computed, h } from 'vue'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import DataTable from '@shared/components/table/DataTable.vue'
import TableLink from '@shared/components/table/TableLink.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { Category } from '@features/categories/types/Category.types'
import type { ProductListItem } from '@features/products/types/Product.types'

import ProductStatusBadge from './ProductStatusBadge.vue'

const props = defineProps<{ data: ProductListItem[]; loading: boolean; error?: unknown; categories: Category[] }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useT()
const format = useFormat()
const categoryName = computed(() => new Map(props.categories.map((category) => [category.id, category.name])))
const columns = computed<TableColumn<ProductListItem>[]>(() => [
  {
    accessorKey: 'name',
    header: t('common.name'),
    cell: ({ row }) =>
      h(TableLink, { to: `/products/${encodeURIComponent(row.original.id)}/edit`, label: row.original.name }),
  },
  {
    accessorKey: 'categoryId',
    header: t('products.category'),
    cell: ({ row }) => categoryName.value.get(row.original.categoryId) ?? '—',
  },
  {
    accessorKey: 'status',
    header: t('common.status'),
    cell: ({ row }) => h(ProductStatusBadge, { status: row.original.status }),
  },
  {
    accessorKey: 'updatedAt',
    header: t('products.updatedAt'),
    cell: ({ row }) => format.dateTime(row.original.updatedAt),
  },
])
</script>

<template>
  <DataTable :data="data" :columns="columns" :loading="loading" :error="error" @retry="emit('retry')" />
</template>
