import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'
import { findCheckbox, setChecked } from '@test/Select'

import RoleEditView from './RoleEditView.vue'

it('loads an existing role and saves a renamed role with its permissions removed', async () => {
  const { wrapper, http } = await renderFeature(RoleEditView, {
    path: '/roles/r1/edit',
    routePath: '/roles/:id/edit',
    permissions: ['ADMINISTRATION_ROLE_MANAGE'],
    mock(http) {
      http.onGet(/\/admin\/roles\/r1$/).reply(200, {
        id: 'r1',
        name: 'Bán hàng',
        description: null,
        isSystem: false,
        permissions: ['CATALOG_PRODUCT_VIEW'],
        accountCount: 0,
      })
      http.onGet(/\/admin\/permissions$/).reply(200, [{ group: 'CATALOG', permissions: ['CATALOG_PRODUCT_VIEW'] }])
      http.onPatch(/\/admin\/roles\/r1$/).reply(200, {})
    },
  })
  expect(findCheckbox(wrapper, 'permission:CATALOG_PRODUCT_VIEW').attributes('aria-checked')).toBe('true')
  await wrapper.find('input[name="name"]').setValue('Chờ phân quyền')
  await setChecked(wrapper, 'column:CATALOG:VIEW', false)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.patch[0]?.data as string)).toEqual({
    name: 'Chờ phân quyền',
    description: '',
    permissions: [],
  })
})
