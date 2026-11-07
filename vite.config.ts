import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { uiConfig } from './src/app/config/Ui.config.ts'

export default defineConfig({
  plugins: [
    tsconfigPaths({ loose: true }),
    vue(),
    ui({
      autoImport: false, // import tường minh (§K.5)
      components: false,
      colorMode: false, // chế độ màu do useTheme() quản lý, key cms.colorMode (§L.11)
      ui: uiConfig, // nguồn duy nhất (D26)
    }),
  ],
})
