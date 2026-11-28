# L. Design system (token CSS) — phần 2

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

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

### L.10. Kiểm soát

- ESLint/review: cấm mã màu hex/rgb trong `.vue` và class palette thô (`bg-rose-*`, `text-slate-*`) — thêm rule `no-restricted-syntax` cho chuỗi class khi cần, trước mắt kiểm tra trong PR checklist.
- Trang `/admin/design-system` (chỉ chạy ở dev) hiển thị toàn bộ màu ngữ nghĩa, badge trạng thái, nút, form — dùng để duyệt token với designer.

### L.11. Theme

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
    primary: 'brand',
    secondary: 'indigo',
    success: 'emerald',
    info: 'sky',
    warning: 'amber',
    error: 'red',
    neutral: 'slate',
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

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần tiếp](design-tokens.md)
