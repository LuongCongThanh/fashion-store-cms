import { createRouter, createWebHistory } from 'vue-router'

import { buildNavigation } from '@layouts/Navigation'

import { authGuard } from './Guards'
import { routes } from './Routes'

/** Router của app: routes từ Routes.ts + guard đăng nhập/quyền + document.title. */
export function createAppRouter(deps: { translate: (key: string) => string }) {
  const router = createRouter({ history: createWebHistory(), routes })
  router.beforeEach(authGuard)

  // Title lấy từ Navigation (không tự đọc meta.titleKey ở đây, §S.1).
  const { titleOf } = buildNavigation(routes, () => true)
  const appName = () => deps.translate('common.appName')
  router.afterEach((to) => {
    const key = titleOf(to)
    document.title = key ? `${deps.translate(key)} · ${appName()}` : appName()
  })
  return router
}
