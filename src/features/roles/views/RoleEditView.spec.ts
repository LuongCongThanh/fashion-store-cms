import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import RoleEditView from './RoleEditView.vue'

it('loads an existing role and saves a renamed role with its permissions removed', async () => {
  const { wrapper, http } = await renderFeature(RoleEditView, {
    path: '/roles/r1/edit',
    routePath: '/roles/:id/edit',
    permissions: ['role:write'],
    mock(http) {
      http.onGet(/\/roles\/r1$/).reply(200, { id: 'r1', name: 'Bán hàng', permissions: ['order:read'] })
      http.onGet(/\/permissions$/).reply(200, [{ key: 'order:read', resource: 'order', action: 'read' }])
      http.onPut(/\/roles\/r1$/).reply(200, {})
    },
  })
  expect(wrapper.find('input[name="permission:order:read"]').element).toHaveProperty('checked', true)
  await wrapper.find('input[name="name"]').setValue('Chờ phân quyền')
  await wrapper.find('input[name="column:read"]').setValue(false)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.put[0]?.data as string)).toEqual({
    name: 'Chờ phân quyền',
    permissions: [],
  })
})
