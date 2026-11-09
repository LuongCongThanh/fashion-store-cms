import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import { usePrototypeVariant } from '@shared/composables/UsePrototypeVariant'

async function variantAt(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })
  await router.push(path)
  let result = ''
  const Probe = defineComponent(() => {
    const variant = usePrototypeVariant(['A', 'B', 'C'])
    return () => {
      result = variant.value
      return h('span')
    }
  })
  mount(Probe, { global: { plugins: [router] } })
  return result
}

describe('usePrototypeVariant', () => {
  it('returns the requested variant when it is allowed', async () => {
    expect(await variantAt('/?variant=B')).toBe('B')
  })

  it('falls back to the first variant when missing or unknown', async () => {
    expect(await variantAt('/')).toBe('A')
    expect(await variantAt('/?variant=Z')).toBe('A')
  })
})
