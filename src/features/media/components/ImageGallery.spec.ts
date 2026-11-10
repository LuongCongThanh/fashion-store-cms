import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderWithPlugins } from '@test/Render'
import { chooseMenuItem } from '@test/Select'

import ImageGallery from './ImageGallery.vue'

const images = [
  { id: 'a', name: 'Linen front', url: '/front.jpg' },
  { id: 'b', name: 'Linen back', url: '/back.jpg' },
]

it('offers four labelled actions with moves disabled at the gallery boundaries', async () => {
  const { wrapper } = renderWithPlugins(ImageGallery, {
    props: { images, mainId: 'a' },
    mount: { attachTo: document.body },
  })
  expect(wrapper.text()).toContain('Ảnh chính')
  await wrapper.find('button[aria-label="Thao tác ảnh Linen front"]').trigger('click')
  await flushPromises()
  const items = [...document.querySelectorAll('[role="menuitem"]')]
  expect(items.map((item) => item.textContent.trim())).toEqual([
    'Đặt ảnh chính',
    'Di chuyển trái',
    'Di chuyển phải',
    'Xóa',
  ])
  expect(items[1]?.getAttribute('aria-disabled')).toBe('true')
})

it.each(['Huỷ', 'Xóa'])('waits for deletion confirmation and handles %s', async (choice) => {
  const { wrapper } = renderWithPlugins(ImageGallery, {
    props: { images },
    mount: { attachTo: document.body },
  })
  await wrapper.find('button[aria-label="Thao tác ảnh Linen front"]').trigger('click')
  await flushPromises()
  const remove = [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(
    (item) => item.textContent.trim() === 'Xóa',
  )
  if (!remove) throw new Error('Missing delete menu item')
  remove.click()
  await flushPromises()
  expect(wrapper.findComponent(ImageGallery).emitted('remove')).toBeUndefined()
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Linen front')
  const button = [...document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')].find(
    (item) => item.textContent.trim() === choice,
  )
  if (!button) throw new Error('Missing confirmation button')
  button.click()
  await flushPromises()
  expect(wrapper.findComponent(ImageGallery).emitted('remove')).toEqual(choice === 'Xóa' ? [['a']] : undefined)
})

it('renders lazy images without actions in read-only mode and an empty state without images', async () => {
  const { wrapper } = renderWithPlugins(ImageGallery, { props: { images, readonly: true } })
  expect(wrapper.findAll('img').map((image) => image.attributes('loading'))).toEqual(['lazy', 'lazy'])
  expect(wrapper.find('button').exists()).toBe(false)
  const empty = renderWithPlugins(ImageGallery, { props: { images: [] } })
  expect(empty.wrapper.text()).toContain('Chưa có dữ liệu')
})

it('supports choosing the main image and reordering with the keyboard', async () => {
  const { wrapper } = renderWithPlugins(ImageGallery, {
    props: { images, mainId: 'a' },
    mount: { attachTo: document.body },
  })
  await chooseMenuItem(wrapper, 'Thao tác ảnh Linen back', 'Đặt ảnh chính')
  expect(wrapper.findComponent(ImageGallery).emitted('main')).toEqual([['b']])
  await chooseMenuItem(wrapper, 'Thao tác ảnh Linen front', 'Di chuyển phải')
  expect(wrapper.findComponent(ImageGallery).emitted('move')).toEqual([['a', 1]])
  await wrapper.find('button[aria-label="Thao tác ảnh Linen back"]').trigger('keydown', { key: 'Enter' })
  await flushPromises()
  const right = [...document.querySelectorAll('[role="menuitem"]')].find(
    (item) => item.textContent.trim() === 'Di chuyển phải',
  )
  expect(right?.getAttribute('aria-disabled')).toBe('true')
})
