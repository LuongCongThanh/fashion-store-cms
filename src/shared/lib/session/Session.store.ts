import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const TOKEN_KEYS = {
  accessToken: 'cms.session.accessToken',
  refreshToken: 'cms.session.refreshToken',
} as const

function read(key: string): string | null {
  return sessionStorage.getItem(key) ?? localStorage.getItem(key)
}

/**
 * State thô của Session. Token nằm ở localStorage (Remember me) hoặc sessionStorage (chỉ tab này);
 * storeId luôn ở localStorage. Nội bộ `session/` — bên ngoài dùng `useSession()`.
 */
export const useSessionStore = defineStore('session', () => {
  const remember = ref(sessionStorage.getItem(TOKEN_KEYS.accessToken) === null)
  const accessToken = ref(read(TOKEN_KEYS.accessToken))
  const refreshToken = ref(read(TOKEN_KEYS.refreshToken))
  const storeId = useLocalStorage<string | null>('cms.session.storeId', null)

  watch(
    [accessToken, refreshToken, remember],
    () => {
      const [keep, drop] = remember.value
        ? [localStorage, sessionStorage]
        : [sessionStorage, localStorage]
      for (const [field, key] of Object.entries(TOKEN_KEYS)) {
        const value = field === 'accessToken' ? accessToken.value : refreshToken.value
        drop.removeItem(key)
        if (value === null) keep.removeItem(key)
        else keep.setItem(key, value)
      }
    },
    { flush: 'sync' },
  )

  return { accessToken, refreshToken, remember, storeId }
})
