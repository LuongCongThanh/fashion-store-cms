import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { setNumber } from '@test/NumberField'
import { renderFeature } from '@test/RenderFeature'
import { chooseOption } from '@test/Select'

import PromotionCreateView from './PromotionCreateView.vue'

it('creates an automatic promotion without a coupon code', async () => {
  const { wrapper, http, router } = await renderFeature(PromotionCreateView, {
    path: '/promotions/new',
    permissions: ['promotion:write'],
    mock(http) {
      http.onPost(/\/promotions$/).reply(201, { id: 'promo1' })
    },
  })
  await wrapper.find('input[name="name"]').setValue('Mùa hè')
  await chooseOption(wrapper, 'Loại', 'Tự động')
  await setNumber(wrapper, 'value', '10')
  await wrapper.find('input[name="startAt"]').setValue('2026-01-01T00:00')
  await wrapper.find('input[name="endAt"]').setValue('2026-02-01T00:00')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.post[0]?.data as string)).toMatchObject({
    type: 'auto',
    code: '',
    value: 10,
  })
  expect(router.currentRoute.value.path).toBe('/promotions')
})
