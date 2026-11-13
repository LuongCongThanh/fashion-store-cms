import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { categoryPage } from '@test/factories/Category.factory'
import { setNumber } from '@test/NumberField'
import { renderFeature } from '@test/RenderFeature'
import { chooseOption } from '@test/Select'

import ProductCreateView from './ProductCreateView.vue'

it('saves a draft with one default variant without requiring publish fields', async () => {
  const { wrapper, http, router } = await renderFeature(ProductCreateView, {
    path: '/products/new',
    permissions: ['CATALOG_PRODUCT_MANAGE'],
    mock(http) {
      http.onGet(/\/categories$/).reply(200, categoryPage([]))
      http.onPost(/\/products$/).reply(201, { id: 'p1' })
    },
  })
  await wrapper.find('input[name="name"]').setValue('Áo mới')
  await wrapper.find('button[data-action="save-draft"]').trigger('click')
  await flushPromises()
  const payload = JSON.parse(http.history.post[0]?.data as string)
  expect(payload).toMatchObject({ name: 'Áo mới', status: 'draft' })
  expect(payload.variants).toHaveLength(1)
  expect(router.currentRoute.value.path).toBe('/products')
})

it('rejects publishing a product with incomplete variants and SEO', async () => {
  const { wrapper, http } = await renderFeature(ProductCreateView, {
    path: '/products/new',
    permissions: ['CATALOG_PRODUCT_MANAGE'],
    mock(http) {
      http.onGet(/\/categories$/).reply(200, categoryPage([]))
    },
  })
  await wrapper.find('input[name="name"]').setValue('Áo mới')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(http.history.post).toHaveLength(0)
  expect(wrapper.find('[data-error="slug"]').exists()).toBe(true)
})

it('publishes a categorized product with pricing, SEO and generated size/color variants', async () => {
  const { wrapper, http } = await renderFeature(ProductCreateView, {
    path: '/products/new',
    permissions: ['CATALOG_PRODUCT_MANAGE'],
    mock(http) {
      http.onGet(/\/categories$/).reply(200, categoryPage([{ id: 'linen', name: 'Linen', parentId: null }]))
      http.onPost(/\/products$/).reply(201, { id: 'p1' })
    },
  })
  await wrapper.find('input[name="name"]').setValue('Áo linen')
  await wrapper.find('input[name="brand"]').setValue('Fashion')
  await setNumber(wrapper, 'price', '200000')
  await setNumber(wrapper, 'comparePrice', '250000')
  await setNumber(wrapper, 'cost', '100000')
  await chooseOption(wrapper, 'Danh mục', 'Linen')
  await wrapper.find('input[name="slug"]').setValue('ao-linen')
  await wrapper.find('input[name="metaTitle"]').setValue('Áo linen Fashion')
  await wrapper.find('input[name="metaDescription"]').setValue('Áo thoáng mát')
  await wrapper.find('input[name="sizes"]').setValue('S,M')
  await wrapper.find('input[name="colors"]').setValue('Red,Blue')
  await wrapper.find('input[name="skuPrefix"]').setValue('TEE')
  await wrapper
    .findAll('button')
    .find((button) => button.text() === 'Sinh biến thể')
    ?.trigger('click')
  await setNumber(wrapper, 'variants.0.stock', '5')
  await setNumber(wrapper, 'variants.0.price', '210000')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  const payload = JSON.parse(http.history.post[0]?.data as string)
  expect(payload).toMatchObject({
    status: 'published',
    categoryIds: ['linen'],
    brand: 'Fashion',
    price: 200000,
    comparePrice: 250000,
    cost: 100000,
    slug: 'ao-linen',
    metaTitle: 'Áo linen Fashion',
    metaDescription: 'Áo thoáng mát',
  })
  expect(payload.variants).toHaveLength(4)
  expect(payload.variants[0]).toEqual({
    sku: 'TEE-S-RED',
    size: 'S',
    color: 'Red',
    price: 210000,
    stock: 5,
  })
})

it('preserves fractional product and variant prices when saving a draft', async () => {
  const { wrapper, http } = await renderFeature(ProductCreateView, {
    path: '/products/new',
    permissions: ['CATALOG_PRODUCT_MANAGE'],
    mock(http) {
      http.onGet(/\/categories$/).reply(200, categoryPage([]))
      http.onPost(/\/products$/).reply(201, { id: 'p1' })
    },
  })
  await wrapper.find('input[name="name"]').setValue('Áo mới')
  await setNumber(wrapper, 'price', '25,1256')
  await setNumber(wrapper, 'comparePrice', '30,75')
  await setNumber(wrapper, 'cost', '12,5')
  await setNumber(wrapper, 'variants.0.price', '26,25')
  await wrapper.find('button[data-action="save-draft"]').trigger('click')
  await flushPromises()
  expect(JSON.parse(http.history.post[0]?.data as string)).toMatchObject({
    price: 25.1256,
    comparePrice: 30.75,
    cost: 12.5,
    variants: [{ price: 26.25 }],
  })
})
