import { useQueries } from '@tanstack/vue-query'
import { computed } from 'vue'

import type { ComputedRef } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'
import { useLocale } from '@shared/lib/i18n/I18n'

import type { DashboardPayload, DashboardWidget } from '@features/dashboard/types/Dashboard.types'
import type { components } from '@shared/lib/api/Api.generated'

type PaginatedProductResponseDto = components['schemas']['PaginatedProductResponseDto']

/**
 * `products` đếm từ API danh sách sản phẩm (meta.total). Widget khác chưa có hợp đồng API
 * (báo cáo doanh thu, đơn hàng, tồn kho — Tier 1/2) và chỉ hiện khi quyền thật thay `PendingPermission`.
 */
export function useDashboardQuery(widgets: ComputedRef<DashboardWidget[]>) {
  const http = useHttpClient()
  const { locale } = useLocale()
  async function load(key: string, signal: AbortSignal): Promise<DashboardPayload> {
    if (key === 'products') {
      const dto = (await http.get('/admin/products', {
        signal,
        query: { page: 1, limit: 1 },
      })) as PaginatedProductResponseDto
      return { value: dto.meta.total }
    }
    return http.get(`/dashboard/${key}`, { signal }) as Promise<DashboardPayload>
  }
  return useQueries({
    queries: computed(() =>
      widgets.value.map((widget) => ({
        queryKey: ['dashboard', locale.value, widget.key],
        queryFn: ({ signal }: { signal: AbortSignal }) => load(widget.key, signal),
      })),
    ),
  })
}
