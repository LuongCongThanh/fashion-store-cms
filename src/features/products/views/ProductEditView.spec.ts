import { flushPromises } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import ProductEditView from './ProductEditView.vue'

const product = {
  id: 'p1',
  name: 'Áo ban đầu',
  description: '',
  brand: '',
  price: 100,
  comparePrice: 0,
  cost: 0,
  categoryIds: [],
  images: [],
  mainImageId: '',
  variants: [{ sku: 'TEE', size: '', color: '', price: 100, stock: 1 }],
  slug: 'ao',
  metaTitle: '',
  metaDescription: '',
  status: 'draft',
}

it('preserves unsaved edits when a background refresh returns changed server data', async () => {
  let name = product.name
  const { wrapper, http } = await renderFeature(ProductEditView, {
    path: '/products/p1/edit',
    routePath: '/products/:id/edit',
    permissions: ['CATALOG_PRODUCT_MANAGE'],
    mock(http) {
      http.onGet(/\/products\/p1$/).reply(() => [200, { ...product, name }])
      http.onGet(/\/categories$/).reply(200, [])
    },
  })
  await wrapper.find('input[name="name"]').setValue('Bản đang sửa')
  name = 'Tên mới trên server'
  vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 31000)
  window.dispatchEvent(new Event('visibilitychange'))
  await flushPromises()
  expect(http.history.get.filter((request) => request.url === '/products/p1')).toHaveLength(2)
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
      http.onGet(/\/categories$/).reply(200, [])
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
