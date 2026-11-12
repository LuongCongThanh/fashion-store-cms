import type { Page, Route } from '@playwright/test'

type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER'

/**
 * Giả lập phiên BE cho e2e: refresh cookie thành công (đã đăng nhập) hoặc trả 401 (khách).
 * `handle` trả dữ liệu cho các path còn lại; trả undefined thì mặc định `[]`.
 */
export async function mockApi(
  page: Page,
  options: { role?: Role; handle?: (path: string) => unknown } = {},
) {
  await page.route('/api/**', (route: Route) => {
    const path = new URL(route.request().url()).pathname
    if (path.endsWith('/auth/refresh')) {
      return options.role
        ? route.fulfill({ json: { accessToken: 'e2e-access-token' } })
        : route.fulfill({ status: 401, json: { statusCode: 401, message: 'Unauthorized', requestId: 'e2e' } })
    }
    if (path.endsWith('/auth/me')) {
      return route.fulfill({
        json: { id: 'e2e-user', email: 'e2e@example.com', fullName: 'E2E User', role: options.role, emailVerified: true },
      })
    }
    return route.fulfill({ json: options.handle?.(path) ?? [] })
  })
}
