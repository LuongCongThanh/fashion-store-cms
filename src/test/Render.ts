import UApp from '@nuxt/ui/components/App.vue'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import type { Component } from 'vue'
import type { Router } from 'vue-router'

import { createAppRuntime } from '@app/Runtime'

import type { SessionSnapshot } from '@shared/lib/session/Session'

type MountOptions = Parameters<typeof mount>[1]

export interface RenderOptions {
  /** Trạng thái Session ban đầu; mặc định đã đăng nhập ở store-1. */
  session?: SessionSnapshot
  /** Router riêng; mặc định memory history với route `auth.login`. */
  router?: Router
  /** Props cho component được render. */
  props?: Record<string, unknown>
  mount?: MountOptions
}

function defaultRouter() {
  const Blank = { render: () => null }
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Blank },
      { path: '/login', name: 'auth.login', component: Blank },
    ],
  })
}

/**
 * Mount component với CHÍNH createAppRuntime() của app (D37) + override cho test.
 * Trả `http` (axios-mock-adapter) để khai báo response; mỗi lần gọi là một runtime mới.
 */
export function renderWithPlugins(component: Component, options: RenderOptions = {}) {
  const http = new MockAdapter(axios.create())
  const runtime = createAppRuntime({
    transport: http.adapter(),
    session: options.session ?? { accessToken: 'test-token', storeId: 'store-1' },
    retry: false,
    router: options.router ?? defaultRouter(),
  })
  // Bọc UApp như App.vue ở prod: toast, overlay (useConfirm) cần nó.
  const Root = defineComponent({
    render: () => h(UApp, null, { default: () => h(component, options.props) }),
  })
  const wrapper = mount(Root, { ...options.mount, global: { plugins: [runtime.plugin] } })
  return { wrapper, http, runtime }
}
