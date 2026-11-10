import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { CurrentUser } from '@features/auth/types/Auth.types'

/** Staff user hiện tại — nội bộ feature, ngoài feature dùng useAuth(). */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<CurrentUser | null>(null)
  let inflight: Promise<void> | null = null

  function loadUser(fetchMe: () => Promise<CurrentUser>) {
    inflight ??= fetchMe()
      .then((me) => {
        user.value = me
      })
      .finally(() => {
        inflight = null
      })
    return inflight
  }

  function setUser(value: CurrentUser) {
    user.value = value
  }

  function clearUser() {
    user.value = null
  }

  return { user, loadUser, setUser, clearUser }
})
