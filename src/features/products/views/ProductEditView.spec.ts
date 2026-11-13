import { flushPromises } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'

import { categoryPage } from '@test/factories/Category.factory'
import { renderFeature } from '@test/RenderFeature'

import ProductEditView from './ProductEditView.vue'

/** JSON `GET /admin/products/:id` (test chỉ mô tả dữ liệu trên dây, §T.3). */
const product = {
  id: 'p1',
  name: 'Áo ban đầu',
  slug: 'ao-ban-dau',
  description: null,
  categoryId: 'linen',
  weightGrams: 200,
  status: 'DRAFT',
  publishedAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  variants: [],
  images: [],
}

function mockOptions(http: { onGet: (url: RegExp) => { reply: (status: number, body: unknown) => unknown } }) {
  http.onGet(/\/categories$/).reply(200, categoryPage([]))
  http.onGet(/\/admin\/sizes$/).reply(200, [])
  http.onGet(/\/admin\/colors$/).reply(200, [])
}

it('preserves unsaved edits when a background refresh returns changed server data', async () => {
  let name = product.name
  const { wrapper, http } = await renderFeature(ProductEditView, {
    path: '/products/p1/edit',
    routePath: '/products/:id/edit',
    permissions: ['CATALOG_PRODUCT_MANAGE'],
    mock(http) {
      http.onGet(/\/products\/p1$/).reply(() => [200, { ...product, name }])
      mockOptions(http)
    },
  })
  await wrapper.find('input[name="name"]').setValue('Bản đang sửa')
  name = 'Tên mới trên server'
  vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 31000)
  window.dispatchEvent(new Event('visibilitychange'))
  await flushPromises()
  expect(http.history.get.filter((request) => request.url === '/admin/products/p1')).toHaveLength(2)
  expect(wrapper.find('input[name="name"]').element).toHaveProperty('value', 'Bản đang sửa')
  const unload = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(unload)
  expect(unload.defaultPrevented).toBe(true)
})

it('warns before switching records and then hydrates the newly chosen product', async () => {
  const { wrapper, router } = await renderFeature(ProductEditView, {
    path: '/products/p1/edit',
    routePath: '/products/:id/edit',
    permissions: ['CATALOG_PRODUCT_MANAGE'],
    mock(http) {
      http.onGet(/\/products\/p1$/).reply(200, product)
      http.onGet(/\/products\/p2$/).reply(200, { ...product, id: 'p2', name: 'Áo thứ hai' })
      mockOptions(http)
    },
  })
  await wrapper.find('input[name="name"]').setValue('Bản chưa lưu')
  const navigation = router.push('/products/p2/edit')
  await flushPromises()
  expect(router.currentRoute.value.path).toBe('/products/p1/edit')
  const confirm = [...document.querySelectorAll('[role="dialog"] button')].find(
    (button) => button.textContent.trim() === 'Xác nhận',
  ) as HTMLButtonElement | undefined
  expect(confirm).toBeDefined()
  confirm?.click()
  await navigation
  await flushPromises()
  expect(wrapper.find('input[name="name"]').element).toHaveProperty('value', 'Áo thứ hai')
})
