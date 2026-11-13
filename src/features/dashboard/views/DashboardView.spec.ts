import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, onMounted } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import { buildUser, buildUserDto } from '@test/factories/User.factory'
import { plainSpaces } from '@test/Intl'
import { renderWithPlugins } from '@test/Render'

import DashboardView from './DashboardView.vue'

async function renderDashboard(permissions: string[], failRevenue = false) {
  const Host = defineComponent({
    setup() {
      const { ensureUser } = useAuth()
      onMounted(() => void ensureUser())
      return () => h(DashboardView)
    },
  })
  const result = renderWithPlugins(Host, { user: buildUser({ permissions }) })
  if (failRevenue) result.http.onGet(/\/dashboard\/revenue$/).reply(500, {})
  result.http.onGet(/\/dashboard\//).reply(200, { value: 42, points: [], items: [] })
  await flushPromises()
  return result
}

describe('DashboardView', () => {
  it('shows a labelled skeleton, not loading text, while the user and widgets load', () => {
    const Host = defineComponent({
      setup() {
        const { ensureUser } = useAuth()
        onMounted(() => void ensureUser())
        return () => h(DashboardView)
      },
    })
    const { wrapper, http } = renderWithPlugins(Host)
    http.onGet(/\/auth\/me$/).reply(200, buildUserDto())
    expect(wrapper.find('[role="status"][aria-label="Đang tải…"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Đang tải…')
  })

  it('keeps other widgets visible when one fails and can retry it', async () => {
    const { wrapper, http } = await renderDashboard(['order:read'], true)
    expect(wrapper.find('[data-widget="revenue"]').text()).toContain('Máy chủ gặp lỗi')
    expect(wrapper.find('[data-widget="orders"]').text()).toContain('42')
    http.onGet(/\/dashboard\/revenue$/).reply(200, { value: 120000 })
    await wrapper.find('[data-widget="revenue"] button[data-action="retry"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-widget="revenue"]').text()).toContain('120')
  })

  it('hides restricted widgets and never requests their data', async () => {
    const { wrapper, http } = await renderDashboard(['order:read'])
    expect(wrapper.find('[data-widget="recent-orders"]').exists()).toBe(true)
    expect(wrapper.find('[data-widget="revenue-chart"]').text()).toContain('Chưa có dữ liệu')
    expect(wrapper.find('[data-widget="top-products"]').exists()).toBe(false)
    expect(wrapper.find('[data-widget="low-stock"]').exists()).toBe(false)
    expect(http.history.get.some((request) => request.url?.includes('low-stock'))).toBe(false)
  })
})

it('loads the current user when opening the dashboard directly after a reload', async () => {
  const { wrapper, http } = renderWithPlugins(DashboardView)
  http.onGet(/\/auth\/me$/).reply(200, buildUserDto({ role: 'STAFF', permissions: ['CATALOG_PRODUCT_VIEW'] }))
  http.onGet(/\/dashboard\//).reply(200, { value: 12, points: [], items: [] })
  await flushPromises()
  expect(wrapper.find('[data-widget="products"]').text()).toContain('12')
})

it('links a recent order directly to its detail page', async () => {
  const { wrapper, http } = renderWithPlugins(DashboardView, { user: buildUser({ permissions: ['order:read'] }) })
  http.onGet(/\/dashboard\/recent-orders$/).reply(200, { items: [{ id: 'o1', label: 'ORD-001', value: 200000 }] })
  http.onGet(/\/dashboard\//).reply(200, { value: 12, points: [], items: [] })
  await flushPromises()
  expect(wrapper.find('a[href="/orders/o1"]').text()).toBe('ORD-001')
})

it('formats revenue as money and counts with the locale separator', async () => {
  const { wrapper, http } = renderWithPlugins(DashboardView, {
    user: buildUser({ permissions: ['order:read', 'CATALOG_PRODUCT_VIEW'] }),
  })
  http.onGet(/\/dashboard\/revenue$/).reply(200, { value: 1_284_560_000 })
  http.onGet(/\/dashboard\/orders$/).reply(200, { value: 1_842 })
  http.onGet(/\/dashboard\/recent-orders$/).reply(200, { items: [{ id: 'o1', label: 'ORD-001', value: 12_350_000 }] })
  http.onGet(/\/dashboard\/top-products$/).reply(200, { items: [{ id: 'p1', label: 'Áo blazer', value: 312 }] })
  http.onGet(/\/dashboard\//).reply(200, { value: 0, points: [], items: [] })
  await flushPromises()
  const shown = (key: string) => plainSpaces(wrapper.find(`[data-widget="${key}"]`).text())
  expect(shown('revenue')).toContain('1.284.560.000 ₫')
  expect(shown('orders')).toContain('1.842')
  expect(shown('recent-orders')).toContain('12.350.000 ₫')
  expect(shown('top-products')).toContain('312')
})

it('shows only the empty state when the user cannot access any widgets', async () => {
  const { wrapper, http } = await renderDashboard([])
  expect(wrapper.text()).toContain('Chưa có dữ liệu')
  expect(wrapper.find('.grid').exists()).toBe(false)
  expect(http.history.get.some((request) => request.url?.includes('/dashboard/'))).toBe(false)
})
