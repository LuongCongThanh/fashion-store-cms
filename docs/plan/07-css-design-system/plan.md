# 07 — CSS, design system, theme

Status: ready-for-agent
Blocked by: 05
Nguồn: Step 3b trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41, trong đó D24, D32 đã huỷ), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 3b — CSS, design system, theme

**Làm gì**

- CSS theo §J và §L: token, font, `main.css` (§L.9).
- `Ui.config.ts` là nguồn duy nhất map màu + mặc định component (D26).
- Theme theo §L.11: `useTheme()` với `storageKey: 'cms.colorMode'`, script chống nháy trong `index.html`, nút chuyển Sáng/Tối/Hệ thống.
- Trang dev `/admin/design-system` hiển thị token (§L.10).

**Kiểm tra:** đúng màu primary; chọn Tối rồi F5 không nháy trắng; `localStorage` chỉ có key `cms.colorMode`.

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

### J. Cấu hình CSS (Tailwind v4 + Nuxt UI)

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
      ui: uiConfig,      // nguồn duy nhất (D26)
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

### L. Design system (token CSS)

Nguồn sự thật: token trong `main.css` (`@theme`) + map màu ngữ nghĩa của Nuxt UI trong `vite.config.ts`. Khi có Figma thì đồng bộ giá trị từ Figma vào đây; **tên token giữ nguyên**.

> Giá trị màu `brand` dưới đây là **tạm thời**, chờ màu thương hiệu chính thức.

#### L.1. Ba tầng token

| Tầng | Ví dụ | Ai được dùng |
| --- | --- | --- |
| 1. Palette (giá trị thô) | `--color-brand-500`, `--color-slate-200` | Chỉ `main.css` và `vite.config.ts` |
| 2. Ngữ nghĩa (Nuxt UI) | `primary`, `neutral`, `success`, `--ui-bg`, `--ui-text-muted` | Component, layout |
| 3. Nghiệp vụ | `OrderStatus → color` | Component nghiệp vụ, qua map trong `types/` của feature |

Quy tắc: component **không** dùng tầng 1 (`bg-brand-500`, `#e11d48`, `text-slate-700`); chỉ dùng tầng 2 (`bg-primary`, `text-muted`, `color="error"`).

#### L.2. Bảng màu

**Palette brand (tạm):**

| Step | Hex |
| --- | --- |
| 50 | `#fff1f2` |
| 100 | `#ffe4e6` |
| 200 | `#fecdd3` |
| 300 | `#fda4af` |
| 400 | `#fb7185` |
| 500 | `#f43f5e` |
| 600 | `#e11d48` |
| 700 | `#be123c` |
| 800 | `#9f1239` |
| 900 | `#881337` |
| 950 | `#4c0519` |

**Map ngữ nghĩa (Nuxt UI):**

| Màu ngữ nghĩa | Palette | Dùng cho |
| --- | --- | --- |
| `primary` | `brand` | Nút chính, link, focus, item sidebar active |
| `secondary` | `indigo` | Hành động phụ nổi bật (hiếm dùng) |
| `success` | `emerald` | Thành công, đã giao, còn hàng |
| `info` | `sky` | Thông tin, đang xử lý |
| `warning` | `amber` | Cảnh báo, sắp hết hàng, chờ xác nhận |
| `error` | `red` | Lỗi, xoá, huỷ, hết hàng |
| `neutral` | `slate` | Nền, chữ, viền, trạng thái nháp |

Không thêm màu ngữ nghĩa mới nếu chưa thống nhất; cần màu mới thì bổ sung vào bảng này trước.

#### L.3. Token nền / chữ / viền (Nuxt UI, tự đổi theo dark mode)

| Mục đích | Class | Biến |
| --- | --- | --- |
| Nền trang | `bg-default` | `--ui-bg` |
| Nền khối phụ (card, sidebar) | `bg-muted` / `bg-elevated` | `--ui-bg-muted`, `--ui-bg-elevated` |
| Chữ chính | `text-default` / `text-highlighted` | `--ui-text`, `--ui-text-highlighted` |
| Chữ phụ | `text-muted` / `text-dimmed` | `--ui-text-muted`, `--ui-text-dimmed` |
| Viền | `border-default` / `border-muted` | `--ui-border`, `--ui-border-muted` |

#### L.4. Màu theo trạng thái nghiệp vụ

Map đặt trong component badge của feature (VD `features/orders/components/OrderStatusBadge.vue`), không đặt trong `types/` (§B.3). Feature khác cần hiển thị trạng thái thì dùng component đó qua `Use*.ts` hoặc nhận màu qua prop:

