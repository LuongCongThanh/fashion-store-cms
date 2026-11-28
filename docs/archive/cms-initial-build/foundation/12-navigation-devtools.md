# F12 — Navigation và tool dev

> Hồ sơ lịch sử nền tảng; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: done
Blocked by: 09
Nguồn: Step 5b (phần 2) · Spec tổng: [Phạm vi giai đoạn](../foundation.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../foundation.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Sidebar và document.title sinh từ route meta qua một module Navigation; có bộ tool dev.

### Phạm vi (Làm gì)

- `RouteMeta.d.ts`, `layouts/Navigation.ts` + `Navigation.spec.ts` (sidebar lọc theo `can()`, title, commands/shortcuts sinh đúng từ meta), `AppSidebar` render từ Navigation, `document.title` theo §S.1. Command palette và phím tắt **hoãn tới P5** (D38).
- Tool dev theo §S.2 (checker, query devtools, dependabot, knip, `analyze`).

### Tiêu chí hoàn thành

sidebar chỉ hiện route có quyền; `Navigation.spec.ts` pass; chỉ `Navigation.ts` đọc `route.meta` (trừ `Guards.ts` đọc `requiresAuth`) (§V.3); `npm run knip` và `npm run analyze` chạy được.

### Phụ thuộc

- Blocked by: 09

### Ngoài phạm vi

- Những việc của các plan con khác trong [spec tổng](../foundation.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

### Kế hoạch thực hiện

#### Step 5b (phần 2) — Navigation và tool dev

**Làm gì**

**Kiểm tra:** sidebar chỉ hiện route có quyền; `Navigation.spec.ts` pass; chỉ `Navigation.ts` đọc `route.meta` (trừ `Guards.ts` đọc `requiresAuth`) (§V.3); `npm run knip` và `npm run analyze` chạy được.

### Phần tham chiếu

Các đoạn dùng chung được giữ một lần ở scaffold plan; đây là tài liệu lịch sử, không phải quy tắc hiện hành.

- [Scaffold — s-tính-năng--tool-bổ-trợ-cho-cms](../reference/app-capabilities.md#s-tính-năng--tool-bổ-trợ-cho-cms)

## Kết quả và review

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/navigation-devtools` (stacked trên `feat/pwa-noindex`)
Ngày hoàn thành: 2026-11-07

### Đã làm

- **`layouts/Navigation.ts`**, viết theo TDD tại seam `Navigation.spec` (4 ca, test hàm thuần, không mount):
  - `buildNavigation(routes, can)` trả `{ sidebar, commands, shortcuts, titleOf }`. Route con được ghép đường dẫn đầy đủ, và mọi danh sách đều lọc theo `can(meta.permission)`.
  - `useNavigation()` bọc kết quả trên thành reactive, dùng `router.options.routes` và `useAuth().can`.
- Các ca trong `Navigation.spec`:
  1. Sidebar chỉ có route nhóm `navigate` mà user có quyền.
  2. `commands` gồm cả nhóm `create`.
  3. `shortcuts` lấy từ `meta.command.shortcut`.
  4. `titleOf` lấy `titleKey` của route con sâu nhất.
- `layouts/components/AppSidebar.vue` chỉ render `useNavigation().sidebar` qua `UNavigationMenu`. Trạng thái thu gọn lưu bằng `useLocalStorage('cms.sidebarCollapsed')`. Sidebar rộng 256px, khi thu gọn còn 64px, cố định từ breakpoint `lg`.
- `Router.ts` đặt `document.title` bằng `titleOf(to)` của Navigation, không tự đọc meta. Vì cần `translate`, `createAppRouter` nhận thêm tham số `{ translate }` do Runtime truyền vào.
- Route `home` có `titleKey` và `command` (`g d`). Thêm key i18n `nav.*` và `common.appName`.
- **Tool dev (§S.2)**:
  - `vite-plugin-checker`: overlay lỗi vue-tsc và ESLint, chỉ chạy khi dev server.
  - `vite-plugin-vue-devtools`: chỉ chạy khi dev server.
  - `@tanstack/vue-query-devtools`: `App.vue` tải lazy khi `import.meta.env.DEV`, nên không vào bundle production.
  - `src/test/factories/User.factory.ts` dùng faker; `UseAuth.spec` đã chuyển sang dùng factory này.
  - `.github/dependabot.yml`: chạy hằng tuần, gom nhóm vue, nuxt-ui, eslint, vitest, và có thêm github-actions.
  - `knip.json` và script `knip`.
  - `rollup-plugin-visualizer` và script `analyze` (xuất ra `dist/stats.html`).
- `.prettierrc.json` thêm `tailwindStylesheet`, để prettier-plugin-tailwindcss nhận ra các utility của Nuxt UI và sắp xếp class đúng. Đã format lại các file `.vue` theo cấu hình mới.
- Thêm devDependency `@commitlint/types`, vì knip báo `commitlint.config.ts` có import gói này mà chưa khai báo.

### Kết quả kiểm tra

| Mục kiểm tra                                           | Kết quả | Ghi chú                                                                                                      |
| ------------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------ |
| Sidebar chỉ hiện route có quyền                        | Pass    | Có ca trong `Navigation.spec`; trên browser sidebar có "Tổng quan", title là "Tổng quan · Fashion Store CMS" |
| `Navigation.spec.ts`                                   | Pass    | 4/4                                                                                                          |
| Chỉ `Navigation.ts` đọc `route.meta` (trừ `Guards.ts`) | Pass    | grep: ngoài `Navigation.ts` chỉ có `Guards.ts` đọc meta                                                      |
| `npm run knip` chạy được                               | Pass    | Không còn lỗi, chỉ còn gợi ý về `.css`                                                                       |
| `npm run analyze` chạy được                            | Pass    | `dist/stats.html` khoảng 600KB                                                                               |
| Dev server có checker                                  | Pass    | Log: `[ESLint] Found 0 error`, `[vue-tsc] Found 0 errors`                                                    |
| test, e2e, lint, format, typecheck                     | Pass    | 120/120, e2e 2/2                                                                                             |

### Lệch so với plan / quyết định mới

- `Guards.ts` đọc cả `meta.permission`, không chỉ `requiresAuth` như ngoại lệ ghi ở §V.3, vì guard phải kiểm tra quyền (FE_architecture §8). Nếu muốn đúng §V.3 tuyệt đối, có thể cho Navigation cung cấp `permissionOf(route)`.
- Quy ước: sidebar gồm các route có `meta.command.group === 'navigate'`. RouteMeta ở §S.1 không có field riêng cho sidebar.
- `knip.json`: bỏ qua một số dependency mà knip không thấy được chỗ dùng: font (import trong CSS), `@iconify-json/lucide` (Nuxt UI dùng), `@pinia/testing` (§K.3, chưa dùng), `openapi-typescript` (plan 13).
- `vitest.config.ts` gọi `viteConfig(env)`, vì `vite.config.ts` giờ là hàm `({ command, mode })`.
- Command palette và phím tắt hoãn tới P5 (D38). `commands` và `shortcuts` đã được sinh sẵn.

### Việc còn tồn

- Thêm `npm run knip` vào CI dạng không chặn merge (§S.2), làm cùng plan 14 hoặc một PR CI riêng.
- Token usage: chưa điền.
