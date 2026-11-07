import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Icon PWA (maskable + apple-touch) sinh từ logo duy nhất (§R.2).
export default defineConfig({
  // Link SVG trỏ favicon.svg ở public/ (bản sao của Logo.svg, tên do trình duyệt quy định).
  headLinkOptions: { preset: '2023', resolveSvgName: () => 'favicon.svg' },
  preset: minimal2023Preset,
  images: ['src/assets/images/Logo.svg'],
})
