import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'
import { chooseOption, findField } from '@test/Select'

import OrderListView from './OrderListView.vue'

it('keeps date and payment filters in the URL and can clear active filters', async () => {
  const { wrapper, router } = await renderFeature(OrderListView, {
    path: '/orders?paymentStatus=paid&from=2026-01-01',
    mock(http) {
      http.onGet(/\/orders$/).reply(200, {
        data: [
          {
            id: 'o1',
            number: 'ORD-001',
            customer: { name: 'Lan' },
            total: 100,
            status: 'pending',
            paymentStatus: 'paid',
          },
        ],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      })
    },
  })
  expect(wrapper.text()).toContain('ORD-001')
  expect(findField(wrapper, 'Từ ngày').element.value).toBe('2026-01-01')
  await wrapper.find('button[data-action="clear-filters"]').trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.query.paymentStatus).toBeUndefined()
  expect(router.currentRoute.value.query.from).toBeUndefined()
})

it('filters by payment status through a labelled select', async () => {
  const { wrapper, router } = await renderFeature(OrderListView, {
    path: '/orders',
    mock(http) {
      http.onGet(/\/orders$/).reply(200, { data: [], meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 } })
    },
  })
  await chooseOption(wrapper, 'Thanh toán', 'Chưa thanh toán')
  expect(router.currentRoute.value.query.paymentStatus).toBe('unpaid')
  await chooseOption(wrapper, 'Thanh toán', 'Tất cả')
  expect(router.currentRoute.value.query.paymentStatus).toBeUndefined()
})
