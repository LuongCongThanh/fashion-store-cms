import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, onMounted } from 'vue'

import { useAuth } from '@features/auth/UseAuth'
import { buildUser } from '@test/factories/User.factory'
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
  const result = renderWithPlugins(Host)
  result.http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions }))
  if (failRevenue) result.http.onGet(/\/dashboard\/revenue$/).reply(500, {})
  result.http.onGet(/\/dashboard\//).reply(200, { value: 42, points: [], items: [] })
  await flushPromises()
  return result
}

describe('DashboardView', () => {
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
  http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions: ['product:read'] }))
  http.onGet(/\/dashboard\//).reply(200, { value: 12, points: [], items: [] })
  await flushPromises()
  expect(wrapper.find('[data-widget="products"]').text()).toContain('12')
})

it('links a recent order directly to its detail page', async () => {
  const { wrapper, http } = renderWithPlugins(DashboardView)
  http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions: ['order:read'] }))
  http
    .onGet(/\/dashboard\/recent-orders$/)
    .reply(200, { items: [{ id: 'o1', label: 'ORD-001', value: 200000 }] })
  http.onGet(/\/dashboard\//).reply(200, { value: 12, points: [], items: [] })
  await flushPromises()
  expect(wrapper.find('a[href="/orders/o1"]').text()).toBe('ORD-001')
})
