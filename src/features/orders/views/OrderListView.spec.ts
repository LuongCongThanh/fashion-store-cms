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
            status: 'PLACED',
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

it('shows the order total as right-aligned money', async () => {
  const { wrapper } = await renderFeature(OrderListView, {
    path: '/orders',
    mock(http) {
      http.onGet(/\/orders$/).reply(200, {
        data: [
          {
            id: 'o1',
            number: 'ORD-001',
            customer: { name: 'Lan' },
            total: 1500000,
            status: 'PLACED',
            paymentStatus: 'paid',
          },
        ],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      })
    },
  })
  const cell = wrapper.findAll('td span.text-right').find((span) => span.text().includes('1.500.000'))
  expect(cell?.text()).toMatch(/1\.500\.000\s*₫/)
})

it('hides pagination while loading and after a failed refresh, then restores it on retry', async () => {
  let resolvePage!: (response: [number, unknown]) => void
  const { wrapper, http, runtime } = await renderFeature(OrderListView, {
    path: '/orders',
    mock(http) {
      http.onGet(/\/orders$/).reply(
        () =>
          new Promise((resolve) => {
            resolvePage = resolve
          }),
      )
    },
  })
  const pagination = () => wrapper.find('nav[aria-label="Phân trang"]')
  expect(pagination().exists()).toBe(false)
  const page = { data: [], meta: { page: 1, pageSize: 20, total: 50, totalPages: 3 } }
  resolvePage([200, page])
  await flushPromises()
  expect(pagination().exists()).toBe(true)
  http.onGet(/\/orders$/).reply(500, {})
  await runtime.queryClient.invalidateQueries()
  await flushPromises()
  expect(pagination().exists()).toBe(false)
  http.onGet(/\/orders$/).reply(200, page)
  await wrapper.find('button[data-action="retry"]').trigger('click')
  await flushPromises()
  expect(pagination().exists()).toBe(true)
})
