import type { RouteRecordRaw } from 'vue-router'
export const roleRoutes: RouteRecordRaw[] = [
  {
    path: 'roles',
    name: 'roles.list',
    component: () => import('./views/RoleListView.vue'),
    meta: {
      permission: 'role:read',
      titleKey: 'roles.title',
      sidebarGroup: 'system',
      command: { icon: 'i-lucide-shield', group: 'navigate' },
    },
  },
  {
    path: 'roles/new',
    name: 'roles.create',
    component: () => import('./views/RoleCreateView.vue'),
    meta: { permission: 'role:write', titleKey: 'common.create' },
  },
  {
    path: 'roles/:id/edit',
    name: 'roles.edit',
    component: () => import('./views/RoleEditView.vue'),
    meta: { permission: 'role:write', titleKey: 'common.edit' },
  },
]
