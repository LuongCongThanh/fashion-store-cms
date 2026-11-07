# 07 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/css-design-system` (stacked trên `feat/errors-toast-dialog`)
Ngày hoàn thành: 2026-11-07

## Đã làm

- `src/assets/styles/main.css` theo §L.9: Tailwind v4, Nuxt UI, 2 font tự host, `@theme` với palette brand (đang là màu tạm), `--ui-radius`, `--ui-primary` (light dùng step 600, dark dùng 400). File được import trong `main.ts`.
- `src/app/config/Ui.config.ts` là nguồn duy nhất cho map màu ngữ nghĩa và mặc định component (D26). `vite.config.ts` import file này; đã thêm nó vào `tsconfig.node.json`.
- `shared/composables/UseTheme.ts`: `useTheme()` bọc `useColorMode` của VueUse với `storageKey: 'cms.colorMode'`, mặc định là `auto`.
- Script chống nháy trắng trong `<head>` của `index.html`.
- `layouts/components/UserMenu.vue` có menu Sáng / Tối / Theo hệ thống. `DashboardLayout` có header chứa UserMenu.
- `app/views/DesignSystemView.vue` hiển thị màu ngữ nghĩa (button, badge), nền và chữ, typography, input. Route `/admin/design-system` chỉ đăng ký khi `import.meta.env.DEV`.
- `.vscode/settings.json`: thêm `files.associations` `*.css → tailwindcss`.

## Kết quả kiểm tra

Kiểm tra bằng script Playwright chạy trên dev server. Script chỉ dùng một lần, không commit.

| Mục kiểm tra                              | Kết quả | Ghi chú                                                                                 |
| ----------------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| Đúng màu primary                          | Pass    | `--ui-primary` = `#e11d48` (brand-600); nền button `rgb(225, 29, 72)`                   |
| Chọn Tối rồi F5 không nháy trắng          | Pass    | Ngay khi reload (`waitUntil: 'commit'`), `<html>` đã có class `dark` trước khi app chạy |
| `localStorage` chỉ có key `cms.colorMode` | Pass    | Danh sách key là `['cms.colorMode']`, cả trước và sau reload                            |
| Build không chứa trang design-system      | Pass    | Không có chunk `DesignSystem` trong `dist`                                              |
| test, lint, typecheck, format             | Pass    | 96/96                                                                                   |

## Lệch so với plan / quyết định mới

- `ui({ colorMode: false })`: tắt tích hợp color-mode của Nuxt UI. Nếu bật, Nuxt UI tự ghi key `vueuse-color-scheme`, trái với tiêu chí chỉ có `cms.colorMode`. Chế độ màu do `useTheme()` quản lý hoàn toàn.
- Đoạn mẫu `vite.config.ts` ở §J dùng alias `@`. Ở đây không dùng alias đó, vì §N đã bỏ alias gốc và dùng `vite-tsconfig-paths`.
- `vite.config.ts` và `vitest.config.ts` import kèm đuôi `.ts`, vì `tsconfig.node.json` dùng `module: nodenext`.
- Font: Fontsource không có file CSS riêng cho từng subset, nên `dist` vẫn chứa đủ các file woff2. Tuy vậy `@font-face` có khai `unicode-range`, nên trình duyệt chỉ tải `latin`, `latin-ext` và `vietnamese`.
- Text trong UserMenu đang viết cứng; plan 08 chuyển sang i18n. Thông tin user và nút đăng xuất làm ở plan 09.
- Plan này không có test tự động, vì `UseTheme` không nằm trong danh sách seam đã chốt.

## Việc còn tồn

- Màu brand vẫn là màu tạm, chờ màu thương hiệu chính thức.
- Token usage: chưa điền.
