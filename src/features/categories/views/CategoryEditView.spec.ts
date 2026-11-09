import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import CategoryEditView from './CategoryEditView.vue'

it('excludes descendants from parent choices and rejects a stale cyclic parent submission', async () => {
  const { wrapper, http } = await renderFeature(CategoryEditView, {
    path: '/categories/a/edit',
    routePath: '/categories/:id/edit',
    permissions: ['category:write'],
    mock(http) {
      http.onGet(/\/categories$/).reply(200, [
        { id: 'a', name: 'Áo', parentId: null },
        { id: 'b', name: 'Linen', parentId: 'a' },
        { id: 'c', name: 'Linen S', parentId: 'b' },
        { id: 'd', name: 'Quần', parentId: null },
      ])
      http.onGet(/\/categories\/a$/).reply(200, {
        id: 'a',
        name: 'Áo',
        slug: 'ao',
        parentId: null,
        metaTitle: '',
        metaDescription: '',
      })
    },
  })
  const select = wrapper.find('select[name="parentId"]')
  expect(select.findAll('option').map((option) => option.attributes('value'))).toEqual(['', 'd'])
  // Simulate a choice that became invalid after the form was opened.
  ;(select.element as HTMLSelectElement).add(new Option('Linen', 'b'))
  await select.setValue('b')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(http.history.put).toHaveLength(0)
  expect(wrapper.find('[data-error="parentId"]').exists()).toBe(true)
})
