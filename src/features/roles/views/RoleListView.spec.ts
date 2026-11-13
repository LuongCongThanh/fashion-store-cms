import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import RoleListView from './RoleListView.vue'

it('lets role writers open the role editor from the server list', async () => {
  const { wrapper } = await renderFeature(RoleListView, {
    path: '/roles',
    permissions: ['ADMINISTRATION_ROLE_MANAGE'],
    mock(http) {
      http.onGet(/\/admin\/roles$/).reply(200, {
        data: [
          {
            id: 'r1',
            name: 'Bán hàng',
            description: null,
            isSystem: false,
            permissions: ['CATALOG_PRODUCT_VIEW'],
            accountCount: 1,
          },
        ],
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      })
    },
  })
  expect(wrapper.find('a[href="/roles/r1/edit"]').text()).toBe('Bán hàng')
})
