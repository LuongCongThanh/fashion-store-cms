import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'

import { authGuard } from '@app/router/Guards'
import { routes } from '@app/router/Routes'
import { buildUser } from '@test/factories/User.factory'
import { renderWithPlugins } from '@test/Render'

async function renderCms(permissions: string[]) {
  const router = createRouter({ history: createMemoryHistory(), routes })
  await router.push('/login')
  const result = renderWithPlugins(RouterView, { router })
  result.http.onGet(/\/auth\/me$/).reply(200, buildUser({ permissions }))
  router.beforeEach(authGuard)
  return { ...result, router }
}

it.each([
  ['/products/new', 'product:read'],
  ['/categories/new', 'category:read'],
  ['/promotions/new', 'promotion:read'],
  ['/users/new', 'user:read'],
  ['/roles/new', 'role:read'],
  ['/settings/store', 'settings:read'],
  ['/settings/localization', 'settings:read'],
])('blocks write route %s for a user with only %s', async (path, permission) => {
  const { wrapper, router } = await renderCms([permission])
  await router.push(path)
  await flushPromises()
  expect(router.currentRoute.value.name).toBe('forbidden')
  expect(wrapper.find('form').exists()).toBe(false)
})

it('redirects settings to the Store editor for an authorized user', async () => {
  const { wrapper, router, http } = await renderCms(['settings:read', 'settings:write'])
  http.onGet(/\/settings\/store$/).reply(200, {
    name: 'Fashion',
    logo: null,
    description: '',
    contactEmail: 'store@shop.vn',
    phone: '',
    address: '',
  })
  await router.push('/settings')
  await flushPromises()
  expect(router.currentRoute.value.path).toBe('/settings/store')
  expect(wrapper.find('input[name="name"]').element).toHaveProperty('value', 'Fashion')
})

it('shows the product ancestor in breadcrumbs for a create route', async () => {
  const { wrapper, router, http } = await renderCms(['product:read', 'product:write'])
  http.onGet(/\/categories$/).reply(200, [])
  await router.push('/products/new')
  await flushPromises()
  const breadcrumb = wrapper.find('nav[aria-label="Breadcrumb"]')
  expect(breadcrumb.text()).toContain('Sản phẩm')
  expect(breadcrumb.find('a[href="/products"]').exists()).toBe(true)
})

it('keeps an unsaved product form open when the user cancels leaving', async () => {
  const { wrapper, router, http } = await renderCms(['product:read', 'product:write'])
  http.onGet(/\/categories$/).reply(200, [])
  await router.push('/products/new')
  await flushPromises()
  await wrapper.find('input[name="name"]').setValue('Chưa lưu')
  const unload = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(unload)
  expect(unload.defaultPrevented).toBe(true)
  const navigation = router.push('/products')
  await flushPromises()
  const cancel = [...document.querySelectorAll('[role="dialog"] button')].find(
    (button) => button.textContent.trim() === 'Huỷ',
  ) as HTMLButtonElement | undefined
  expect(cancel).toBeDefined()
  cancel?.click()
  await navigation
  expect(router.currentRoute.value.path).toBe('/products/new')
  expect(wrapper.find('input[name="name"]').element).toHaveProperty('value', 'Chưa lưu')
})
