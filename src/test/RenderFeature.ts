import { flushPromises } from '@vue/test-utils'
import { defineComponent, h, onMounted } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'

import type { Component } from 'vue'

import { useAuth } from '@features/auth/UseAuth'

import { buildUser } from './factories/User.factory'
import { renderWithPlugins } from './Render'

export async function renderFeature(
  view: Component,
  options: {
    path: string
    routePath?: string
    permissions?: string[]
    mock: (http: ReturnType<typeof renderWithPlugins>['http']) => void
  },
) {
  const Host = defineComponent({
    setup() {
      const { ensureUser } = useAuth()
      onMounted(() => void ensureUser())
      return () => h(view)
    },
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: options.routePath ?? '/:rest(.*)*', component: Host },
      ...(options.routePath ? [{ path: '/:unmatched(.*)*', component: { render: () => null } }] : []),
    ],
  })
  await router.push(options.path)
  const result = renderWithPlugins(RouterView, {
    router,
    user: buildUser({ permissions: options.permissions ?? [] }),
    mount: { attachTo: document.body },
  })
  options.mock(result.http)
  await flushPromises()
  return { ...result, router }
}
