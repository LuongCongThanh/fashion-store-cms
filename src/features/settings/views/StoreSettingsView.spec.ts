import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import StoreSettingsView from './StoreSettingsView.vue'

it('loads Store settings and saves the edited contact information', async () => {
  const { wrapper, http } = await renderFeature(StoreSettingsView, {
    path: '/settings/store',
    permissions: ['settings:write'],
    mock(http) {
      http.onGet(/\/settings\/store$/).reply(200, {
        name: 'Fashion',
        logo: null,
        description: '',
        contactEmail: 'old@shop.vn',
        phone: '',
        address: '',
      })
      http.onPut(/\/settings\/store$/).reply(200, {})
    },
  })
  await wrapper.find('input[name="contactEmail"]').setValue('contact@shop.vn')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.put[0]?.data as string)).toMatchObject({
    name: 'Fashion',
    contactEmail: 'contact@shop.vn',
  })
})
