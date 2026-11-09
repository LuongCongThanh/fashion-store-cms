import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { plainSpaces } from '@test/Intl'
import { renderWithPlugins } from '@test/Render'
import { chooseOption } from '@test/Select'

import ProductListView from './ProductListView.vue'

it('renders server products and changes filters, sort and page through the URL', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/products', component: { render: () => null } }],
  })
  await router.push('/products?page=3&status=published')
  const { wrapper, http } = renderWithPlugins(ProductListView, { router })
  http.onGet(/\/products$/).reply(200, {
    data: [{ id: 'p1', name: 'Áo linen', status: 'published', price: 250000 }],
    meta: { page: 3, pageSize: 20, total: 80, totalPages: 4 },
  })
  await flushPromises()
  expect(wrapper.text()).toContain('Áo linen')
  expect(wrapper.find('[data-action="row-actions"]').exists()).toBe(true)
  await chooseOption(wrapper, 'Trạng thái', 'Bản nháp')
  expect(router.currentRoute.value.query).toMatchObject({ status: 'draft', page: '1' })
  await wrapper
    .findAll('th button')
    .find((button) => button.text() === 'Giá')
    ?.trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query.sort).toBe('-price')
  await wrapper.find('button[aria-label="Trang sau"]').trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query.page).toBe('4')
  expect(wrapper.find('[data-action="bulk-delete"]').exists()).toBe(false)
})

it('asks for confirmation before deleting selected products', async () => {
  const { renderFeature } = await import('@test/RenderFeature')
  const { wrapper, http } = await renderFeature(ProductListView, {
    path: '/products',
    permissions: ['product:write'],
    mock(http) {
      http.onGet(/\/products$/).reply(200, {
        data: [{ id: 'p1', name: 'Áo linen', status: 'published', price: 250000 }],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      })
      http.onPost(/\/products\/bulk$/).reply(200, {})
    },
  })
  await wrapper.find('[role="checkbox"][aria-label="Áo linen"]').trigger('click')
  await wrapper.find('[data-action="bulk-delete"]').trigger('click')
  await flushPromises()
  expect(http.history.post).toHaveLength(0)
  const dialog = document.querySelector('[role="dialog"]')
  const confirm = [...(dialog?.querySelectorAll('button') ?? [])].find(
    (button) => button.textContent.trim() === 'Xác nhận',
  )
  expect(confirm).toBeDefined()
  confirm?.click()
  await flushPromises()
  expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
    ids: ['p1'],
    action: 'delete',
  })
})

it('filters products using category options from the category feature', async () => {
  const { renderFeature } = await import('@test/RenderFeature')
  const { wrapper, router } = await renderFeature(ProductListView, {
    path: '/products',
    mock(http) {
      http.onGet(/\/categories$/).reply(200, [{ id: 'linen', name: 'Linen', parentId: null }])
      http.onGet(/\/products$/).reply(200, { data: [], meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 } })
    },
  })
  await chooseOption(wrapper, 'Danh mục', 'Linen')
  expect(router.currentRoute.value.query.categoryId).toBe('linen')
})

it('shows product prices as money, right-aligned', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/products', component: { render: () => null } }],
  })
  await router.push('/products')
  const { wrapper, http } = renderWithPlugins(ProductListView, { router })
  http.onGet(/\/products$/).reply(200, {
    data: [{ id: 'p4', name: 'Túi tote da thật Atelier', status: 'published', price: 15_500_000 }],
    meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
  })
  await flushPromises()
  const price = wrapper.find('[data-cell="price"]')
  expect(plainSpaces(price.text())).toBe('15.500.000 ₫')
  expect(price.classes()).toContain('text-right')
})

it('opens a product from its name through the router, keeping the full name as a title', async () => {
  const longName = 'Đầm midi lụa xếp ly cổ yếm phối nơ lưng — phiên bản giới hạn Thu Đông 2026'
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/products', component: { render: () => null } },
      { path: '/products/:id', component: { render: () => null } },
    ],
  })
  await router.push('/products')
  const { wrapper, http } = renderWithPlugins(ProductListView, { router })
  http.onGet(/\/products$/).reply(200, {
    data: [{ id: 'p9', name: longName, status: 'published', price: 1 }],
    meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
  })
  await flushPromises()
  const link = wrapper.findAll('a').find((a) => a.text() === longName)
  expect(link?.attributes('title')).toBe(longName)
  await link?.trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.path).toBe('/products/p9')
})
