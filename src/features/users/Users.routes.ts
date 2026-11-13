import type { RouteRecordRaw } from 'vue-router'
export const userRoutes: RouteRecordRaw[] = [
  {
    path: 'users',
    name: 'users.list',
    component: () => import('./views/UserListView.vue'),
    meta: {
      permission: 'ADMINISTRATION_INTERNAL_ACCOUNT_VIEW',
      titleKey: 'users.title',
      sidebarGroup: 'system',
      command: { icon: 'i-lucide-user-cog', group: 'navigate' },
    },
  },
  {
    path: 'users/new',
    name: 'users.create',
    component: () => import('./views/UserCreateView.vue'),
    meta: { permission: 'ADMINISTRATION_INTERNAL_ACCOUNT_MANAGE', titleKey: 'common.create' },
  },
  {
    path: 'users/:id/edit',
    name: 'users.edit',
    component: () => import('./views/UserEditView.vue'),
    meta: { permission: 'ADMINISTRATION_INTERNAL_ACCOUNT_MANAGE', titleKey: 'common.edit' },
  },
]
