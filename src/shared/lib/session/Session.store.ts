import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import type { Ref } from 'vue'

const ACCESS_KEY = 'cms.session.accessToken'
const REFRESH_KEY = 'cms.session.refreshToken'

/** sessionStorage (chỉ tab này) ưu tiên hơn localStorage (Remember me). */
function readToken(key: string): string | null {
  return sessionStorage.getItem(key) ?? localStorage.getItem(key)
}

function writeToken(key: string, value: string | null, keep: Storage, drop: Storage) {
  drop.removeItem(key)
  if (value === null) keep.removeItem(key)
  else keep.setItem(key, value)
}

/**
 * State thô của Session. Token nằm ở localStorage (Remember me) hoặc sessionStorage (chỉ tab này);
 * storeId luôn ở localStorage. Nội bộ `session/` — bên ngoài dùng `useSession()`.
 */
export const useSessionStore = defineStore('session', () => {
  const remember = ref(sessionStorage.getItem(ACCESS_KEY) === null)
  const accessToken = ref(readToken(ACCESS_KEY))
  const refreshToken = ref(readToken(REFRESH_KEY))
  const storeId = useLocalStorage<string | null>('cms.session.storeId', null)

  watch(
    [accessToken, refreshToken, remember],
    () => {
      const [keep, drop] = remember.value
        ? [localStorage, sessionStorage]
        : [sessionStorage, localStorage]
      writeToken(ACCESS_KEY, accessToken.value, keep, drop)
      writeToken(REFRESH_KEY, refreshToken.value, keep, drop)
    },
    { flush: 'sync' },
  )

  // Đồng bộ giữa các tab: tab khác logout / xoay token trong localStorage → tab này nhận theo.
  // Chỉ áp dụng khi tab này đang dùng localStorage; Session chỉ-tab-này không bị tab khác ghi đè.
  const byKey: Record<string, Ref<string | null>> = {
    [ACCESS_KEY]: accessToken,
    [REFRESH_KEY]: refreshToken,
  }
  window.addEventListener('storage', (event) => {
    const target = event.key ? byKey[event.key] : undefined
    if (event.storageArea !== localStorage || !remember.value) return
    if (target) target.value = event.newValue
    else if (event.key === null) {
      // localStorage.clear() ở tab khác
      accessToken.value = null
      refreshToken.value = null
    }
  })

  return { accessToken, refreshToken, remember, storeId }
})
