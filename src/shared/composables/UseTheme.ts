import { useColorMode } from '@vueuse/core'

/** Key DUY NHẤT của chế độ màu — phải khớp script chống nháy trong index.html (§L.11). */
export const COLOR_MODE_KEY = 'cms.colorMode'

export type ThemeMode = 'auto' | 'dark' | 'light'

/** Chế độ màu Sáng / Tối / Theo hệ thống (mặc định). Gắn class `dark` lên <html>. */
export function useTheme() {
  const { store } = useColorMode({ storageKey: COLOR_MODE_KEY, initialValue: 'auto' })
  return { mode: store }
}
