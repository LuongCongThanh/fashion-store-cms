import type { RouteRecordRaw } from 'vue-router'
export const roleRoutes: RouteRecordRaw[] = [
  {
    path: 'roles',
    name: 'roles.list',
    component: () => import('./views/RoleListView.vue'),
    meta: {
      permission: 'ADMINISTRATION_ROLE_VIEW',
      titleKey: 'roles.title',
      sidebarGroup: 'administration',
      command: { icon: 'i-lucide-shield', group: 'navigate' },
    },
  },
  {
    path: 'roles/new',
    name: 'roles.create',
    component: () => import('./views/RoleCreateView.vue'),
    meta: { permission: 'ADMINISTRATION_ROLE_MANAGE', titleKey: 'common.create' },
  },
  {
    path: 'roles/:id/edit',
    name: 'roles.edit',
    component: () => import('./views/RoleEditView.vue'),
    // Ai xem được Vai trò đều mở được chi tiết; không có ADMINISTRATION_ROLE_MANAGE thì form chỉ đọc.
    meta: { permission: 'ADMINISTRATION_ROLE_VIEW', titleKey: 'common.edit' },
  },
]
