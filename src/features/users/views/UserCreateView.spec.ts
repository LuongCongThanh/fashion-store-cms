import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'
import { setChecked } from '@test/Select'

import UserCreateView from './UserCreateView.vue'

it('creates a user with explicitly selected role', async () => {
  const { wrapper, http } = await renderFeature(UserCreateView, {
    path: '/users/new',
    permissions: ['user:write'],
    mock(http) {
      http.onGet(/\/roles$/).reply(200, {
        data: [{ id: 'r1', name: 'Bán hàng', permissions: [] }],
        meta: { page: 1, pageSize: 100, total: 1, totalPages: 1 },
      })
      http.onPost(/\/users$/).reply(201, { id: 'u1' })
    },
  })
  await wrapper.find('input[name="name"]').setValue('Lan')
  await wrapper.find('input[name="email"]').setValue('lan@shop.vn')
  await setChecked(wrapper, 'role:r1', true)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
    name: 'Lan',
    email: 'lan@shop.vn',
    roleIds: ['r1'],
    status: 'active',
  })
})
