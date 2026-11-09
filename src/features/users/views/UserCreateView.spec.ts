import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import UserCreateView from './UserCreateView.vue'

it('creates a user with explicitly selected role and Store assignments', async () => {
  const { wrapper, http } = await renderFeature(UserCreateView, {
    path: '/users/new',
    permissions: ['user:write'],
    mock(http) {
      http.onGet(/\/roles$/).reply(200, {
        data: [{ id: 'r1', name: 'Bán hàng', permissions: [] }],
        meta: { page: 1, pageSize: 100, total: 1, totalPages: 1 },
      })
      http.onGet(/\/stores$/).reply(200, [{ id: 'store-1', name: 'Quận 1' }])
      http.onPost(/\/users$/).reply(201, { id: 'u1' })
    },
  })
  await wrapper.find('input[name="name"]').setValue('Lan')
  await wrapper.find('input[name="email"]').setValue('lan@shop.vn')
  await wrapper.find('input[name="role:r1"]').setValue(true)
  await wrapper.find('input[name="store:store-1"]').setValue(true)
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
    name: 'Lan',
    email: 'lan@shop.vn',
    roleIds: ['r1'],
    storeIds: ['store-1'],
    status: 'active',
  })
})
