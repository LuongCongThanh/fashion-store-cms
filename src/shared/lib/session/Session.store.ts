import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

/** State thô của Session (token + storeId), persist ở localStorage. Nội bộ `session/` — bên ngoài dùng `useSession()`. */
export const useSessionStore = defineStore('session', () => {
  const accessToken = useLocalStorage<string | null>('cms.session.accessToken', null)
  const refreshToken = useLocalStorage<string | null>('cms.session.refreshToken', null)
  const storeId = useLocalStorage<string | null>('cms.session.storeId', null)
  return { accessToken, refreshToken, storeId }
})
