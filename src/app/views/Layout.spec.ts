import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, onMounted } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'
import AppHeader from '@layouts/components/AppHeader.vue'
import AppSidebar from '@layouts/components/AppSidebar.vue'
import { buildUser } from '@test/factories/User.factory'
import { renderWithPlugins } from '@test/Render'

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
            return () => h('div', [h(AppHeader), h(AppSidebar)])
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
  const result = renderWithPlugins(RouterView, { router })
  result.http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions: [] }))
  return { ...result, router }
}

describe('Layout navigation', () => {
  it('shows translated ancestor breadcrumbs and switches language without changing the URL', async () => {
    const { wrapper, router } = await renderLayout()
    expect(wrapper.find('nav[aria-label="Breadcrumb"]').text()).toContain('Tổng quan')
    await wrapper.find('select[name="language"]').setValue('en')
    await flushPromises()
    expect(wrapper.find('nav[aria-label="Breadcrumb"]').text()).toContain('Dashboard')
    expect(router.currentRoute.value.fullPath).toBe('/products?status=draft')
    expect(localStorage.getItem('cms.locale')).toBe('en')
  })
  it('keeps system as a selectable persisted theme', async () => {
    const { wrapper } = await renderLayout()
    await wrapper.find('select[name="theme"]').setValue('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('cms.colorMode')).toBe('dark')
    await wrapper.find('select[name="theme"]').setValue('auto')
    expect(localStorage.getItem('cms.colorMode')).toBe('auto')
  })
  it('groups permitted links under their domain', async () => {
    const { wrapper, http } = await renderLayout()
    http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions: ['order:read'] }))
    await flushPromises()
    expect(wrapper.find('aside').text()).toContain('Cửa hàng')
    expect(wrapper.find('aside a[href="/orders"]').exists()).toBe(true)
  })
  it('hides sidebar links when the current user lacks permission', async () => {
    const { wrapper } = await renderLayout()
    expect(wrapper.find('aside a[href="/orders"]').exists()).toBe(false)
  })
})
