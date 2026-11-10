import { flushPromises } from '@vue/test-utils'

import type { VueWrapper } from '@vue/test-utils'

/**
 * Nhập số vào UInputNumber theo `data-field`. `name` của UInputNumber nằm ở input ẩn, còn ô hiển thị
 * chỉ ghi giá trị khi blur, nên test gõ rồi blur như người dùng.
 */
export async function setNumber(wrapper: VueWrapper, field: string, value: string): Promise<void> {
  const input = wrapper.find<HTMLInputElement>(`input[data-field="${field}"]`)
  if (!input.exists()) throw new Error(`Không thấy ô số "${field}"`)
  await input.setValue(value)
  await input.trigger('blur')
  await flushPromises()
}
