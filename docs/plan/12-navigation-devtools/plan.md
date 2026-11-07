# 12 — Navigation và tool dev

Status: in-progress
Blocked by: 09
Nguồn: Step 5b (phần 2) trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41, trong đó D24, D32 đã huỷ), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 5b (phần 2) — Navigation và tool dev

**Làm gì**

- `RouteMeta.d.ts`, `layouts/Navigation.ts` + `Navigation.spec.ts` (sidebar lọc theo `can()`, title, commands/shortcuts sinh đúng từ meta), `AppSidebar` render từ Navigation, `document.title` theo §S.1. Command palette và phím tắt **hoãn tới P5** (D38).
- Tool dev theo §S.2 (checker, query devtools, dependabot, knip, `analyze`).

**Kiểm tra:** sidebar chỉ hiện route có quyền; `Navigation.spec.ts` pass; chỉ `Navigation.ts` đọc `route.meta` (trừ `Guards.ts` đọc `requiresAuth`) (§V.3); `npm run knip` và `npm run analyze` chạy được.

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

### S. Tính năng & tool bổ trợ cho CMS

#### S.1. Tính năng tăng tốc thao tác (làm sẵn ở Foundation, phần nghiệp vụ gắn dần theo Phase)

| Tính năng                           | Cách làm                                                                                                                                                                                                                                                                                                                                                                        | Phase                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Navigation module**               | `layouts/Navigation.ts` — **một nơi duy nhất** suy ra từ route meta: `buildNavigation(routes, can)` (hàm thuần) → `{ sidebar, commands, shortcuts, titleOf }`; `useNavigation()` bọc reactive với `useAuth().can`. Sidebar, palette, bảng phím tắt, `document.title` chỉ render kết quả, không tự đọc `meta`. Test: `Navigation.spec.ts`, không mount (D38)                     | Foundation                                    |
| **Command palette** (`Ctrl/⌘ + K`)  | `UCommandPalette` của Nuxt UI trong `layouts/components/CommandPalette.vue`, render `useNavigation().commands`. Nhóm "Đi tới" từ route có `meta.command` (đã lọc theo `can()` trong Navigation); nhóm "Hành động nhanh" (Tạo sản phẩm, Tạo danh mục…) cũng khai báo bằng `meta.command` của route create; nhóm "Tìm kiếm" gọi qua `Use<Feature>.ts` (`useProducts().search(q)`) | P5 (Phase đầu có ≥ 2 route có `meta.command`) |
| **Phím tắt**                        | `defineShortcuts` của Nuxt UI, đọc `useNavigation().shortcuts` — Navigation gộp phím từ `meta.command.shortcut` (`g d`, `g p`, `g o`, `n`) với phím toàn cục không gắn route (`/`, `?`, `Ctrl/⌘+K`)                                                                                                                                                                             | P5                                            |
| Bảng phím tắt                       | `layouts/components/ShortcutsHelpModal.vue`, render `useNavigation().shortcuts`                                                                                                                                                                                                                                                                                                 | P5                                            |
| **Cảnh báo rời trang khi chưa lưu** | `shared/composables/UseUnsavedGuard.ts`: `onBeforeRouteLeave` + `beforeunload` + `useConfirm()`                                                                                                                                                                                                                                                                                 | P5                                            |
| **Bộ lọc đã lưu**                   | Trong `UseListState.ts`: lưu/đặt tên tổ hợp filter vào `localStorage` theo route (`cms.views.<routeName>`)                                                                                                                                                                                                                                                                      | P5                                            |
| **Xem gần đây**                     | `shared/composables/UseRecentItems.ts` lưu 10 bản ghi vừa mở (id, title, route), hiện trong command palette                                                                                                                                                                                                                                                                     | P5                                            |
| **Thao tác hàng loạt**              | `DataTable.vue` hỗ trợ chọn nhiều + thanh bulk action (xoá, đổi trạng thái), luôn qua `useConfirm()`                                                                                                                                                                                                                                                                            | P5                                            |
| **Xuất CSV**                        | `shared/lib/export/ExportCsv.ts` (không dùng thư viện), xuất theo filter hiện tại                                                                                                                                                                                                                                                                                               | P10                                           |
| **Sao chép nhanh**                  | `shared/components/display/CopyText.vue` (SKU, mã đơn) dùng `useClipboard` của VueUse                                                                                                                                                                                                                                                                                           | P5                                            |
| **Tương đối thời gian**             | `dayjs/plugin/relativeTime` + tooltip ngày giờ đầy đủ                                                                                                                                                                                                                                                                                                                           | P5                                            |

Route meta dùng chung (khai báo kiểu trong `src/app/router/RouteMeta.d.ts`):

```ts
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    permission?: string
    titleKey?: string // i18n key cho <title> + breadcrumb
    command?: { icon: string; group: 'navigate' | 'create'; shortcut?: string[] }
  }
}
```

`Router.ts` đặt `document.title` từ `titleOf(route)` của Navigation sau mỗi lần điều hướng (không tự đọc `meta.titleKey`).

#### S.2. Tool cho dev

| Tool                           | Vai trò                                                                              | Khi nào                     |
| ------------------------------ | ------------------------------------------------------------------------------------ | --------------------------- |
| `vite-plugin-checker`          | Hiện lỗi `vue-tsc` + ESLint ngay trên overlay trình duyệt khi `npm run dev`          | Step 2                      |
| `vite-plugin-vue-devtools`     | Vue devtools trong trang                                                             | Step 1 (đã có)              |
| `@tanstack/vue-query-devtools` | Xem cache query, chỉ load khi dev                                                    | Step 3a (chuyển từ K.2 lên) |
| `@faker-js/faker`              | Factory dữ liệu test: `src/test/factories/<Entity>.factory.ts`                       | Step 3a                     |
| `.github/dependabot.yml`       | PR cập nhật dependency hằng tuần, gom nhóm theo `vue`, `nuxt-ui`, `eslint`, `vitest` | Step 2b                     |
| `knip`                         | Tìm file/export/dependency thừa — chạy `npm run knip` trong CI (không chặn merge)    | Step 2b                     |
| `rollup-plugin-visualizer`     | `npm run analyze` xem kích thước bundle                                              | Step 7                      |
