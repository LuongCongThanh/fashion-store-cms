import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import CategoryCreateView from './CategoryCreateView.vue'

it('validates a localized category and maps API validation errors to the field', async () => {
  const { wrapper, http } = await renderFeature(CategoryCreateView, {
    path: '/categories/new',
    permissions: ['CATALOG_CATEGORY_MANAGE'],
    mock(http) {
      http.onGet(/\/categories$/).reply(200, [])
      http.onPost(/\/categories$/).reply(422, {
        code: 'VALIDATION_FAILED',
        details: { fields: { slug: ['Slug đã được sử dụng'] } },
      })
    },
  })
  await wrapper.find('form').trigger('submit')
  expect(http.history.post).toHaveLength(0)
  await wrapper.find('input[name="name"]').setValue('Áo')
  await wrapper.find('input[name="slug"]').setValue('ao')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(wrapper.find('[data-error="slug"]').text()).toContain('Slug đã được sử dụng')
})
