import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'
import { chooseOption, setChecked } from '@test/Select'

import UserEditView from './UserEditView.vue'

it('replaces role/Store assignments and changes account status when editing a user', async () => {
  const { wrapper, http } = await renderFeature(UserEditView, {
    path: '/users/u1/edit',
    routePath: '/users/:id/edit',
    permissions: ['user:write'],
    mock(http) {
      http.onGet(/\/users\/u1$/).reply(200, {
        id: 'u1',
        name: 'Lan',
        email: 'lan@shop.vn',
        roleIds: ['r1'],
        storeIds: ['s1'],
        status: 'active',
      })
      http.onGet(/\/roles$/).reply(200, {
        data: [
          { id: 'r1', name: 'Bán hàng', permissions: [] },
          { id: 'r2', name: 'Kho', permissions: [] },
        ],
        meta: { page: 1, pageSize: 100, total: 2, totalPages: 1 },
      })
      http.onGet(/\/stores$/).reply(200, [
        { id: 's1', name: 'Quận 1' },
        { id: 's2', name: 'Hà Nội' },
      ])
      http.onPut(/\/users\/u1$/).reply(200, {})
    },
  })
  await wrapper.find('input[name="name"]').setValue('Lan Nguyễn')
  await wrapper.find('input[name="email"]').setValue('lan.nguyen@shop.vn')
  await setChecked(wrapper, 'role:r1', false)
  await setChecked(wrapper, 'role:r2', true)
  await setChecked(wrapper, 'store:s1', false)
  await setChecked(wrapper, 'store:s2', true)
  await chooseOption(wrapper, 'Trạng thái', 'Ngừng hoạt động')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.put[0]?.data as string)).toEqual({
    name: 'Lan Nguyễn',
    email: 'lan.nguyen@shop.vn',
    roleIds: ['r2'],
    storeIds: ['s2'],
    status: 'inactive',
  })
})
