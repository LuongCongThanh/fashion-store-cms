import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { renderWithPlugins } from '@test/Render'

import { useStoreScope } from './UseStoreScope'

function renderScope(storeId?: string) {
  let scope!: ReturnType<typeof useStoreScope>
  const Host = defineComponent({
    setup() {
      scope = useStoreScope()
      return () => h('span', scope.current.value?.name ?? 'none')
    },
  })
  const result = renderWithPlugins(Host, { session: { accessToken: 't', storeId } })
  return { ...result, scope: () => scope }
}

describe('useStoreScope', () => {
  it('switches the current store and sends its id on later requests', async () => {
    const { wrapper, http, runtime, scope } = renderScope('store-1')
    http.onGet(/\/products$/).reply(200, [])
    const second = scope().stores.value.find((s) => s.id !== 'store-1')
    if (!second) throw new Error('stub cần ít nhất 2 Store')

    await scope().switchStore(second.id)
    await flushPromises()
    await runtime.http.get('/products')

    expect(scope().storeId.value).toBe(second.id)
    expect(wrapper.text()).toBe(second.name)
    expect(http.history.get[0]?.headers?.['X-Store-Id']).toBe(second.id)
  })

  it('drops cached data of the previous store', async () => {
    const { runtime, scope } = renderScope('store-1')
    runtime.queryClient.setQueryData(['products', 'list'], ['store-1 product'])

    await scope().switchStore('store-2')

    expect(runtime.queryClient.getQueryData(['products', 'list'])).toBeUndefined()
  })
})
