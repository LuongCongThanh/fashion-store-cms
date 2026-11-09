import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'

import { useHttpClient } from '@shared/lib/api/client/HttpClient'

import type { LocalizationInput, StoreSettingsInput } from '@features/settings/schemas/Settings.schema'
export function useStoreSettingsQuery() {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['settings', 'store']),
    queryFn: ({ signal }) => http.get('/settings/store', { signal }) as Promise<StoreSettingsInput>,
  })
}
export function useSaveStoreSettingsMutation() {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: StoreSettingsInput) => http.put('/settings/store', input),
    onSuccess: () => client.invalidateQueries({ queryKey: ['settings'] }),
  })
}

export function useLocalizationQuery() {
  const http = useHttpClient()
  return useQuery({
    queryKey: computed(() => ['settings', 'localization']),
    queryFn: ({ signal }) => http.get('/settings/localization', { signal }) as Promise<LocalizationInput>,
  })
}
export function useSaveLocalizationMutation() {
  const http = useHttpClient()
  const client = useQueryClient()
  return useMutation({
    meta: { errorHandling: 'local' },
    mutationFn: (input: LocalizationInput) => http.put('/settings/localization', input),
    onSuccess: () => client.invalidateQueries({ queryKey: ['settings'] }),
  })
}
