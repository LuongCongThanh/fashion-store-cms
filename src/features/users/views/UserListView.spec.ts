import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import UserListView from './UserListView.vue'

it('shows users but hides edit and create links without user:write', async () => {
  const { wrapper } = await renderFeature(UserListView, {
    path: '/users',
    mock(http) {
      http.onGet(/\/users$/).reply(200, {
        data: [
          {
            id: 'u1',
            name: 'Lan',
            email: 'lan@shop.vn',
            roleIds: ['r1'],
            storeIds: ['s1'],
            status: 'active',
          },
        ],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      })
    },
  })
  expect(wrapper.text()).toContain('lan@shop.vn')
  expect(wrapper.find('a[href="/users/u1/edit"]').exists()).toBe(false)
  expect(wrapper.find('a[href="/users/new"]').exists()).toBe(false)
})
