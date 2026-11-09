import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import RoleCreateView from './RoleCreateView.vue'

it('builds the permission matrix from backend resources/actions and toggles rows and columns', async () => {
  const { wrapper, http } = await renderFeature(RoleCreateView, {
    path: '/roles/new',
    permissions: ['role:write'],
    mock(http) {
      http.onGet(/\/permissions$/).reply(200, [
        { key: 'product:read', resource: 'product', action: 'read' },
        { key: 'product:write', resource: 'product', action: 'write' },
        { key: 'order:read', resource: 'order', action: 'read' },
        { key: 'report:export', resource: 'report', action: 'export' },
      ])
      http.onPost(/\/roles$/).reply(201, { id: 'r1' })
    },
  })
  await wrapper.find('input[name="name"]').setValue('Nhân viên')
  await wrapper.find('input[name="row:product"]').setValue(true)
  await wrapper.find('input[name="column:read"]').setValue(true)
  await wrapper.find('input[name="row:product"]').setValue(false)
  await wrapper.find('input[name="permission:report:export"]').setValue(true)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
    name: 'Nhân viên',
    permissions: ['order:read', 'report:export'],
  })
})
