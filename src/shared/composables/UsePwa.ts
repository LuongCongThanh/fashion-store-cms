import { useEventListener } from '@vueuse/core'
import { useRegisterSW } from 'virtual:pwa-register/vue'

const CHECK_INTERVAL = 60 * 60 * 1000

/** Đăng ký SW; báo khi có bản mới (§R.2). Kiểm tra mỗi 60 phút và khi tab được focus lại. */
export function usePwa() {
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      if (!reg) return
      setInterval(() => void reg.update(), CHECK_INTERVAL)
      useEventListener(document, 'visibilitychange', () => {
        if (document.visibilityState === 'visible') void reg.update()
      })
    },
  })
  return { needRefresh, reload: () => updateServiceWorker(true) }
}
