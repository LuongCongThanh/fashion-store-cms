import { expect, it } from 'vitest'

import { plainSpaces } from '@test/Intl'
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

it('shows the product price as money', async () => {
  const { wrapper } = await renderFeature(ProductDetailView, {
    path: '/products/p1',
    routePath: '/products/:id',
    mock(http) {
      http.onGet(/\/products\/p1$/).reply(200, {
        id: 'p1',
        name: 'Áo linen',
        description: '',
        status: 'draft',
        price: 1_890_000,
        variants: [],
        images: [],
      })
    },
  })
  expect(plainSpaces(wrapper.text())).toContain('1.890.000 ₫')
})

it.each([
  ['vi', ['SKU', 'Biến thể', 'Giá', 'Tồn kho']],
  ['en', ['SKU', 'Variants', 'Price', 'Stock']],
] as const)('renders translated Variant columns and formatted values in %s', async (locale, headers) => {
  localStorage.setItem('cms.locale', locale)
  const { wrapper } = await renderFeature(ProductDetailView, {
    path: '/products/p1',
    routePath: '/products/:id',
    mock(http) {
      http.onGet(/\/products\/p1$/).reply(200, {
        id: 'p1',
        name: 'Linen',
        description: '',
        status: 'draft',
        price: 250000,
        variants: [{ sku: 'LIN-M', size: 'M', color: 'White', price: 250000, stock: 12 }],
        images: [{ id: 'a', name: 'Linen', url: '/linen.jpg' }],
      })
    },
  })
  expect(wrapper.findAll('th').map((header) => header.text())).toEqual(headers)
  expect(wrapper.find('td').text()).toBe('LIN-M')
  expect(plainSpaces(wrapper.findAll('td')[2]?.text() ?? '')).toBe(locale === 'vi' ? '250.000 ₫' : '₫250,000')
  expect(wrapper.findAll('td')[3]?.text()).toBe('12')
  expect(wrapper.find('img[alt="Linen"]').attributes('loading')).toBe('lazy')
  expect(wrapper.find('button[aria-haspopup="menu"]').exists()).toBe(false)
})
