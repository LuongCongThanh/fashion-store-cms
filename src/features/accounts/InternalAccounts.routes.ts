import type { RouteRecordRaw } from 'vue-router'
export const internalAccountRoutes: RouteRecordRaw[] = [
  {
    path: 'internal-accounts',
    name: 'internal-accounts.list',
    component: () => import('./views/InternalAccountListView.vue'),
    meta: {
      permission: 'ADMINISTRATION_INTERNAL_ACCOUNT_VIEW',
      titleKey: 'internalAccounts.title',
      sidebarGroup: 'administration',
      command: { icon: 'i-lucide-user-cog', group: 'navigate' },
    },
  },
  {
    path: 'internal-accounts/new',
    name: 'internal-accounts.create',
    component: () => import('./views/InternalAccountCreateView.vue'),
    meta: { permission: 'ADMINISTRATION_INTERNAL_ACCOUNT_MANAGE', titleKey: 'common.create' },
  },
  {
    path: 'internal-accounts/:id/edit',
    name: 'internal-accounts.edit',
    component: () => import('./views/InternalAccountEditView.vue'),
    // Ai xem được danh sách đều mở được chi tiết; không có quyền MANAGE thì chỉ xem.
    meta: { permission: 'ADMINISTRATION_INTERNAL_ACCOUNT_VIEW', titleKey: 'common.edit' },
  },
]
