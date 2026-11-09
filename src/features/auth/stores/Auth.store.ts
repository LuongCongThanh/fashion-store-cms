import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { CurrentUser } from '@features/auth/types/Auth.types'

/** User hiện tại — nội bộ feature, ngoài feature dùng useAuth(). Token nằm ở Session. */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<CurrentUser | null>(null)
  let inflight: Promise<void> | null = null

  /** Tải user một lần; nhiều lời gọi đồng thời dùng chung một request. */
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

  return { user, loadUser }
})
