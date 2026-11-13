import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import InternalAccountListView from './InternalAccountListView.vue'

it('shows internal accounts but hides the create link without ADMINISTRATION_INTERNAL_ACCOUNT_MANAGE', async () => {
  const { wrapper } = await renderFeature(InternalAccountListView, {
    path: '/internal-accounts',
    mock(http) {
      http.onGet(/\/admin\/staff$/).reply(200, {
        data: [
          {
            id: 'u1',
            name: 'Lan',
            email: 'lan@shop.vn',
            status: 'ACTIVE',
            roles: [{ id: 'r1', name: 'Staff', isSystem: true }],
            createdAt: '2026-11-13T00:00:00.000Z',
            updatedAt: '2026-11-13T00:00:00.000Z',
          },
        ],
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      })
    },
  })
  expect(wrapper.text()).toContain('lan@shop.vn')
  expect(wrapper.find('a[href="/internal-accounts/new"]').exists()).toBe(false)
})
