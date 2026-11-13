import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { plainSpaces } from '@test/Intl'
import { renderWithPlugins } from '@test/Render'
import { chooseOption } from '@test/Select'

import ProductListView from './ProductListView.vue'

it('changes the product status preset through the URL', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/products', component: { render: () => null } },
      { path: '/products/:id', component: { render: () => null } },
    ],
  })
  await router.push('/products?page=3')
  const { wrapper, http } = renderWithPlugins(ProductListView, { router })
  http.onGet(/\/products$/).reply(200, {
    data: [],
    meta: { page: 3, pageSize: 20, total: 24, totalPages: 2 },
  })
  await flushPromises()

  const all = wrapper.findAll('a').find((link) => link.text().includes('Tất cả'))
  const published = wrapper.findAll('a').find((link) => link.text().includes('Đang bán'))
  expect(all?.attributes('aria-current')).toBe('page')
  expect(all?.text()).toContain('24')
  expect(published?.text()).toContain('24')

  await published?.trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query).toMatchObject({ status: 'published', page: '1' })
  expect(router.currentRoute.value.query.page).toBe('1')
})

it('removes one active filter without dropping the others', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/products', component: { render: () => null } }],
  })
  await router.push('/products?search=lua&status=published&categoryId=linen&minPrice=15500000&page=2')
  const { wrapper, http } = renderWithPlugins(ProductListView, { router })
  http.onGet(/\/categories$/).reply(200, [{ id: 'linen', name: 'Linen', parentId: null }])
  http.onGet(/\/products$/).reply(200, {
    data: [],
    meta: { page: 2, pageSize: 20, total: 1, totalPages: 1 },
  })
  await flushPromises()

  expect(plainSpaces(wrapper.text())).toContain('Giá tối thiểu: 15.500.000 ₫')
  expect(wrapper.find('button[aria-label="Bỏ lọc Tìm kiếm"]').exists()).toBe(true)
  const removeStatus = wrapper.find('button[aria-label="Bỏ lọc Trạng thái"]')
  expect(removeStatus.exists()).toBe(true)
  await removeStatus.trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query.status).toBeUndefined()
  expect(router.currentRoute.value.query).toMatchObject({ categoryId: 'linen', page: '1' })
})

it('keeps row actions accessible for a long product name without an image', async () => {
  const longName = 'Đầm midi lụa xếp ly cổ yếm phối nơ lưng — phiên bản giới hạn Thu Đông 2026'
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/products', component: { render: () => null } }],
  })
  await router.push('/products')
  const { wrapper, http } = renderWithPlugins(ProductListView, { router })
  http.onGet(/\/products$/).reply(200, {
    data: [{ id: 'p9', name: longName, status: 'published', price: 15_500_000 }],
    meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
  })
  await flushPromises()

  expect(wrapper.find('[data-product-thumbnail="fallback"]').text()).toBe('Đ')
  const rowActions = wrapper.find(`[aria-label="Thao tác ${longName}"]`)
  expect(rowActions.exists()).toBe(true)
  expect(rowActions.element.closest('td')?.classList).toContain('sticky')
  expect(rowActions.element.closest('td')?.classList).toContain('right-0')
  expect(
    wrapper
      .findAll('a')
      .find((link) => link.text() === longName)
      ?.attributes('title'),
  ).toBe(longName)
})

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
    permissions: ['CATALOG_PRODUCT_MANAGE'],
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
