import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@shared/lib/api/errors/ApiError'
import { renderWithPlugins } from '@test/Render'

import ErrorState from './ErrorState.vue'

describe('ErrorState', () => {
  it('calls onRetry when the user clicks Retry', async () => {
    const onRetry = vi.fn()
    const { wrapper } = renderWithPlugins(ErrorState, {
      props: { error: new ApiError(500, 'SERVER_ERROR', 'raw'), onRetry },
    })

    await wrapper.find('[data-action="retry"]').trigger('click')
    await flushPromises()

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('never shows the raw backend message', () => {
    const { wrapper } = renderWithPlugins(ErrorState, {
      props: { error: new ApiError(500, 'SERVER_ERROR', 'NullPointerException at Foo.java:42') },
    })

    expect(wrapper.text()).not.toContain('NullPointerException')
  })
})