| Đối tượng | Trạng thái → màu |
| --- | --- |
| Order | `pending` → warning · `confirmed` → info · `shipping` → primary · `delivered` → success · `cancelled` → error · `refunded` → neutral |
| Product | `draft` → neutral · `active` → success · `archived` → warning |
| Tồn kho | còn hàng → success · sắp hết → warning · hết hàng → error |

(Tên trạng thái chính xác sẽ chốt khi làm domain model; bảng này chỉ cố định **nguyên tắc** và màu.)

#### L.5. Typography

Kết hợp 2 font: **Plus Jakarta Sans** (display — tiêu đề, số nổi bật) + **Inter** (mọi thứ còn lại). Cùng họ sans, x-height gần nhau nên ghép không lệch.

| Token | Giá trị | Class |
| --- | --- | --- |
| `--font-sans` | `'Inter Variable', ui-sans-serif, system-ui, sans-serif` | mặc định (`font-sans`) |
| `--font-display` | `'Plus Jakarta Sans Variable', var(--font-sans)` | `font-display` |
| `--font-mono` | `ui-monospace, SFMono-Regular, monospace` | `font-mono` |

**Phân vai**

| Vị trí | Font | Cỡ · độ đậm |
| --- | --- | --- |
| Tiêu đề trang | Plus Jakarta Sans | `text-2xl` · 600 |
| Tiêu đề card / section / modal | Plus Jakarta Sans | `text-lg` · 600 |
| Số KPI Dashboard | Plus Jakarta Sans | `text-3xl` · 700 · `tabular-nums` |
| Logo / tên store ở sidebar | Plus Jakarta Sans | `text-base` · 700 |
| Body, bảng, form, nút, badge, menu, tooltip | Inter | `text-sm` · 400/500 |
| Cột tiền, số lượng | Inter | `tabular-nums` |
| SKU, mã đơn | mono hệ thống | `text-xs` |

**Quy tắc**

- `font-display` chỉ dùng cho chữ ≥ 18px hoặc số nổi bật; **không** dùng trong bảng, form.
- Tiêu đề trang đi qua component `PageHeader.vue` (gắn sẵn `font-display`), không tự gõ class ở từng view.
- Thang cỡ: `text-xs` 12 · `text-sm` 14 (mặc định) · `text-base` 16 · `text-lg` 18 · `text-xl` 20 · `text-2xl` 24 · `text-3xl` 30 (KPI).
- Độ đậm: 400 · 500 · 600; 700 chỉ cho KPI và logo.
- Tự host qua `@fontsource-variable/inter`, `@fontsource-variable/plus-jakarta-sans` (§K.1), chỉ subset `latin`, `latin-ext`, `vietnamese` (~60–80KB tổng), `font-display: swap`.
- Phương án thay thế nếu designer đổi: Be Vietnam Pro, Manrope — chỉ đổi giá trị token, không sửa code.

#### L.6. Spacing, radius, shadow, kích thước

| Nhóm | Quy tắc |
| --- | --- |
| Spacing | Thang Tailwind (bội 4px). Khoảng cách chuẩn: trong card `p-4`, giữa section `gap-6`, padding trang `p-6` (mobile `p-4`) |
| Radius | `--ui-radius: 0.375rem`; dùng `rounded-md` (control), `rounded-lg` (card), `rounded-full` (avatar, badge tròn) |
| Shadow | Chỉ `shadow-xs` (card), `shadow-lg` (dropdown, modal); ưu tiên viền thay bóng |
| Control size | Mặc định Nuxt UI `md`; bảng dày dùng `sm` |
| Sidebar | Rộng 256px, thu gọn 64px |
| Container | Nội dung tối đa `max-w-screen-2xl` |

#### L.7. Breakpoint, z-index, motion

- Breakpoint Tailwind mặc định: `sm 640` · `md 768` · `lg 1024` (sidebar cố định từ `lg`) · `xl 1280` · `2xl 1536`. Mục tiêu chính là desktop ≥ 1280.
- z-index: để Nuxt UI quản lý overlay; code tự viết chỉ dùng `z-10` (sticky header bảng), `z-20` (sidebar mobile). Không dùng số tuỳ ý.
- Motion: `transition-colors duration-150` cho hover; tôn trọng `motion-reduce:`.

#### L.8. Dark mode & accessibility

