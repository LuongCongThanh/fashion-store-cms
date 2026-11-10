import UAlert from '@nuxt/ui/components/Alert.vue'
import { expect, it, vi } from 'vitest'

import { renderWithPlugins } from '@test/Render'

import OfflineBanner from './OfflineBanner.vue'

it('uses a readable warning when offline and hides it after reconnecting', async () => {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
  const { wrapper } = renderWithPlugins(OfflineBanner)
  expect(wrapper.findComponent(UAlert).props('variant')).toBe('subtle')
  expect(wrapper.findComponent(UAlert).props('color')).toBe('warning')
  window.dispatchEvent(new Event('online'))
  await wrapper.vm.$nextTick()
  expect(wrapper.find('[data-testid="offline-banner"]').exists()).toBe(false)
})
