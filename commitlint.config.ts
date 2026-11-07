import type { UserConfig } from '@commitlint/types'

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'store',
        'products',
        'orders',
        'router',
        'api',
        'ui',
        'i18n',
        'pwa',
        'test',
        'deps',
        'config',
        'ci',
        'docs',
      ],
    ],
  },
}

export default config
