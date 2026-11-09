import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'
import { useLocale } from '@shared/lib/i18n/I18n'

import type { ProductCategoryOption } from '../types/Product.types'
export function useProductCategoriesQuery() {
  const http = useHttpClient()
  const { locale } = useLocale()
  return useQuery({
    queryKey: computed(() => ['categories', locale.value]),
    queryFn: ({ signal }) =>
      http.get('/categories', { signal }) as Promise<ProductCategoryOption[]>,
  })
}
