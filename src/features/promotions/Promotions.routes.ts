import type { RouteRecordRaw } from 'vue-router'
export const promotionRoutes: RouteRecordRaw[] = [
  {
    path: 'promotions',
    name: 'promotions.list',
    component: () => import('./views/PromotionListView.vue'),
    meta: {
      permission: 'promotion:read',
      titleKey: 'promotions.title',
      sidebarGroup: 'catalog',
      command: { icon: 'i-lucide-ticket-percent', group: 'navigate' },
    },
  },
  {
    path: 'promotions/new',
    name: 'promotions.create',
    component: () => import('./views/PromotionCreateView.vue'),
    meta: { permission: 'promotion:write', titleKey: 'common.create' },
  },
  {
    path: 'promotions/:id/edit',
    name: 'promotions.edit',
    component: () => import('./views/PromotionEditView.vue'),
    meta: { permission: 'promotion:write', titleKey: 'common.edit' },
  },
]
