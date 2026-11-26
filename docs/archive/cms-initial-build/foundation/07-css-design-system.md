# F07 — CSS, design system, theme

> Hồ sơ lịch sử nền tảng; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: done
Blocked by: 05
Nguồn: Step 3b · Spec tổng: [Phạm vi giai đoạn](../foundation.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../foundation.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Có design system token CSS, Ui.config.ts là nguồn màu duy nhất, theme Sáng/Tối/Hệ thống không nháy.

### Phạm vi (Làm gì)

- CSS theo §J và §L: token, font, `main.css` (§L.9).
- `Ui.config.ts` là nguồn duy nhất map màu + mặc định component (D26).
- Theme theo §L.11: `useTheme()` với `storageKey: 'cms.colorMode'`, script chống nháy trong `index.html`, nút chuyển Sáng/Tối/Hệ thống.
- Trang dev `/admin/design-system` hiển thị token (§L.10).

### Tiêu chí hoàn thành

đúng màu primary; chọn Tối rồi F5 không nháy trắng; `localStorage` chỉ có key `cms.colorMode`.

### Phụ thuộc

- Blocked by: 05

### Ngoài phạm vi

- Những việc của các plan con khác trong [spec tổng](../foundation.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

### Kế hoạch thực hiện

#### Step 3b — CSS, design system, theme

**Làm gì**

**Kiểm tra:** đúng màu primary; chọn Tối rồi F5 không nháy trắng; `localStorage` chỉ có key `cms.colorMode`.

### Phần tham chiếu

Các đoạn dùng chung được giữ một lần ở scaffold plan; đây là tài liệu lịch sử, không phải quy tắc hiện hành.

- [Scaffold — j-cấu-hình-css-tailwind-v4--nuxt-ui](../reference/styling.md#j-cấu-hình-css-tailwind-v4--nuxt-ui)
- [Scaffold — l-design-system-token-css](../reference/design-tokens.md#l-design-system-token-css)

## Kết quả và review

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/css-design-system` (stacked trên `feat/errors-toast-dialog`)
Ngày hoàn thành: 2026-11-07

### Đã làm

- `src/assets/styles/main.css` theo §L.9: Tailwind v4, Nuxt UI, 2 font tự host, `@theme` với palette brand (đang là màu tạm), `--ui-radius`, `--ui-primary` (light dùng step 600, dark dùng 400). File được import trong `main.ts`.
- `src/app/config/Ui.config.ts` là nguồn duy nhất cho map màu ngữ nghĩa và mặc định component (D26). `vite.config.ts` import file này; đã thêm nó vào `tsconfig.node.json`.
- `shared/composables/UseTheme.ts`: `useTheme()` bọc `useColorMode` của VueUse với `storageKey: 'cms.colorMode'`, mặc định là `auto`.
- Script chống nháy trắng trong `<head>` của `index.html`.
- `layouts/components/UserMenu.vue` có menu Sáng / Tối / Theo hệ thống. `DashboardLayout` có header chứa UserMenu.
- `app/views/DesignSystemView.vue` hiển thị màu ngữ nghĩa (button, badge), nền và chữ, typography, input. Route `/admin/design-system` chỉ đăng ký khi `import.meta.env.DEV`.
- `.vscode/settings.json`: thêm `files.associations` `*.css → tailwindcss`.

### Kết quả kiểm tra

Kiểm tra bằng script Playwright chạy trên dev server. Script chỉ dùng một lần, không commit.

| Mục kiểm tra                              | Kết quả | Ghi chú                                                                                 |
| ----------------------------------------- | ------- | --------------------------------------------------------------------------------------- |
| Đúng màu primary                          | Pass    | `--ui-primary` = `#e11d48` (brand-600); nền button `rgb(225, 29, 72)`                   |
| Chọn Tối rồi F5 không nháy trắng          | Pass    | Ngay khi reload (`waitUntil: 'commit'`), `<html>` đã có class `dark` trước khi app chạy |
| `localStorage` chỉ có key `cms.colorMode` | Pass    | Danh sách key là `['cms.colorMode']`, cả trước và sau reload                            |
| Build không chứa trang design-system      | Pass    | Không có chunk `DesignSystem` trong `dist`                                              |
| test, lint, typecheck, format             | Pass    | 96/96                                                                                   |

### Lệch so với plan / quyết định mới

- `ui({ colorMode: false })`: tắt tích hợp color-mode của Nuxt UI. Nếu bật, Nuxt UI tự ghi key `vueuse-color-scheme`, trái với tiêu chí chỉ có `cms.colorMode`. Chế độ màu do `useTheme()` quản lý hoàn toàn.
- Đoạn mẫu `vite.config.ts` ở §J dùng alias `@`. Ở đây không dùng alias đó, vì §N đã bỏ alias gốc và dùng `vite-tsconfig-paths`.
- `vite.config.ts` và `vitest.config.ts` import kèm đuôi `.ts`, vì `tsconfig.node.json` dùng `module: nodenext`.
- Font: Fontsource không có file CSS riêng cho từng subset, nên `dist` vẫn chứa đủ các file woff2. Tuy vậy `@font-face` có khai `unicode-range`, nên trình duyệt chỉ tải `latin`, `latin-ext` và `vietnamese`.
- Text trong UserMenu đang viết cứng; plan 08 chuyển sang i18n. Thông tin user và nút đăng xuất làm ở plan 09.
- Plan này không có test tự động, vì `UseTheme` không nằm trong danh sách seam đã chốt.

### Việc còn tồn

- Màu brand vẫn là màu tạm, chờ màu thương hiệu chính thức.
- Token usage: chưa điền.
