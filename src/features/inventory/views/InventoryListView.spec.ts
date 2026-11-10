import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { setNumber } from '@test/NumberField'
import { renderFeature } from '@test/RenderFeature'

import InventoryListView from './InventoryListView.vue'

it('requires a reason before adjusting a variant and refreshes stock after saving', async () => {
  let current = 5
  const { wrapper, http } = await renderFeature(InventoryListView, {
    path: '/inventory',
    permissions: ['inventory:write'],
    mock(http) {
      http.onGet(/\/inventory$/).reply(() => [
        200,
        {
          data: [
            {
              id: 'v1',
              sku: 'TEE-S',
              name: 'Áo S',
              current,
              reserved: 1,
              available: current - 1,
              status: 'in-stock',
            },
          ],
          meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
        },
      ])
      http.onPost(/\/inventory\/v1\/adjustments$/).reply(() => {
        current = 8
        return [200, {}]
      })
    },
  })
  await wrapper.find('button[data-action="adjust"]').trigger('click')
  await flushPromises()
  await setNumber(wrapper, 'quantity', '3')
  await wrapper.find('form[data-stock-adjust]').trigger('submit')
  expect(http.history.post).toHaveLength(0)
  await wrapper.find('input[name="reason"]').setValue('Nhập bổ sung')
  await wrapper.find('form[data-stock-adjust]').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.post[0]?.data as string)).toEqual({
    quantity: 3,
    reason: 'Nhập bổ sung',
  })
  expect(wrapper.find('tbody').text()).toContain('8')
})
