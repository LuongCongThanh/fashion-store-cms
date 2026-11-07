import { describe, expect, it } from 'vitest'

import type { RouteRecordRaw } from 'vue-router'

import { buildNavigation } from './Navigation'

const View = { render: () => null }

const ROUTES: RouteRecordRaw[] = [
  { path: '/login', name: 'auth.login', component: View, meta: { titleKey: 'auth.login.title' } },
  {
    path: '/admin',
    component: View,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: View,
        meta: {
          titleKey: 'nav.dashboard',
          command: { icon: 'i-lucide-home', group: 'navigate', shortcut: ['g', 'd'] },
        },
      },
      {
        path: 'orders',
        name: 'orders.list',
        component: View,
        meta: {
          titleKey: 'nav.orders',
          permission: 'orders.read',
          command: { icon: 'i-lucide-receipt', group: 'navigate', shortcut: ['g', 'o'] },
        },
      },
      {
        path: 'products/new',
        name: 'products.create',
        component: View,
        meta: {
          titleKey: 'products.create',
          permission: 'products.write',
          command: { icon: 'i-lucide-plus', group: 'create', shortcut: ['n'] },
        },
      },
    ],
  },
]

const allow = (granted: string[]) => (permission: string) => granted.includes(permission)

describe('buildNavigation', () => {
  it('lists navigate routes in the sidebar, hiding those the user cannot access', () => {
    expect(buildNavigation(ROUTES, allow([])).sidebar).toEqual([
      { name: 'home', path: '/admin', titleKey: 'nav.dashboard', icon: 'i-lucide-home' },
    ])

    expect(buildNavigation(ROUTES, allow(['orders.read'])).sidebar.map((i) => i.path)).toEqual([
      '/admin',
      '/admin/orders',
    ])
  })

  it('builds palette commands for every permitted route with a command', () => {
    const { commands } = buildNavigation(ROUTES, allow(['products.write']))

    expect(commands).toEqual([
      {
        name: 'home',
        path: '/admin',
        titleKey: 'nav.dashboard',
        icon: 'i-lucide-home',
        group: 'navigate',
      },
      {
        name: 'products.create',
        path: '/admin/products/new',
        titleKey: 'products.create',
        icon: 'i-lucide-plus',
        group: 'create',
      },
    ])
  })

  it('collects keyboard shortcuts from permitted routes', () => {
    const { shortcuts } = buildNavigation(ROUTES, allow(['orders.read']))

    expect(shortcuts).toEqual([
      { keys: ['g', 'd'], path: '/admin', titleKey: 'nav.dashboard' },
      { keys: ['g', 'o'], path: '/admin/orders', titleKey: 'nav.orders' },
    ])
  })

  it('derives the page title key from the deepest matched route', () => {
    const { titleOf } = buildNavigation(ROUTES, allow([]))

    expect(
      titleOf({
        matched: [{ meta: { requiresAuth: true } }, { meta: { titleKey: 'nav.orders' } }],
      }),
    ).toBe('nav.orders')
    expect(titleOf({ matched: [{ meta: { titleKey: 'nav.dashboard' } }, { meta: {} }] })).toBe(
      'nav.dashboard',
    )
    expect(titleOf({ matched: [{ meta: {} }] })).toBeNull()
  })
})
