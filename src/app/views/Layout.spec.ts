import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, onMounted } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'

import type { VueWrapper } from '@vue/test-utils'

import { useAuth } from '@features/auth/UseAuth'
import AppShell from '@layouts/components/AppShell.vue'
import { buildUser } from '@test/factories/User.factory'
import { renderWithPlugins } from '@test/Render'
import { chooseOption } from '@test/Select'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach((wrapper) => {
    wrapper.unmount()
  })
})

// Slideover của UDashboardSidebar được tải lazy nên phải chờ nó xuất hiện/biến mất.
async function openedDrawer(): Promise<HTMLElement> {
  return vi.waitFor(() => {
    const dialog = document.body.querySelector<HTMLElement>('[role="dialog"]')
    if (!dialog) throw new Error('drawer chưa mở')
    return dialog
  })
}

async function drawerClosed(): Promise<void> {
  await vi.waitFor(() => {
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
  })
}

async function renderLayout() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        component: defineComponent({
          setup: () => {
            const { ensureUser } = useAuth()
            onMounted(() => void ensureUser())
            return () => h(AppShell, null, { default: () => h(RouterView) })
          },
        }),
        meta: { titleKey: 'nav.dashboard' },
        children: [
          {
            path: 'products',
            component: { render: () => null },
            meta: { titleKey: 'common.store' },
          },
        ],
      },
      {
        path: '/orders',
        name: 'orders',
        component: { render: () => null },
        meta: {
          permission: 'order:read',
          titleKey: 'nav.orders',
          sidebarGroup: 'store',
          command: { icon: 'i-lucide-receipt', group: 'navigate' },
        },
      },
    ],
  })
  await router.push('/products?status=draft')
  const result = renderWithPlugins(RouterView, { router, mount: { attachTo: document.body } })
  mounted.push(result.wrapper)
  result.http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions: [] }))
  return { ...result, router }
}

describe('Layout navigation', () => {
  it('shows translated ancestor breadcrumbs and switches language without changing the URL', async () => {
    const { wrapper, router } = await renderLayout()
    expect(wrapper.find('nav[aria-label="Breadcrumb"]').text()).toContain('Tổng quan')
    await chooseOption(wrapper, 'Ngôn ngữ', 'English')
    await flushPromises()
    expect(wrapper.find('nav[aria-label="Breadcrumb"]').text()).toContain('Dashboard')
    expect(router.currentRoute.value.fullPath).toBe('/products?status=draft')
    expect(localStorage.getItem('cms.locale')).toBe('en')
  })
  it('keeps system as a selectable persisted theme', async () => {
    const { wrapper } = await renderLayout()
    await chooseOption(wrapper, 'Giao diện', 'Tối')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('cms.colorMode')).toBe('dark')
    await chooseOption(wrapper, 'Giao diện', 'Theo hệ thống')
    expect(localStorage.getItem('cms.colorMode')).toBe('auto')
  })
  it('groups permitted links under their domain', async () => {
    const { wrapper, http } = await renderLayout()
    http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions: ['order:read'] }))
    await flushPromises()
    expect(wrapper.find('nav[aria-label="Menu điều hướng"]').text()).toContain('Cửa hàng')
    expect(wrapper.find('nav[aria-label="Menu điều hướng"] a[href="/orders"]').exists()).toBe(true)
  })
  it('opens a navigation drawer from the header menu button', async () => {
    const { wrapper, http } = await renderLayout()
    http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions: ['order:read'] }))
    await flushPromises()
    await wrapper.find('button[aria-label="Mở thanh bên"]').trigger('click')
    const dialog = await openedDrawer()
    expect(dialog.querySelector('a[href="/orders"]')).not.toBeNull()
  })
  it('closes the drawer on Escape and returns focus to the menu button', async () => {
    const { wrapper } = await renderLayout()
    const trigger = wrapper.find('button[aria-label="Mở thanh bên"]')
    ;(trigger.element as HTMLElement).focus()
    await trigger.trigger('click')
    const dialog = await openedDrawer()
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await drawerClosed()
    expect(document.activeElement).toBe(trigger.element)
  })
  it('closes the drawer when the route changes', async () => {
    const { wrapper, router } = await renderLayout()
    await wrapper.find('button[aria-label="Mở thanh bên"]').trigger('click')
    await openedDrawer()
    await router.push('/')
    await drawerClosed()
  })
  it('hides sidebar links when the current user lacks permission', async () => {
    const { wrapper } = await renderLayout()
    expect(wrapper.find('nav[aria-label="Menu điều hướng"] a[href="/orders"]').exists()).toBe(false)
  })
  it('opens the permitted command palette with the keyboard and navigates on selection', async () => {
    const { wrapper, router, http } = await renderLayout()
    http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions: ['order:read'] }))
    await flushPromises()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
    const dialog = await openedDrawer()
    expect(dialog.textContent).toContain('Đơn hàng')
    const order = [...dialog.querySelectorAll<HTMLElement>('[role="option"]')].find((item) => item.textContent.includes('Đơn hàng'))
    order?.click()
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/orders')
    expect(wrapper.exists()).toBe(true)
  })
})
