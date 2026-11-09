import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { useLocale } from '@shared/lib/i18n/I18n'
import { renderWithPlugins } from '@test/Render'

import DataTablePagination from './DataTablePagination.vue'

const meta = (total: number) => ({ page: 1, pageSize: 20, total, totalPages: Math.max(1, Math.ceil(total / 20)) })

/** Hiện phân trang + nút đổi sang tiếng Anh. */
function host(total: number) {
  return defineComponent({
    setup() {
      const { setLocale } = useLocale()
      return () =>
        h('div', [
          h('button', {
            'data-action': 'en',
            onClick: () => {
              setLocale('en')
            },
          }),
          h(DataTablePagination, { meta: meta(total) }),
        ])
    },
  })
}

it.each([
  [1, '1 kết quả', '1 result'],
  [1_284, '1.284 kết quả', '1,284 results'],
])('shows %i results with locale number and plural', async (total, vi, en) => {
  const { wrapper } = renderWithPlugins(host(total))
  expect(wrapper.find('[data-total]').text()).toBe(vi)
  await wrapper.find('[data-action="en"]').trigger('click')
  await flushPromises()
  expect(wrapper.find('[data-total]').text()).toBe(en)
})
