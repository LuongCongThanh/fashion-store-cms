import { defineComponent, h } from 'vue'

import type { VNodeChild } from 'vue'

import { useLocale } from '@shared/lib/i18n/I18n'

/** NBSP (U+00A0) và narrow NBSP (U+202F) mà `Intl` chèn vào tiền / giờ. Dựng bằng mã ký tự cho dễ đọc. */
const INTL_SPACES = new RegExp(`[${String.fromCharCode(0x00a0, 0x202f)}]`, 'g')

/** Intl dùng khoảng trắng không ngắt (U+00A0 / U+202F); đổi về khoảng trắng thường để so sánh. */
export function plainSpaces(value: string): string {
  return value.replace(INTL_SPACES, ' ')
}

/**
 * Bọc nội dung kèm nút `[data-action="locale-en"]` để test đổi sang tiếng Anh.
 * `setupRender` chạy trong `setup` (được gọi composable) và trả về hàm render.
 */
export function withLocaleSwitch(setupRender: () => () => VNodeChild) {
  return defineComponent({
    setup() {
      const { setLocale } = useLocale()
      const render = setupRender()
      return () =>
        h('div', [
          h('button', {
            'data-action': 'locale-en',
            onClick: () => {
              setLocale('en')
            },
          }),
          render(),
        ])
    },
  })
}
