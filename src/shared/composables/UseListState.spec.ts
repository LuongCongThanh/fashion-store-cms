import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { z } from 'zod'

import { renderWithPlugins } from '@test/Render'

import { useListState } from './UseListState'

const schema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(''),
  status: z.enum(['draft', 'published']).optional(),
  sort: z.string().default('-createdAt'),
})

it('restores validated URL state and resets page when a filter changes', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/products', component: { render: () => null } }],
  })
  await router.push('/products?page=3&search=shirt&status=wrong')
  let list: ReturnType<typeof useListState<typeof schema>> | undefined
  renderWithPlugins(
    defineComponent({
      setup() {
        list = useListState(schema)
        return () => h('div')
      },
    }),
    { router },
  )
  expect(list?.params.value).toEqual({ page: 3, pageSize: 20, search: 'shirt', sort: '-createdAt' })
  await list?.setFilter('status', 'draft')
  expect(router.currentRoute.value.query.page).toBe('1')
  expect(list?.params.value.status).toBe('draft')
  router.back()
  await flushPromises()
  expect(list?.params.value.page).toBe(3)
})

it('debounces search without dropping it when another filter changes', async () => {
  const { vi } = await import('vitest')
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/products', component: { render: () => null } }],
  })
  await router.push('/products?page=4&tab=overview')
  let list: ReturnType<typeof useListState<typeof schema>> | undefined
  renderWithPlugins(
    defineComponent({
      setup() {
        list = useListState(schema)
        return () => h('div')
      },
    }),
    { router },
  )
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  try {
    await list?.setFilter('search', 'linen')
    expect(router.currentRoute.value.query.search).toBeUndefined()
    await list?.setFilter('status', 'draft')
    await vi.advanceTimersByTimeAsync(300)
    await flushPromises()
    expect(router.currentRoute.value.query).toMatchObject({
      page: '1',
      search: 'linen',
      status: 'draft',
      tab: 'overview',
    })
    await list?.reset()
    expect(router.currentRoute.value.query).toEqual({ tab: 'overview' })
  } finally {
    vi.useRealTimers()
  }
})
