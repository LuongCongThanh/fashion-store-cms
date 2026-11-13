import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import CategoryForm from '@features/categories/components/CategoryForm.vue'
import { renderFeature } from '@test/RenderFeature'
import { findCombobox } from '@test/Select'

import CategoryEditView from './CategoryEditView.vue'

it('excludes descendants from parent choices and rejects a stale cyclic parent submission', async () => {
  const { wrapper, http } = await renderFeature(CategoryEditView, {
    path: '/categories/a/edit',
    routePath: '/categories/:id/edit',
    permissions: ['CATALOG_CATEGORY_MANAGE'],
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
  await findCombobox(wrapper, 'Danh mục cha').trigger('keydown', { key: 'Enter' })
  await flushPromises()
  const choices = Array.from(document.body.querySelectorAll('[role="option"]'), (option) => option.textContent.trim())
  expect(choices).toEqual(['Không có', 'Quần'])
  await findCombobox(wrapper, 'Danh mục cha').trigger('keydown', { key: 'Escape' })
  // Simulate a choice that became invalid after the form was opened (UI no longer offers it).
  const form = wrapper.findComponent(CategoryForm)
  form.vm.$emit('update:modelValue', { ...form.props('modelValue'), parentId: 'b' })
  await flushPromises()
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(http.history.put).toHaveLength(0)
  expect(wrapper.find('[data-error="parentId"]').exists()).toBe(true)
})
