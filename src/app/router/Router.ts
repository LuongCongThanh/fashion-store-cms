import { createRouter, createWebHistory } from 'vue-router'

import { authGuard } from './Guards'
import { routes } from './Routes'

/** Router của app: routes từ Routes.ts + guard đăng nhập/quyền. */
export function createAppRouter() {
  const router = createRouter({ history: createWebHistory(), routes })
  router.beforeEach(authGuard)
  return router
}
