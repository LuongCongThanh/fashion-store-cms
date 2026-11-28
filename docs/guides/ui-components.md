# UI, token và theme

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Cấu hình CSS (Tailwind v4 + Nuxt UI)

- Một entry duy nhất `src/assets/styles/main.css`, import trong `main.ts`. Không dùng SCSS, không CSS-in-JS.
- Tailwind v4 cấu hình bằng CSS (`@theme`), **không có** `tailwind.config.js`.
- Palette brand khai báo bằng `@theme` trong `main.css`; map màu ngữ nghĩa nằm duy nhất trong `Ui.config.ts` (D26, [§L.9](#cấu-hình)); component chỉ dùng màu ngữ nghĩa (`primary`, `neutral`, `error`…), không dùng mã màu cứng.
- Dark mode: class `dark` trên `<html>` do `useTheme()` gắn, mặc định theo hệ thống.
- Ưu tiên utility class trong template; `<style scoped>` chỉ khi không làm được bằng utility; cấm `<style>` không scoped (trừ `main.css`).
- Thứ tự class tự sắp xếp bằng `prettier-plugin-tailwindcss`.
- Không có `variables.css` riêng — token nằm trong `@theme` của `main.css`.
- Plugin `ui()` trong `vite.config.ts`: `autoImport: false`, `components: false` (import component tường minh: `import UButton from '@nuxt/ui/components/Button.vue'`), `colorMode: false` (chế độ màu do `useTheme()` quản lý, [§L.11](#theme)), `ui: uiConfig`.

Nội dung `main.css` đầy đủ: xem [§L.9](#cấu-hình).

> Nguồn: [`vite.config.ts`](../../vite.config.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/main.ts`](../../src/main.ts) — tài liệu không chép lại code, đọc file.

`.vscode/settings.json` thêm `"files.associations": { "*.css": "tailwindcss" }` để IntelliSense hiểu `@theme`.

---

## Design system (token CSS)

**Luật thiết kế nằm ở [`DESIGN.md`](../../DESIGN.md)**: màu, typography, spacing, component, layout, archetype màn hình, do/don't. File này chỉ giữ phần cài đặt token trong code (L.9–L.11). Thứ tự khi đổi token: `DESIGN.md` → `main.css` / `Ui.config.ts`, trong cùng một PR.

Phần visual rules cũ đã chuyển sang `DESIGN.md`; bảng ký hiệu cũ trong CONVENTIONS chỉ giúp tra owner, không duy trì bản sao token.

## Cấu hình

> Nguồn: [`src/assets/styles/main.css`](../../src/assets/styles/main.css) — tài liệu không chép lại code, đọc file.

Map màu ngữ nghĩa khai báo một lần trong `src/app/config/Ui.config.ts`; `vite.config.ts` chỉ import. Định nghĩa ý nghĩa màu thuộc DESIGN; phần Theme dưới đây mô tả cách nối vào source.

## Kiểm soát

- ESLint/review: cấm mã màu hex/rgb trong `.vue` và class palette thô (`bg-rose-*`, `text-slate-*`) — thêm rule `no-restricted-syntax` cho chuỗi class khi cần, trước mắt kiểm tra trong PR checklist.

## Theme

**Chế độ màu**

- 3 lựa chọn: Sáng / Tối / Theo hệ thống; mặc định **Theo hệ thống**.
- Nút chuyển ở menu avatar (góc phải header); lưu `localStorage` key `cms.colorMode`.
- Dùng `useColorMode` của VueUse, không tự viết; **phải** cấu hình `storageKey: 'cms.colorMode'` (mặc định của VueUse là `vueuse-color-scheme`) cho khớp script chống nháy bên dưới. Bọc trong một composable `useTheme()` (đặt ở `shared/composables/UseTheme.ts`) để key chỉ khai báo một chỗ.
- Chống nháy trắng: script inline trong `<head>` của `index.html` gắn class `dark` trước khi Vue chạy.

> Nguồn: [`index.html`](../../index.html) — tài liệu không chép lại code, đọc file.

**Dark mode**

- `primary` dùng step 400 (light dùng 600) — [§L.9](#cấu-hình).
- Nền: `neutral` = slate → nền dark `slate-950`, khối phụ `slate-900` (token `--ui-bg`, `--ui-bg-muted` của Nuxt UI).
- ECharts: 2 theme `cms-light` / `cms-dark` đăng ký từ token, tự đổi theo `useColorMode` (làm ở Phase 4).

**Mặc định component**

Chỉnh tập trung trong `src/app/config/Ui.config.ts`, import vào `vite.config.ts` (thêm file này vào `tsconfig.node.json`). Không truyền lặp props size/variant ở từng chỗ dùng.

> Nguồn: [`src/app/config/Ui.config.ts`](../../src/app/config/Ui.config.ts) — tài liệu không chép lại code, đọc file.

`vite.config.ts` import `uiConfig` như [§J](#cấu-hình-css-tailwind-v4--nuxt-ui). `Ui.config.ts` không được import gì từ `src/` (chạy trong Node lúc build).

**Không làm (giai đoạn này)**

- Theme theo từng cửa hàng: cả CMS một màu thương hiệu (hệ thống chỉ có một Store).
- Người dùng tự chọn màu primary, nút chuyển mật độ (mật độ theo `DESIGN.md`: màn chung comfortable, bảng nghiệp vụ compact).

---

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../README.md).
