import { expect, test } from '@playwright/test'

// Smoke: app khởi động được và luồng chính chạy. Form đăng nhập thật có ở P2 → hiện seed Session.
test('unauthenticated visitor is sent to the login page', async ({ page }) => {
  await page.goto('/admin')

  await expect(page).toHaveURL(/\/login\?redirect=\/admin$/)
  await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible()
})

test('signed-in user reaches the dashboard with store switcher and user menu', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('cms.session.accessToken', 'e2e-token')
    localStorage.setItem('cms.session.refreshToken', 'e2e-refresh')
    localStorage.setItem('cms.session.storeId', 'store-1')
  })

  await page.goto('/')

  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole('button', { name: 'Cửa hàng Quận 1' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Menu tài khoản' })).toBeVisible()
})
