// Thay `virtual:pwa-register/vue` khi chạy test: vitest không nạp được virtual module của vite-plugin-pwa.
import { ref } from 'vue'

export function useRegisterSW() {
  return { needRefresh: ref(false), offlineReady: ref(false), updateServiceWorker: async () => {} }
}
