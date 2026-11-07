import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, createApp, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import { authGuard } from './Guards'

// Chỉ mock interface công khai của feature (§I).
const auth = {
  isAuthenticated: ref(false),
  permissions: ref<string[]>([]),
  /** Quyền sẽ có sau khi tải user (giả lập F5: token còn, user chưa tải). */
  permissionsAfterLoad: [] as string[],
}
vi.mock('@features/auth/UseAuth', () => ({
  useAuth: () => ({
    isAuthenticated: computed(() => auth.isAuthenticated.value),
    can: (p: string) => auth.permissions.value.includes(p),
    ensureUser: async () => {
      auth.permissions.value = [...auth.permissions.value, ...auth.permissionsAfterLoad]
    },
  }),
}))

const Blank = { render: () => null }

async function setup(initial = '/login') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', name: 'auth.login', component: Blank, meta: { guestOnly: true } },
      { path: '/', name: 'home', component: Blank, meta: { requiresAuth: true } },
      {
        path: '/orders',
        name: 'orders.list',
        component: Blank,
        meta: { requiresAuth: true, permission: 'orders.read' },
      },
      { path: '/403', name: 'forbidden', component: Blank },
    ],
  })
  router.beforeEach(authGuard)
  createApp(Blank).use(router)
  await router.push(initial)
  return router
}

beforeEach(() => {
  auth.isAuthenticated.value = false
  auth.permissions.value = []
  auth.permissionsAfterLoad = []
})

describe('authGuard', () => {
  it('redirects to login when unauthenticated', async () => {
    const router = await setup()

    await router.push('/')

    expect(router.currentRoute.value.name).toBe('auth.login')
    expect(router.currentRoute.value.query.redirect).toBe('/')
  })

  it('lets authenticated users in', async () => {
    auth.isAuthenticated.value = true
    const router = await setup()

    await router.push('/')

    expect(router.currentRoute.value.name).toBe('home')
  })

  it('sends users without the route permission to forbidden', async () => {
    auth.isAuthenticated.value = true
    const router = await setup()

    await router.push('/orders')

    expect(router.currentRoute.value.name).toBe('forbidden')
  })

  it('allows the route when the user has its permission', async () => {
    auth.isAuthenticated.value = true
    auth.permissions.value = ['orders.read']
    const router = await setup()

    await router.push('/orders')

    expect(router.currentRoute.value.name).toBe('orders.list')
  })

  it('loads the user before checking permissions after a reload', async () => {
    auth.isAuthenticated.value = true
    auth.permissionsAfterLoad = ['orders.read']
    const router = await setup()

    await router.push('/orders')

    expect(router.currentRoute.value.name).toBe('orders.list')
  })

  it('sends a signed-in user away from guest-only pages to /', async () => {
    auth.isAuthenticated.value = true
    const router = await setup('/')

    await router.push('/login')

    expect(router.currentRoute.value.name).toBe('home')
  })

  it('lets a guest open guest-only pages', async () => {
    const router = await setup('/login')

    expect(router.currentRoute.value.name).toBe('auth.login')
  })
})
