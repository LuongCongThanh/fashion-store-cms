import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import type { Page, Route } from '@playwright/test'

const permissions = [
  'product:read', 'product:write', 'category:read', 'category:write', 'inventory:read', 'inventory:write',
  'order:read', 'order:write', 'customer:read', 'promotion:read', 'promotion:write', 'user:read', 'role:read',
  'settings:read', 'settings:write',
]
const meta = { page: 1, pageSize: 20, total: 1, totalPages: 1 }
const product = {
  id: 'p1', name: 'Áo blazer linen phiên bản giới hạn rất dài', description: '', brand: 'Fashion', price: 15_500_000,
  comparePrice: 16_000_000, cost: 8_000_000, categoryIds: [], images: [], mainImageId: '',
  variants: [{ sku: 'BLAZER-LINEN-LIMITED-XL', size: 'XL', color: 'Đen', price: 15_500_000, stock: 0 }],
  slug: 'ao-blazer-linen', metaTitle: 'Áo blazer linen', metaDescription: '', status: 'draft', imageUrl: '',
}
const order = {
  id: 'o1', number: 'ORD-2026-000001', status: 'pending', paymentStatus: 'unpaid', subtotal: 15_500_000,
  discount: 0, shippingCost: 30_000, total: 15_530_000,
  customer: { name: 'Nguyễn Thị Khách Hàng Có Tên Rất Dài', email: 'very-long-customer-email-address@example-fashion-store.vn' },
  shipping: { address: '123 đường Rất Dài, phường Trung Tâm, Thành phố Hồ Chí Minh', carrier: 'GHN', trackingNumber: 'TRACKING-CODE-VERY-LONG-000001' },
  payment: { method: 'COD', reference: 'PAYMENT-REFERENCE-VERY-LONG-000001' },
  items: [{ id: 'i1', name: product.name, sku: 'BLAZER-LINEN-LIMITED-XL', quantity: 1, price: product.price }],
  timeline: [{ id: 't1', label: 'Đặt hàng', createdAt: '2026-11-10T01:00:00.000Z' }],
}

async function mockApp(page: Page, authenticated = true) {
  if (authenticated) await page.addInitScript(() => {
    localStorage.setItem('cms.session.accessToken', 'visual-token')
    localStorage.setItem('cms.session.refreshToken', 'visual-refresh')
    localStorage.setItem('cms.session.storeId', 'store-1')
  })
  await page.route('http://localhost:8080/api/**', async (route: Route) => {
    const path = new URL(route.request().url()).pathname
    let body: unknown = { data: [], meta: { ...meta, total: 0, totalPages: 0 } }
    if (path.endsWith('/auth/me')) body = { id: 'visual-admin', name: 'Mock Admin', email: 'admin@cms.local', permissions }
    else if (path.endsWith('/products/p1')) body = product
    else if (path.endsWith('/products')) body = { data: [product], meta }
    else if (path.endsWith('/categories')) body = [{ id: 'c1', name: 'Thời trang nữ', parentId: null }, { id: 'c2', name: 'Áo blazer', parentId: 'c1' }]
    else if (path.endsWith('/orders/o1')) body = order
    else if (path.endsWith('/orders')) body = { data: [order], meta }
    else if (path.includes('/dashboard/low-stock')) body = { items: [{ id: 'v1', label: product.name, value: 0 }] }
    else if (path.includes('/dashboard/recent-orders')) body = { items: [{ id: 'o1', label: order.number, value: order.total }] }
    else if (path.includes('/dashboard/')) body = { value: 12, points: [{ label: 'T2', value: 10 }, { label: 'T3', value: 12 }], items: [] }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
  })
}

const screens = [
  { name: 'login', path: '/login', auth: false },
  { name: 'dashboard', path: '/', auth: true },
  { name: 'product-list', path: '/products', auth: true },
  { name: 'product-edit', path: '/products/p1/edit', auth: true },
  { name: 'category-tree', path: '/categories', auth: true },
  { name: 'order-detail', path: '/orders/o1', auth: true },
  { name: 'design-system', path: '/design-system', auth: true },
] as const
const viewports = [{ name: 'mobile', width: 375, height: 812 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'desktop', width: 1280, height: 900 }] as const

for (const screen of screens) for (const viewport of viewports) for (const theme of ['light', 'dark'] as const) {
  test(`${screen.name} ${viewport.name} ${theme}`, async ({ page }, testInfo) => {
    const pageErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') pageErrors.push(message.text()) })
    page.on('response', (response) => { if (response.status() >= 400) pageErrors.push(`${response.status()} ${response.url()}`) })
    await page.setViewportSize(viewport)
    await mockApp(page, screen.auth)
    await page.addInitScript((value) => { localStorage.setItem('cms.colorMode', value) }, theme)
    await page.goto(screen.path)
    await page.waitForLoadState('networkidle')
    expect(pageErrors).toEqual([])
    await expect(page.locator('#app')).not.toBeEmpty()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow, 'page must not scroll horizontally').toBe(false)

    const axe = await new AxeBuilder({ page }).analyze()
    await testInfo.attach('axe-report', { body: JSON.stringify(axe.violations, null, 2), contentType: 'application/json' })
    await page.screenshot({ path: testInfo.outputPath(`${screen.name}-${viewport.name}-${theme}.png`), fullPage: true })
  })
}

test('mobile app shell is operable', async ({ page }, testInfo) => {
  await page.setViewportSize(viewports[0])
  await mockApp(page)
  await page.goto('/products')
  await page.getByRole('button', { name: /mở thanh bên/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('app-shell-mobile.png'), fullPage: true })
})
