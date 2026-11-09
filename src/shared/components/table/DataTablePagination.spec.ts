import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { h } from 'vue'

import { plainSpaces, withLocaleSwitch } from '@test/Intl'
import { renderWithPlugins } from '@test/Render'

import DataTablePagination from './DataTablePagination.vue'

const meta = (total: number) => ({ page: 1, pageSize: 20, total, totalPages: Math.max(1, Math.ceil(total / 20)) })

it.each([
  [1, '1 kết quả', '1 result'],
  [1_284, '1.284 kết quả', '1,284 results'],
])('shows %i results with the locale number and plural', async (total, vi, en) => {
  const { wrapper } = renderWithPlugins(withLocaleSwitch(() => () => h(DataTablePagination, { meta: meta(total) })))
  expect(plainSpaces(wrapper.find('[data-total]').text())).toBe(vi)
  await wrapper.find('[data-action="locale-en"]').trigger('click')
  await flushPromises()
  expect(plainSpaces(wrapper.find('[data-total]').text())).toBe(en)
})
