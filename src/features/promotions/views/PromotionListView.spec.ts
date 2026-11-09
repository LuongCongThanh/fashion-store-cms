import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import PromotionListView from './PromotionListView.vue'

it('lists promotions with localized status and an edit link only for writers', async () => {
  const { wrapper } = await renderFeature(PromotionListView, {
    path: '/promotions',
    permissions: ['promotion:write'],
    mock(http) {
      http.onGet(/\/promotions$/).reply(200, {
        data: [{ id: 'p1', name: 'Tết', code: 'TET', type: 'coupon', value: 10, status: 'active' }],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      })
    },
  })
  expect(wrapper.find('a[href="/promotions/p1/edit"]').text()).toBe('Tết')
  expect(wrapper.text()).toContain('Hoạt động')
})
