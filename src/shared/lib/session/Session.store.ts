import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * State thô của Session. Access token chỉ nằm trong bộ nhớ; refresh cookie do BE sở hữu.
 * storeId luôn ở localStorage. Nội bộ `session/` — bên ngoài dùng `useSession()`.
 */
export const useSessionStore = defineStore('session', () => {
  const accessToken = ref<string | null>(null)
  const storeId = useLocalStorage<string | null>('cms.session.storeId', null)

  return { accessToken, storeId }
})
