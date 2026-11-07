import { fileURLToPath } from 'node:url'

import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import { VitePWA } from 'vite-plugin-pwa'
import vueDevTools from 'vite-plugin-vue-devtools'
import tsconfigPaths from 'vite-tsconfig-paths'

import { uiConfig } from './src/app/config/Ui.config.ts'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    tsconfigPaths({ loose: true }),
    vue(),
    ui({
      autoImport: false, // import tường minh (§K.5)
      components: false,
      colorMode: false, // chế độ màu do useTheme() quản lý, key cms.colorMode (§L.11)
      ui: uiConfig, // nguồn duy nhất (D26)
    }),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false, // tự đăng ký trong UsePwa.ts
      manifest: {
        name: 'Fashion Store CMS',
        short_name: 'CMS',
        lang: 'vi',
        start_url: '/',
        display: 'standalone',
        theme_color: '#e11d48',
        background_color: '#ffffff',
      },
      pwaAssets: {
        config: true, // đọc pwa-assets.config.ts
        // Logo nằm ở src/assets/images (bản duy nhất, §R.2) → tính đường dẫn icon từ đó, xuất ra dist/.
        integration: {
          baseUrl: '/',
          publicDir: fileURLToPath(new URL('./src/assets/images', import.meta.url)),
          outDir: fileURLToPath(new URL('./dist', import.meta.url)),
        },
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        // Không cache API: tránh lộ dữ liệu sau logout và dữ liệu cũ (§R.2).
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
    // Chỉ khi dev server: devtools + overlay lỗi vue-tsc/ESLint (§S.2). Không chạy trong Vitest.
    command === 'serve' && mode !== 'test' && vueDevTools(),
    command === 'serve' &&
      mode !== 'test' &&
      checker({
        vueTsc: { tsconfigPath: 'tsconfig.app.json' },
        eslint: { lintCommand: 'eslint "./src/**/*.{ts,vue}"', useFlatConfig: true },
      }),
    // `npm run analyze` → dist/stats.html
    mode === 'analyze' && visualizer({ filename: 'dist/stats.html', gzipSize: true, open: false }),
  ],
}))
