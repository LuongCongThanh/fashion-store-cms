// PROTOTYPE (Phase 0.5 UI/UX hardening) — chỉ dùng trong route dev `/prototype/*` (Routes.ts, nhánh `import.meta.env.DEV`).
import { computed } from 'vue'
import { useRoute } from 'vue-router'

/** Đọc `?variant=`; giá trị không hợp lệ hoặc thiếu thì về biến thể đầu tiên. */
export function usePrototypeVariant(keys: readonly [string, ...string[]]) {
  const route = useRoute()
  return computed(() => {
    const value = route.query.variant
    return typeof value === 'string' && keys.includes(value) ? value : keys[0]
  })
}
