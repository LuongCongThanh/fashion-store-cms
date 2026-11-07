import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: false,
      include: ['src/**/*.spec.ts', 'eslint.config.spec.ts'], // + test bảng ranh giới (D41)
      setupFiles: ['src/test/Setup.ts'],
      restoreMocks: true,
      env: { VITE_API_BASE_URL: 'http://localhost:8080/api' },
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,vue}'],
        exclude: ['src/**/*.spec.ts', 'src/shared/types/Api.generated.ts', 'src/main.ts'],
      },
    },
  }),
)
