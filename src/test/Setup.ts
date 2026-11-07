// Chỉ thiết lập môi trường, không gắn plugin dùng chung.
import { afterEach } from 'vitest'

afterEach(() => {
  globalThis.localStorage?.clear()
})
