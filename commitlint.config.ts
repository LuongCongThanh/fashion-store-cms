import { RuleConfigSeverity } from '@commitlint/types'

import type { UserConfig } from '@commitlint/types'

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [RuleConfigSeverity.Error, 'always', 72],
    'scope-enum': [
      RuleConfigSeverity.Error,
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
