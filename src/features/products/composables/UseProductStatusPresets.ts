import { computed, toValue } from 'vue'
import { useRoute } from 'vue-router'

import type { MaybeRefOrGetter } from 'vue'

import { useProductsQuery } from '@features/products/api/Products.api'
import { PRODUCT_STATUSES } from '@features/products/types/Product.types'
import { useFormat } from '@shared/lib/format/Format'
import { useT } from '@shared/lib/i18n/I18n'

import type { ProductListParams } from '@features/products/schemas/ProductList.schema'

export function useProductStatusPresets(params: MaybeRefOrGetter<ProductListParams>) {
  const route = useRoute()
  const format = useFormat()
  const { t } = useT()
  const statuses = [undefined, ...PRODUCT_STATUSES] as const
  const queries = statuses.map((status) =>
    useProductsQuery(
      computed(() => ({
        ...toValue(params),
        page: 1,
        pageSize: 1,
        status,
      })),
    ),
  )
  const presets = computed(() =>
    statuses.map((status, index) => ({
      label: status
        ? t(status === 'published' ? 'products.statusPresets.published' : `products.status.${status}`)
        : t('common.all'),
      status,
      count: format.number(queries[index]?.data.value?.meta.total ?? 0),
      isPending: queries[index]?.isPending.value ?? true,
      to: { query: { ...route.query, status, page: '1' } },
    })),
  )
  const hasError = computed(() => queries.some((query) => query.isError.value))

  return {
    presets,
    hasError,
    retry: () => Promise.all(queries.map((query) => query.refetch())),
  }
}
