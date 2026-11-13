<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import DOMPurify from 'dompurify'
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'

import type { TableColumn } from '@nuxt/ui/components/Table.vue'

import { useAuth } from '@features/auth/UseAuth'
import { ImageGallery } from '@features/media/UseMediaComponents'
import { useProductQuery } from '@features/products/api/ProductEditor.api'
import ProductStatusBadge from '@features/products/components/ProductStatusBadge.vue'
import EmptyState from '@shared/components/feedback/EmptyState.vue'
import ErrorState from '@shared/components/feedback/ErrorState.vue'
import LoadingState from '@shared/components/feedback/LoadingState.vue'
import PageHeader from '@shared/components/page/PageHeader.vue'
import DataTable from '@shared/components/table/DataTable.vue'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

const route = useRoute()
const { can } = useAuth()
const { t } = useT()
const format = useFormat()
const query = useProductQuery(() => String(route.params.id ?? ''))
const description = computed(() => DOMPurify.sanitize(query.data.value?.description ?? ''))
const variants = computed(() =>
  (query.data.value?.variants ?? []).map((variant, index) => ({ ...variant, id: String(index) })),
)
type VariantRow = (typeof variants.value)[number]
const columns = computed<TableColumn<VariantRow>[]>(() => [
  {
    accessorKey: 'sku',
    header: t('products.sku'),
    cell: ({ row }) => h('span', { class: 'font-mono break-all' }, row.original.sku),
  },
  { id: 'variant', header: t('products.variant'), cell: ({ row }) => `${row.original.size} ${row.original.color}` },
  {
    accessorKey: 'price',
    header: t('products.price'),
    meta: { class: { th: 'text-right', td: 'text-right tabular-nums' } },
    cell: ({ row }) => format.money(row.original.price),
  },
  {
    accessorKey: 'stock',
    header: t('products.stock'),
    meta: { class: { th: 'text-right', td: 'text-right tabular-nums' } },
    cell: ({ row }) => format.number(row.original.stock),
  },
])
</script>

<template>
  <LoadingState v-if="query.isPending.value" />
  <ErrorState v-else-if="query.isError.value" :error="query.error.value" @retry="query.refetch()" />
  <div v-else-if="query.data.value" class="min-w-0 space-y-6">
    <PageHeader :title="query.data.value.name">
      <template #actions>
        <UButton
          v-if="can('CATALOG_PRODUCT_MANAGE')"
          :to="`/products/${encodeURIComponent(query.data.value.id)}/edit`"
          >{{ t('common.edit') }}</UButton
        >
      </template>
    </PageHeader>
    <ProductStatusBadge :status="query.data.value.status" />
    <p>
      {{ t('products.price') }}: <span class="tabular-nums">{{ format.money(query.data.value.price) }}</span>
    </p>
    <!-- eslint-disable-next-line vue/no-v-html -- Sanitized through DOMPurify immediately above. -->
    <div data-description v-html="description" />
    <ImageGallery :images="query.data.value.images" :mainId="query.data.value.mainImageId" readonly />
    <DataTable :data="variants" :columns="columns" />
  </div>
  <EmptyState v-else :title="t('common.empty')" />
</template>
