import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { categoryPage } from '@test/factories/Category.factory'
import { renderWithPlugins } from '@test/Render'
import { chooseOption } from '@test/Select'

import ProductListView from './ProductListView.vue'

/** JSON một dòng `GET /admin/products` (test chỉ mô tả dữ liệu trên dây, §T.3). */
function productRow(overrides: { id: string; name: string }) {
  return {
    categoryId: 'linen',
    slug: overrides.id,
    description: null,
    weightGrams: 200,
    status: 'ACTIVE',
    publishedAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

it('removes one active filter without dropping the others', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/products', component: { render: () => null } }],
  })
  await router.push('/products?search=lua&status=ACTIVE&categoryId=linen&page=2')
  const { wrapper, http } = renderWithPlugins(ProductListView, { router })
  http.onGet(/\/categories$/).reply(200, categoryPage([{ id: 'linen', name: 'Linen', parentId: null }]))
  http.onGet(/\/products$/).reply(200, {
    data: [],
    meta: { page: 2, limit: 20, total: 1, totalPages: 1 },
  })
  await flushPromises()

  expect(wrapper.find('button[aria-label="Bỏ lọc Tìm kiếm"]').exists()).toBe(true)
  const removeStatus = wrapper.find('button[aria-label="Bỏ lọc Trạng thái"]')
  expect(removeStatus.exists()).toBe(true)
  await removeStatus.trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query.status).toBeUndefined()
  expect(router.currentRoute.value.query).toMatchObject({ categoryId: 'linen', page: '1' })
})

it('filters products using category options from the category feature', async () => {
  const { renderFeature } = await import('@test/RenderFeature')
  const { wrapper, router } = await renderFeature(ProductListView, {
    path: '/products',
    mock(http) {
      http.onGet(/\/categories$/).reply(200, categoryPage([{ id: 'linen', name: 'Linen', parentId: null }]))
      http.onGet(/\/products$/).reply(200, { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } })
    },
  })
  await chooseOption(wrapper, 'Danh mục', 'Linen')
  expect(router.currentRoute.value.query.categoryId).toBe('linen')
})

it('opens a product from its name through the router, keeping the full name as a title', async () => {
  const longName = 'Đầm midi lụa xếp ly cổ yếm phối nơ lưng — phiên bản giới hạn Thu Đông 2026'
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/products', component: { render: () => null } },
      { path: '/products/:id/edit', component: { render: () => null } },
    ],
  })
  await router.push('/products')
  const { wrapper, http } = renderWithPlugins(ProductListView, { router })
  http.onGet(/\/products$/).reply(200, {
    data: [productRow({ id: 'p9', name: longName })],
    meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
  })
  await flushPromises()
  const link = wrapper.findAll('a').find((a) => a.text() === longName)
  expect(link?.attributes('title')).toBe(longName)
  await link?.trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.path).toBe('/products/p9/edit')
})
