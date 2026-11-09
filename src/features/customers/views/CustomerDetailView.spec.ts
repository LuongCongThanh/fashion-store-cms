import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import CustomerDetailView from './CustomerDetailView.vue'

it('restores the selected customer tab from the URL and scopes order history to that customer', async () => {
  const { wrapper, router, http } = await renderFeature(CustomerDetailView, {
    path: '/customers/c1?tab=orders',
    routePath: '/customers/:id',
    permissions: ['order:read'],
    mock(http) {
      http.onGet(/\/customers\/c1$/).reply(200, {
        id: 'c1',
        name: 'Lan',
        email: 'lan@shop.vn',
        phone: '',
        addresses: [],
        activity: [],
      })
      http.onGet(/\/orders$/).reply(200, {
        data: [{ id: 'o1', number: 'ORD-001', total: 250000 }],
        meta: { page: 1, pageSize: 20, total: 40, totalPages: 2 },
      })
    },
  })
  expect(wrapper.find('[role="tab"][aria-selected="true"]').text()).toContain('Đơn hàng')
  expect(wrapper.text()).toContain('ORD-001')
  expect(http.history.get.find((request) => request.url === '/orders')?.params.customerId).toBe(
    'c1',
  )
  await wrapper.find('button[aria-label="Trang sau"]').trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query.page).toBe('2')
  expect(http.history.get.filter((request) => request.url === '/orders').at(-1)?.params.page).toBe(
    2,
  )
  await wrapper.find('[role="tab"][data-tab="addresses"]').trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query.tab).toBe('addresses')
})
