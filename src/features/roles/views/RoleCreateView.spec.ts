import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'
import { setChecked } from '@test/Select'

import RoleCreateView from './RoleCreateView.vue'

it('builds the permission matrix from backend resources/actions and toggles rows and columns', async () => {
  const { wrapper, http } = await renderFeature(RoleCreateView, {
    path: '/roles/new',
    permissions: ['ADMINISTRATION_ROLE_MANAGE'],
    mock(http) {
      http.onGet(/\/admin\/permissions$/).reply(200, [
        { group: 'CATALOG', permissions: ['CATALOG_PRODUCT_VIEW', 'CATALOG_PRODUCT_MANAGE', 'CATALOG_CATEGORY_VIEW'] },
        { group: 'ADMINISTRATION', permissions: ['ADMINISTRATION_ROLE_VIEW'] },
      ])
      http.onPost(/\/admin\/roles$/).reply(201, { id: 'r1' })
    },
  })
  await wrapper.find('input[name="name"]').setValue('Nhân viên')
  await setChecked(wrapper, 'row:CATALOG:PRODUCT', true)
  await setChecked(wrapper, 'column:CATALOG:VIEW', true)
  await setChecked(wrapper, 'row:CATALOG:PRODUCT', false)
  await setChecked(wrapper, 'permission:ADMINISTRATION_ROLE_VIEW', true)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
    name: 'Nhân viên',
    permissions: ['CATALOG_CATEGORY_VIEW', 'ADMINISTRATION_ROLE_VIEW'],
  })
})
