import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'
import { setChecked } from '@test/Select'

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
  await setChecked(wrapper, 'row:product', true)
  await setChecked(wrapper, 'column:read', true)
  await setChecked(wrapper, 'row:product', false)
  await setChecked(wrapper, 'permission:report:export', true)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
    name: 'Nhân viên',
    permissions: ['order:read', 'report:export'],
  })
})
