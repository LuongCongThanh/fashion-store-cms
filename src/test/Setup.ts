// Chỉ thiết lập môi trường, không gắn plugin dùng chung.
import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach } from 'vitest'

// Unmount mọi wrapper sau mỗi test: Nuxt UI dùng shared composable (locale, toast) — không unmount là rò state.
enableAutoUnmount(afterEach)

// Spec chạy ở `@vitest-environment node` không có Web Storage dù type DOM khai báo luôn có.
afterEach(() => {
  /* eslint-disable @typescript-eslint/no-unnecessary-condition */
  globalThis.localStorage?.clear()
  globalThis.sessionStorage?.clear()
  /* eslint-enable @typescript-eslint/no-unnecessary-condition */
})

// jsdom không có `scrollIntoView`; listbox của USelectMenu gọi nó khi highlight option.
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = () => {}
/* eslint-enable @typescript-eslint/no-unnecessary-condition */
