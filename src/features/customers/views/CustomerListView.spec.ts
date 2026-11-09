import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import CustomerListView from './CustomerListView.vue'

it('opens customer records from a filtered server list', async () => {
  const { wrapper, http } = await renderFeature(CustomerListView, {
    path: '/customers?search=Lan',
    mock(http) {
      http.onGet(/\/customers$/).reply(200, {
        data: [
          {
            id: 'c1',
            name: 'Lan',
            email: 'lan@shop.vn',
            phone: '0900000000',
            totalSpent: 100,
            orderCount: 1,
          },
        ],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      })
    },
  })
  expect(wrapper.find('a[href="/customers/c1"]').text()).toBe('Lan')
  expect(http.history.get.find((request) => request.url === '/customers')?.params.search).toBe(
    'Lan',
  )
})
