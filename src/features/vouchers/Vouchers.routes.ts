import type { RouteRecordRaw } from 'vue-router'
export const voucherRoutes: RouteRecordRaw[] = [
  {
    path: 'vouchers',
    name: 'vouchers.list',
    component: () => import('./views/VoucherListView.vue'),
    meta: {
      permission: 'PRICING_VOUCHER_VIEW',
      titleKey: 'vouchers.title',
      sidebarGroup: 'catalog',
      command: { icon: 'i-lucide-ticket-percent', group: 'navigate' },
    },
  },
  {
    path: 'vouchers/new',
    name: 'vouchers.create',
    component: () => import('./views/VoucherCreateView.vue'),
    meta: { permission: 'PRICING_VOUCHER_MANAGE', titleKey: 'vouchers.create' },
  },
  {
    path: 'vouchers/:id/edit',
    name: 'vouchers.edit',
    component: () => import('./views/VoucherEditView.vue'),
    meta: { permission: 'PRICING_VOUCHER_VIEW', titleKey: 'common.edit' },
  },
]
