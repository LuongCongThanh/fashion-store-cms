# J. Cấu hình CSS (Tailwind v4 + Nuxt UI)

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

- Một entry duy nhất `src/assets/styles/main.css`, import trong `main.ts`. Không dùng SCSS, không CSS-in-JS.
- Tailwind v4 cấu hình bằng CSS (`@theme`), **không có** `tailwind.config.js`.
- Palette brand khai báo bằng `@theme` trong `main.css`; map màu ngữ nghĩa nằm duy nhất trong `Ui.config.ts` (D26, §L.9); component chỉ dùng màu ngữ nghĩa (`primary`, `neutral`, `error`…), không dùng mã màu cứng.
- Dark mode: theo Nuxt UI (class `dark` trên `<html>`), mặc định theo hệ thống.
- Ưu tiên utility class trong template; `<style scoped>` chỉ khi không làm được bằng utility; cấm `<style>` không scoped (trừ `main.css`).
- Thứ tự class tự sắp xếp bằng `prettier-plugin-tailwindcss`.
- Không có `variables.css` riêng (bỏ khỏi §4) — token nằm trong `@theme` của `main.css`.

Nội dung `main.css` đầy đủ: xem §L.9.

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import { uiConfig } from './src/app/config/Ui.config'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      autoImport: false, // không auto-import code nội bộ (§2), chỉ component Nuxt UI
      ui: uiConfig, // nguồn duy nhất (D26)
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
```

```ts
// main.ts
import './assets/styles/main.css'
import ui from '@nuxt/ui/vue-plugin'
app.use(router).use(pinia).use(i18n).use(VueQueryPlugin, { queryClient }).use(ui)
```

`.vscode/settings.json` thêm `"files.associations": { "*.css": "tailwindcss" }` để IntelliSense hiểu `@theme`.

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
