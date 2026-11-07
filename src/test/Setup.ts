// Chỉ thiết lập môi trường, không gắn plugin dùng chung.
import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach } from 'vitest'

// Unmount mọi wrapper sau mỗi test: Nuxt UI dùng shared composable (locale, toast) — không unmount là rò state.
enableAutoUnmount(afterEach)

afterEach(() => {
  globalThis.localStorage?.clear()
  globalThis.sessionStorage?.clear()
})
