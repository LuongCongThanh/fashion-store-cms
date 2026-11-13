import { expect, test } from '@playwright/test'

import { mockApi } from './MockApi.js'

const white = { id: 'color-white', code: 'WHT', name: 'White', hex: '#FFFFFF' }
/** JSON `GET /admin/products/:id` (dữ liệu trên dây). Size rất dài để kiểm bảng Biến thể không tràn ngang. */
const product = {
  id: 'audit-product',
  name: 'Áo linen',
  slug: 'ao-linen',
  description: null,
  categoryId: 'linen',
  weightGrams: 200,
  status: 'DRAFT',
  publishedAt: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  images: Array.from({ length: 6 }, (_, i) => ({
    id: `image-${i}`,
    productId: 'audit-product',
    colorId: white.id,
    storageKey: `products/audit-product/${i}`,
    url: '/audit-image.svg',
    altText: `Linen ${i}`,
    sortOrder: i,
    isPrimary: i === 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  })),
  variants: [
    {
      id: 'variant-1',
      productId: 'audit-product',
      sku: 'LINEN-WHT-M',
      price: 250000,
      status: 'ACTIVE',
      size: { id: 'size-m', code: 'M'.repeat(30), name: 'M' },
      color: white,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
}
const emptyPage = { data: [], meta: { page: 1, limit: 100, total: 0, totalPages: 0 } }

for (const width of [375, 1280]) {
  for (const theme of ['light', 'dark']) {
    test(`Product images and Variant table fit ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.addInitScript((mode) => {
        localStorage.setItem('cms.colorMode', mode)
      }, theme)
      await page.route('**/audit-image.svg', (route) =>
        route.fulfill({
          contentType: 'image/svg+xml',
          body: '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="silver"/></svg>',
        }),
      )
      await mockApi(page, {
        role: 'ADMIN',
        handle: (path) =>
          path.endsWith('/products/audit-product') ? product : path.endsWith('/categories') ? emptyPage : undefined,
      })
      for (const path of ['/products/audit-product/edit']) {
        await page.goto(path)
        await expect(page.locator('img[alt="Linen 0"]')).toBeVisible()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
        expect(
          await page.locator('img[alt="Linen 0"]').evaluate((image) => {
            for (let parent = image.parentElement; parent; parent = parent.parentElement) {
              if (parent.scrollWidth > parent.clientWidth) return false
            }
            return true
          }),
        ).toBe(true)
        const images = page.locator('img[alt^="Linen "]')
        await expect(images).toHaveCount(6)
        const box = await images.first().boundingBox()
        expect(box ? box.width / box.height : 0).toBeCloseTo(0.75, 1)
        await expect(page.getByRole('columnheader', { name: 'SKU', exact: true })).toBeVisible()
        await page.screenshot({
          path: test.info().outputPath('editor.png'),
          fullPage: true,
        })
      }
      await page.context().setOffline(true)
      const banner = page.getByTestId('offline-banner')
      await expect(banner).toBeVisible()
      const ratio = await banner.evaluate((element) => {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 1
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas unavailable')
        const chain: Element[] = []
        for (let parent: Element | null = element; parent; parent = parent.parentElement) chain.unshift(parent)
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 1, 1)
        for (const parent of chain) {
          ctx.fillStyle = getComputedStyle(parent).backgroundColor
          ctx.fillRect(0, 0, 1, 1)
        }
        const luminance = () => {
          const [r = 0, g = 0, b = 0] = [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3).map((value) => {
            const channel = value / 255
            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
          })
          return r * 0.2126 + g * 0.7152 + b * 0.0722
        }
        const background = luminance()
        ctx.fillStyle = getComputedStyle(element.querySelector('[data-slot="title"]') ?? element).color
        ctx.fillRect(0, 0, 1, 1)
        const foreground = luminance()
        return (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05)
      })
      test.info().annotations.push({ type: 'contrast', description: `${theme}: ${ratio.toFixed(2)}:1` })
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    })
  }
}
