import { expect, test } from '@playwright/test'

import { mockApi } from './MockApi.js'

// Smoke: app khởi động được và luồng chính chạy. Phiên được giả lập qua refresh cookie của BE.
test('unauthenticated visitor is sent to the login page', async ({ page }) => {
  await mockApi(page)
  await page.goto('/')

  await expect(page).toHaveURL(/\/login\?redirect=\/$/)
  await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible()
})

test('signed-in user reaches the dashboard with store switcher and user menu', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('cms.session.storeId', 'store-1'); })
  await mockApi(page, { role: 'ADMIN' })
  await page.goto('/')

  await expect(page).toHaveURL(/:\d+\/$/)
  await expect(page.getByRole('button', { name: 'Cửa hàng Quận 1' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Menu tài khoản' })).toBeVisible()
})
