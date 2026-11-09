import { flushPromises } from '@vue/test-utils'
import { vi } from 'vitest'

import type { DOMWrapper, VueWrapper } from '@vue/test-utils'

/**
 * Tìm combobox (USelect) theo accessible name: `aria-label`, hoặc `<label for>` trỏ tới nó.
 * Test thao tác như người dùng: theo role + tên, không theo tag `<select>`.
 */
export function findCombobox(wrapper: VueWrapper, name: string): DOMWrapper<HTMLElement> {
  const boxes = wrapper.findAll<HTMLElement>('[role="combobox"]')
  const labelledIds = wrapper
    .findAll('label')
    .filter((label) => label.text().trim() === name)
    .map((label) => label.attributes('for'))
  const match = boxes.find((box) => box.attributes('aria-label') === name || labelledIds.includes(box.attributes('id')))
  if (!match) throw new Error(`Không thấy combobox "${name}"`)
  return match
}

/** Tìm ô nhập theo label hiển thị (`<label for>`), như người dùng đọc trên form. */
export function findField(wrapper: VueWrapper, name: string): DOMWrapper<HTMLInputElement> {
  const id = wrapper
    .findAll('label')
    .find((label) => label.text().trim() === name)
    ?.attributes('for')
  const field = id
    ? wrapper.findAll<HTMLInputElement>('input').find((input) => input.attributes('id') === id)
    : undefined
  if (!field) throw new Error(`Không thấy ô nhập "${name}"`)
  return field
}

/**
 * Mở combobox `name` rồi chọn option có chữ `option`, bằng bàn phím (jsdom không có pointer capture
 * mà reka-ui cần cho chuột). Listbox render qua portal nên tìm trong `document.body`.
 */
export async function chooseOption(wrapper: VueWrapper, name: string, option: string): Promise<void> {
  const box = findCombobox(wrapper, name)
  await box.trigger('keydown', { key: 'Enter' })
  const target = await vi.waitFor(() => {
    const found = Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]')).find(
      (el) => el.textContent.trim() === option,
    )
    if (!found) throw new Error(`Không thấy option "${option}" trong "${name}"`)
    return found
  })
  target.focus()
  target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  await flushPromises()
}
