import { useQueries } from '@tanstack/vue-query'
import { computed } from 'vue'

import type { ComputedRef } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'
import { useLocale } from '@shared/lib/i18n/I18n'

import type { DashboardPayload, DashboardWidget } from '../types/Dashboard.types'

export function useDashboardQuery(widgets: ComputedRef<DashboardWidget[]>) {
  const http = useHttpClient()
  const { locale } = useLocale()
  return useQueries({
    queries: computed(() =>
      widgets.value.map((widget) => ({
        queryKey: ['dashboard', locale.value, widget.key],
        queryFn: ({ signal }: { signal: AbortSignal }) =>
          http.get(`/dashboard/${widget.key}`, { signal }) as Promise<DashboardPayload>,
      })),
    ),
  })
}
