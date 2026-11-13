import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { categoryPage } from '@test/factories/Category.factory'
import { renderFeature } from '@test/RenderFeature'

import CategoryListView from './CategoryListView.vue'

it('shows the category tree and rolls back a failed drag move', async () => {
  let finishMove: ((response: [number, object]) => void) | undefined
  const { wrapper, http } = await renderFeature(CategoryListView, {
    path: '/categories',
    permissions: ['CATALOG_CATEGORY_MANAGE'],
    mock(http) {
      http.onGet(/\/categories$/).replyOnce(
        200,
        categoryPage([
          { id: 'a', name: 'Áo', parentId: null },
          { id: 'b', name: 'Linen', parentId: null },
        ]),
      )
      http.onGet(/\/categories$/).reply(() => new Promise(() => {}))
      http.onPatch(/\/admin\/categories\/b$/).reply(
        () =>
          new Promise((resolve) => {
            finishMove = resolve
          }),
      )
    },
  })
  expect(wrapper.text()).toContain('Linen')
  const transfer = { getData: () => 'b', setData: () => {} }
  await wrapper.find('[data-category="b"]').trigger('dragstart', { dataTransfer: transfer })
  await wrapper.find('[data-category="a"]').trigger('drop', { dataTransfer: transfer })
  await flushPromises()
  expect(wrapper.find('[data-category="b"]').attributes('data-parent')).toBe('a')
  finishMove?.([500, {}])
  await flushPromises()
  expect(JSON.parse(http.history.patch[0]?.data as string)).toEqual({ parentId: 'a' })
  expect(wrapper.find('[data-category="b"]').attributes('data-parent')).toBe('')
})
