import UApp from '@nuxt/ui/components/App.vue'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import type { Component } from 'vue'
import type { Router } from 'vue-router'

import { createAppRuntime } from '@app/Runtime'
import { useLocale } from '@shared/lib/i18n/I18n'

import type { CurrentUser } from '@features/auth/types/Auth.types'
import type { Notifier } from '@shared/composables/UseNotify'
import type { SessionSnapshot } from '@shared/lib/session/Session'

type MountOptions = Parameters<typeof mount>[1]

export interface RenderOptions {
  /** Trạng thái Session ban đầu; mặc định đã đăng nhập ở store-1. */
  session?: SessionSnapshot
  /** Router riêng; mặc định memory history với route `auth.login`. */
  router?: Router
  /**
   * User đã đăng nhập, gán thẳng vào auth store (bỏ qua `/auth/me`).
   * Dùng khi test cần quyền tuỳ ý mà ma trận role chưa có; test luồng `/auth/me` thì stub DTO bằng `buildUserDto`.
   */
  user?: CurrentUser
  /** Props cho component được render. */
  props?: Record<string, unknown>
  mount?: MountOptions
}

/** Notifier giả: ghi lại lời gọi để assert toast. */
export function createFakeNotifier() {
  return { success: vi.fn(), error: vi.fn(), prompt: vi.fn() } satisfies Notifier
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
  const notifier = createFakeNotifier()
  const runtime = createAppRuntime({
    transport: http.adapter(),
    notifier,
    session: options.session ?? { accessToken: 'test-token', storeId: 'store-1' },
    retry: false,
    router: options.router ?? defaultRouter(),
  })
  // Hydrate state của store 'auth' qua Pinia, không import store nội bộ feature (§B.3).
  if (options.user) runtime.pinia.state.value.auth = { user: options.user }
  // Bọc UApp như App.vue ở prod: toast, overlay (useConfirm), locale Nuxt UI cần nó.
  const Root = defineComponent({
    setup() {
      const { uiLocale } = useLocale()
      return () => h(UApp, { locale: uiLocale.value }, { default: () => h(component, options.props) })
    },
  })
  const wrapper = mount(Root, { ...options.mount, global: { plugins: [runtime.plugin] } })
  return { wrapper, http, notifier, runtime }
}
