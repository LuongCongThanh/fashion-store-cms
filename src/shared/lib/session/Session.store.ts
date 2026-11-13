import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * State thô của Session. Access token chỉ nằm trong bộ nhớ; refresh cookie do BE sở hữu.
 * Nội bộ `session/` — bên ngoài dùng `useSession()`.
 */
export const useSessionStore = defineStore('session', () => {
  const accessToken = ref<string | null>(null)

  return { accessToken }
})
