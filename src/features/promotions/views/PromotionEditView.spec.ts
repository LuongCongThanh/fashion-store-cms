import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'
import { chooseOption } from '@test/Select'

import PromotionEditView from './PromotionEditView.vue'

it('edits an automatic promotion into a fixed-value coupon with a new usage window', async () => {
  const { wrapper, http } = await renderFeature(PromotionEditView, {
    path: '/promotions/p1/edit',
    routePath: '/promotions/:id/edit',
    permissions: ['promotion:write'],
    mock(http) {
      http.onGet(/\/promotions\/p1$/).reply(200, {
        id: 'p1',
        name: 'Mùa hè',
        type: 'auto',
        code: '',
        discountType: 'percent',
        value: 10,
        minimumOrder: 0,
        usageLimit: 100,
        startAt: '2026-01-01T00:00:00Z',
        endAt: '2026-02-01T00:00:00Z',
        status: 'draft',
      })
      http.onPut(/\/promotions\/p1$/).reply(200, {})
    },
  })
  await wrapper.find('input[name="name"]').setValue('Tết')
  await chooseOption(wrapper, 'Loại', 'Mã giảm giá')
  await wrapper.find('input[name="code"]').setValue('TET50')
  await chooseOption(wrapper, 'Loại giảm giá', 'Số tiền cố định')
  await wrapper.find('input[name="value"]').setValue('50000')
  await wrapper.find('input[name="minimumOrder"]').setValue('100000')
  await wrapper.find('input[name="usageLimit"]').setValue('2')
  await wrapper.find('input[name="startAt"]').setValue('2026-03-01T00:00')
  await wrapper.find('input[name="endAt"]').setValue('2026-04-01T00:00')
  await chooseOption(wrapper, 'Trạng thái', 'Hoạt động')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.put[0]?.data as string)).toMatchObject({
    name: 'Tết',
    type: 'coupon',
    code: 'TET50',
    discountType: 'fixed',
    value: 50000,
    minimumOrder: 100000,
    usageLimit: 2,
    status: 'active',
  })
})
