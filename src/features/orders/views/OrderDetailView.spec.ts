import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { plainSpaces } from '@test/Intl'
import { renderFeature } from '@test/RenderFeature'

import OrderDetailView from './OrderDetailView.vue'

it('offers only valid next statuses and changes the order through its public action', async () => {
  const { wrapper, http } = await renderFeature(OrderDetailView, {
    path: '/orders/o1',
    routePath: '/orders/:id',
    permissions: ['order:write'],
    mock(http) {
      http.onGet(/\/orders\/o1$/).reply(200, {
        id: 'o1',
        number: 'ORD-001',
        status: 'pending',
        paymentStatus: 'unpaid',
        total: 200000,
        customer: { name: 'Lan', email: 'lan@shop.vn' },
        shipping: { address: 'Hà Nội', carrier: '', trackingNumber: '' },
        payment: { method: 'COD', reference: '' },
        items: [],
        timeline: [],
      })
      http.onPatch(/\/orders\/o1\/status$/).reply(200, {})
    },
  })
  expect(wrapper.text()).toContain('ORD-001')
  expect(wrapper.find('button[data-status="confirmed"]').exists()).toBe(true)
  expect(wrapper.find('button[data-status="delivered"]').exists()).toBe(false)
  expect(wrapper.get('[aria-current="step"]').text()).toBe('Chờ xác nhận')
  await wrapper.find('button[data-status="confirmed"]').trigger('click')
  await flushPromises()
  expect(JSON.parse(http.history.patch[0]?.data as string)).toEqual({ status: 'confirmed' })
})

it('requires confirmation before cancelling an order', async () => {
  const { wrapper, http } = await renderFeature(OrderDetailView, {
    path: '/orders/o1',
    routePath: '/orders/:id',
    permissions: ['order:write'],
    mock(http) {
      http.onGet(/\/orders\/o1$/).reply(200, {
        id: 'o1',
        number: 'ORD-001',
        status: 'pending',
        paymentStatus: 'unpaid',
        total: 100,
        customer: { name: 'Lan', email: '' },
        shipping: { address: '', carrier: '', trackingNumber: '' },
        payment: { method: 'COD', reference: '' },
        items: [],
        timeline: [],
      })
      http.onPatch(/\/orders\/o1\/status$/).reply(200, {})
    },
  })
  await wrapper.find('[data-status="cancelled"]').trigger('click')
  await flushPromises()
  expect(http.history.patch).toHaveLength(0)
  const confirm = [...document.querySelectorAll('[role="dialog"] button')].find(
    (button) => button.textContent.trim() === 'Xác nhận',
  ) as HTMLButtonElement | undefined
  expect(confirm).toBeDefined()
  confirm?.click()
  await flushPromises()
  expect(JSON.parse(http.history.patch[0]?.data as string)).toEqual({ status: 'cancelled' })
})

it('shows money and timeline dates formatted in the app locale', async () => {
  const placedAt = new Date(2026, 10, 9, 8, 42).toISOString()
  const { wrapper } = await renderFeature(OrderDetailView, {
    path: '/orders/o1',
    routePath: '/orders/:id',
    mock(http) {
      http.onGet(/\/orders\/o1$/).reply(200, {
        id: 'o1',
        number: 'ORD-001',
        status: 'pending',
        paymentStatus: 'paid',
        subtotal: 3_780_000,
        discount: 378_000,
        total: 3_437_000,
        customer: { name: 'Lan', email: 'lan@shop.vn' },
        shipping: { address: 'Hà Nội', carrier: 'GHN', trackingNumber: 'GHN-1' },
        payment: { method: 'VNPay', reference: 'VNP-1' },
        items: [{ id: 'i1', name: 'Áo blazer', sku: 'BLZ-1', quantity: 2, price: 1_890_000 }],
        timeline: [{ id: 't1', label: 'Đặt hàng', createdAt: placedAt }],
      })
    },
  })
  const shown = plainSpaces(wrapper.text())
  expect(shown).toContain('1.890.000 ₫')
  expect(shown).toContain('3.437.000 ₫')
  expect(shown).toContain('08:42 9/11/2026')
  expect(shown).not.toContain(placedAt)
  expect(wrapper.find('time').attributes('datetime')).toBe(placedAt)
})

it('shows an empty state instead of a bare table when the order has no items', async () => {
  const { wrapper } = await renderFeature(OrderDetailView, {
    path: '/orders/o1',
    routePath: '/orders/:id',
    mock(http) {
      http.onGet(/\/orders\/o1$/).reply(200, {
        id: 'o1',
        number: 'ORD-001',
        status: 'pending',
        paymentStatus: 'unpaid',
        total: 0,
        customer: { name: 'Lan', email: 'lan@shop.vn' },
        shipping: { address: 'Hà Nội', carrier: '', trackingNumber: '' },
        payment: { method: 'COD', reference: '' },
        items: [],
        timeline: [],
      })
    },
  })
  expect(wrapper.text()).toContain('Đơn hàng chưa có sản phẩm')
  expect(wrapper.find('table').exists()).toBe(false)
})
