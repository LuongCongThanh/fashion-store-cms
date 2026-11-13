import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'
import { chooseOption, setChecked } from '@test/Select'

import UserEditView from './UserEditView.vue'

it('replaces role assignments and changes account status when editing a user', async () => {
  const { wrapper, http } = await renderFeature(UserEditView, {
    path: '/users/u1/edit',
    routePath: '/users/:id/edit',
    permissions: ['ADMINISTRATION_INTERNAL_ACCOUNT_MANAGE'],
    mock(http) {
      http.onGet(/\/users\/u1$/).reply(200, {
        id: 'u1',
        name: 'Lan',
        email: 'lan@shop.vn',
        roleIds: ['r1'],
        status: 'active',
      })
      http.onGet(/\/roles$/).reply(200, {
        data: [
          { id: 'r1', name: 'Bán hàng', permissions: [] },
          { id: 'r2', name: 'Kho', permissions: [] },
        ],
        meta: { page: 1, pageSize: 100, total: 2, totalPages: 1 },
      })
      http.onPut(/\/users\/u1$/).reply(200, {})
    },
  })
  await wrapper.find('input[name="name"]').setValue('Lan Nguyễn')
  await wrapper.find('input[name="email"]').setValue('lan.nguyen@shop.vn')
  await setChecked(wrapper, 'role:r1', false)
  await setChecked(wrapper, 'role:r2', true)
  await chooseOption(wrapper, 'Trạng thái', 'Ngừng hoạt động')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.put[0]?.data as string)).toEqual({
    name: 'Lan Nguyễn',
    email: 'lan.nguyen@shop.vn',
    roleIds: ['r2'],
    status: 'inactive',
  })
})
