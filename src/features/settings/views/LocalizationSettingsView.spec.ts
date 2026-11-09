import { flushPromises } from '@vue/test-utils'
import { expect, it } from 'vitest'

import { renderFeature } from '@test/RenderFeature'

import LocalizationSettingsView from './LocalizationSettingsView.vue'

it('saves localization preferences without changing the CMS interface language', async () => {
  const { wrapper, http } = await renderFeature(LocalizationSettingsView, {
    path: '/settings/localization',
    permissions: ['settings:write'],
    mock(http) {
      http.onGet(/\/settings\/localization$/).reply(200, {
        languages: ['vi', 'en'],
        defaultLanguage: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        currency: 'VND',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'vi-VN',
      })
      http.onPut(/\/settings\/localization$/).reply(200, {})
    },
  })
  await wrapper.find('select[name="defaultLanguage"]').setValue('en')
  await wrapper.find('input[name="currency"]').setValue('USD')
  await wrapper.find('form').trigger('submit')
  await flushPromises()
  expect(JSON.parse(http.history.put[0]?.data as string)).toMatchObject({
    languages: ['vi', 'en'],
    defaultLanguage: 'en',
    currency: 'USD',
  })
  expect(document.documentElement.lang).toBe('vi')
})
