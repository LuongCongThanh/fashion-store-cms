import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import StockMovementListView from './StockMovementListView.vue'

it('loads auditable movements with date and type filters', async () => {
  const { wrapper, http } = await renderFeature(StockMovementListView, {
    path: '/inventory/movements?type=adjustment&from=2026-01-01',
    mock(http) {
      http.onGet(/\/inventory\/movements$/).reply(200, {
        data: [
          {
            id: 'm1',
            sku: 'TEE-S',
            type: 'adjustment',
            quantity: 3,
            reason: 'Nhập bổ sung',
            reference: 'REF-1',
            createdAt: '2026-01-02',
            createdBy: 'Lan',
          },
        ],
        meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      })
    },
  })
  expect(wrapper.text()).toContain('Nhập bổ sung')
  expect(wrapper.text()).toContain('Lan')
  expect(http.history.get.find((request) => request.url === '/inventory/movements')?.params).toMatchObject({
    from: '2026-01-01',
    type: 'adjustment',
  })
})
