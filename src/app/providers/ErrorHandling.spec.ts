import { flushPromises } from '@vue/test-utils'
import { CanceledError } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import { createFakeNotifier } from '@test/Render'

import { installErrorHandling } from './ErrorHandling'

function setup() {
  const notifier = createFakeNotifier()
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })
  const reload = vi.fn()
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
  return { notifier, router, reload, consoleError }
}

describe('installErrorHandling', () => {
  it('toasts and logs errors thrown while rendering', async () => {
    const { notifier, router, reload, consoleError } = setup()
    const boom = new Error('render failed')
    const Broken = {
      setup() {
        throw boom
      },
      render: () => null,
    }

    const app = createApp(Broken)
    installErrorHandling(app, { router, notifier, reload })
    app.mount(document.createElement('div'))
    await flushPromises()

    expect(notifier.error).toHaveBeenCalledWith(boom)
    expect(consoleError).toHaveBeenCalled()
  })

  it('toasts unhandled promise rejections except aborted requests', () => {
    const { notifier, router, reload } = setup()
    const dispose = installErrorHandling(createApp({ render: () => null }), {
      router,
      notifier,
      reload,
    })
    const reject = (reason: unknown) => {
      const event = new Event('unhandledrejection') as Event & { reason: unknown }
      event.reason = reason
      window.dispatchEvent(event)
    }

    const failure = new Error('async failure')
    reject(failure)
    reject(new CanceledError())

    expect(notifier.error).toHaveBeenCalledTimes(1)
    expect(notifier.error).toHaveBeenCalledWith(failure)
    dispose()
  })

  it('reloads the page once when a route chunk fails to load', async () => {
    const { notifier, reload } = setup()
    const chunkError = new TypeError('Failed to fetch dynamically imported module: /assets/X.js')
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { render: () => null } },
        { path: '/lazy', component: () => Promise.reject(chunkError) },
      ],
    })
    installErrorHandling(createApp({ render: () => null }), { router, notifier, reload })

    await router.push('/lazy').catch(() => undefined)
    await router.push('/lazy').catch(() => undefined)

    expect(reload).toHaveBeenCalledTimes(1)
  })
})
