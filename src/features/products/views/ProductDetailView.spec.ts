import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import ProductDetailView from './ProductDetailView.vue'

it('sanitizes product descriptions before rendering and hides edit without write permission', async () => {
  const { wrapper } = await renderFeature(ProductDetailView, {
    path: '/products/p1',
    routePath: '/products/:id',
    mock(http) {
      http.onGet(/\/products\/p1$/).reply(200, {
        id: 'p1',
        name: 'Áo linen',
        description: '<p>Mềm mại</p><img src=x onerror="alert(1)"><script>alert(1)</script>',
        status: 'draft',
        price: 250000,
        variants: [],
        images: [],
      })
    },
  })
  expect(wrapper.text()).toContain('Mềm mại')
  expect(wrapper.find('[data-description] script').exists()).toBe(false)
  expect(wrapper.find('[data-description] img').attributes('onerror')).toBeUndefined()
  expect(wrapper.find('a[href="/products/p1/edit"]').exists()).toBe(false)
})
