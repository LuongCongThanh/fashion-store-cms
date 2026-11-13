import type { Page, Route } from '@playwright/test'

type Role = 'ADMIN' | 'STAFF' | 'CUSTOMER'

/** Vai trò và Quyền mà `/auth/me` của BE trả cho từng loại tài khoản (theo seed Vai trò hệ thống). */
const ME_BY_ROLE: Record<Role, { roles: string[]; permissions: string[] }> = {
  ADMIN: {
    roles: ['Admin'],
    permissions: [
      'CATALOG_PRODUCT_VIEW',
      'CATALOG_PRODUCT_MANAGE',
      'CATALOG_CATEGORY_VIEW',
      'CATALOG_CATEGORY_MANAGE',
      'CATALOG_PRODUCT_OPTION_VIEW',
      'CATALOG_PRODUCT_OPTION_MANAGE',
      'ADMINISTRATION_ROLE_VIEW',
      'ADMINISTRATION_ROLE_MANAGE',
      'ADMINISTRATION_INTERNAL_ACCOUNT_VIEW',
      'ADMINISTRATION_INTERNAL_ACCOUNT_MANAGE',
    ],
  },
  STAFF: { roles: ['Staff'], permissions: ['CATALOG_PRODUCT_VIEW', 'CATALOG_CATEGORY_VIEW', 'CATALOG_PRODUCT_OPTION_VIEW'] },
  CUSTOMER: { roles: [], permissions: [] },
}

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
        json: {
          id: 'e2e-user',
          email: 'e2e@example.com',
          fullName: 'E2E User',
          role: options.role,
          emailVerified: true,
          ...(options.role ? ME_BY_ROLE[options.role] : { roles: [], permissions: [] }),
        },
      })
    }
    return route.fulfill({ json: options.handle?.(path) ?? [] })
  })
}
