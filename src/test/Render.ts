import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'

import type { Component } from 'vue'

type MountOptions = Parameters<typeof mount>[1]

/**
 * Mount component với plugin của app. Mỗi lần gọi tạo Pinia mới, không rò state giữa các test.
 * Plan 05 thay phần ráp plugin bằng `createAppRuntime()` (D37).
 */
export function renderWithPlugins(component: Component, options: { mount?: MountOptions } = {}) {
  const pinia = createPinia()
  const wrapper = mount(component, { ...options.mount, global: { plugins: [pinia] } })
  return { wrapper }
}
