// PROTOTYPE (Phase 0.5 UI/UX hardening) — chỉ sống trên branch `prototype/ui-direction`, không merge.
import { computed } from 'vue'
import { useRoute } from 'vue-router'

/** Đọc `?variant=` khi chạy DEV; production luôn trả `null` để view render bình thường. */
export function usePrototypeVariant(keys: readonly string[]) {
  const route = useRoute()
  return computed(() => {
    if (!import.meta.env.DEV) return null
    const value = route.query.variant
    return typeof value === 'string' && keys.includes(value) ? value : null
  })
}
