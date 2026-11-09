import type { RouteRecordRaw } from 'vue-router'
export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('./views/DashboardView.vue'),
    meta: {
      titleKey: 'nav.dashboard',
      command: { icon: 'i-lucide-layout-dashboard', group: 'navigate', shortcut: ['g', 'd'] },
    },
  },
]