- Hỗ trợ light/dark, mặc định theo hệ thống, cho người dùng chọn (lưu `localStorage`).
- Chỉ dùng token L.3 nên dark mode tự đúng; cấm `dark:` với mã màu thô.
- Độ tương phản chữ ≥ 4.5:1 (WCAG AA); không truyền đạt trạng thái **chỉ** bằng màu — badge luôn có chữ.
- Luôn giữ focus ring của Nuxt UI (`focus-visible`), không `outline-none` trần.

#### L.9. Cấu hình

```css
/* src/assets/styles/main.css */
@import 'tailwindcss';
@import '@nuxt/ui';
@import '@fontsource-variable/inter';
@import '@fontsource-variable/plus-jakarta-sans';

@theme static {
  --font-sans: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Plus Jakarta Sans Variable', var(--font-sans);
  --font-mono: ui-monospace, SFMono-Regular, monospace;

  --color-brand-50: #fff1f2;
  --color-brand-100: #ffe4e6;
  --color-brand-200: #fecdd3;
  --color-brand-300: #fda4af;
  --color-brand-400: #fb7185;
  --color-brand-500: #f43f5e;
  --color-brand-600: #e11d48;
  --color-brand-700: #be123c;
  --color-brand-800: #9f1239;
  --color-brand-900: #881337;
  --color-brand-950: #4c0519;
}

:root {
  --ui-radius: 0.375rem;
  --ui-primary: var(--ui-color-primary-600);
}

.dark {
  --ui-primary: var(--ui-color-primary-400);
}
```

Map màu ngữ nghĩa (bảng §L.2) khai báo **một lần** trong `src/app/config/Ui.config.ts` (§L.11), `vite.config.ts` chỉ import (§J).

#### L.10. Kiểm soát

- ESLint/review: cấm mã màu hex/rgb trong `.vue` và class palette thô (`bg-rose-*`, `text-slate-*`) — thêm rule `no-restricted-syntax` cho chuỗi class khi cần, trước mắt kiểm tra trong PR checklist.
- Trang `/admin/design-system` (chỉ chạy ở dev) hiển thị toàn bộ màu ngữ nghĩa, badge trạng thái, nút, form — dùng để duyệt token với designer.

#### L.11. Theme

**Chế độ màu**

- 3 lựa chọn: Sáng / Tối / Theo hệ thống; mặc định **Theo hệ thống**.
- Nút chuyển ở menu avatar (góc phải header); lưu `localStorage` key `cms.colorMode`.
- Dùng `useColorMode` của VueUse, không tự viết; **phải** cấu hình `storageKey: 'cms.colorMode'` (mặc định của VueUse là `vueuse-color-scheme`) cho khớp script chống nháy bên dưới. Bọc trong một composable `useTheme()` (đặt ở `shared/composables/UseTheme.ts`) để key chỉ khai báo một chỗ.
- Chống nháy trắng: script inline trong `<head>` của `index.html` gắn class `dark` trước khi Vue chạy.

```html
<!-- index.html -->
<script>
  try {
    const m = localStorage.getItem('cms.colorMode') || 'auto'
    const dark = m === 'dark' || (m === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  } catch {}
</script>
```

**Dark mode**

- `primary` dùng step 400 (light dùng 600) — §L.9.
- Nền: `neutral` = slate → nền dark `slate-950`, khối phụ `slate-900` (token `--ui-bg`, `--ui-bg-muted` của Nuxt UI).
- ECharts: 2 theme `cms-light` / `cms-dark` đăng ký từ token, tự đổi theo `useColorMode` (làm ở Phase 4).

**Mặc định component**

Chỉnh tập trung trong `src/app/config/Ui.config.ts`, import vào `vite.config.ts` (thêm file này vào `tsconfig.node.json`). Không truyền lặp props size/variant ở từng chỗ dùng.

```ts
// src/app/config/Ui.config.ts
export const uiConfig = {
  colors: {
    primary: 'brand', secondary: 'indigo', success: 'emerald',
    info: 'sky', warning: 'amber', error: 'red', neutral: 'slate',
  },
  button: { defaultVariants: { size: 'md' } },
  input: { defaultVariants: { size: 'md' } },
  table: { slots: { th: 'text-sm', td: 'text-sm tabular-nums' } },
  badge: { defaultVariants: { variant: 'subtle' } },
} as const
```

`vite.config.ts` import `uiConfig` như §J. `Ui.config.ts` không được import gì từ `src/` (chạy trong Node lúc build).

**Không làm (giai đoạn này)**

- Theme theo từng Store: cả CMS một màu thương hiệu; store hiện tại hiển thị bằng tên/badge ở header.
- Người dùng tự chọn màu primary, chế độ mật độ compact/comfortable (mặc định bảng gọn).
