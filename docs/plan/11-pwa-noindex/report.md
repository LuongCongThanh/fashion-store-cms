# 11 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/pwa-noindex` (stacked trên `test/e2e-coverage`)
Ngày hoàn thành: 2026-11-07

## Đã làm

- **Chặn index**: thêm `<meta name="robots" content="noindex, nofollow">` vào `index.html` và tạo `public/robots.txt` (`User-agent: *`, `Disallow: /`).
- **PWA** (`vite-plugin-pwa`, cấu hình theo §R.2):
  - `registerType: 'prompt'`, `injectRegister: false`.
  - Manifest: `display: standalone`, `start_url: /admin`, `theme_color` là brand-600.
  - Chỉ precache app shell; `/api/` nằm trong `navigateFallbackDenylist`, không có `runtimeCaching`. `devOptions.enabled: false`.
- `pwa-assets.config.ts` (preset `minimal2023`) sinh icon từ `src/assets/images/Logo.svg`: 64, 192, 512, maskable 512, apple-touch 180 và favicon.ico. Thêm script `pwa:assets`.
- `shared/composables/UsePwa.ts`: `usePwa()` trả `{ needRefresh, reload }`, kiểm tra bản mới mỗi 60 phút và khi tab được focus lại.
- `shared/components/feedback/OfflineBanner.vue` dùng `useOnline` của VueUse.
- `DashboardLayout`: hiện `OfflineBanner`; khi `needRefresh` thì gọi `notify.prompt(...)` để hiện toast có nút Tải lại.
- **Notifier** có thêm `prompt(key, action)`, làm theo TDD với 1 ca mới trong `UseNotify.spec`. `src/test/Render.ts` có thêm `createFakeNotifier()`; `renderWithPlugins` dùng notifier này mặc định và trả nó ra.
- **Env**: `VITE_API_BASE_URL` chấp nhận thêm path cùng origin (`/api`). Có 2 ca mới trong `Env.config.spec`. Commit `.env.production` với `/api`.
- `tsconfig.app.json` thêm types `vite-plugin-pwa/vue` và `vite-plugin-pwa/info`.
- Thêm key i18n `pwa.*`.

## Kết quả kiểm tra

Kiểm tra trên `vite preview` bằng script Playwright. Script chỉ dùng một lần, không commit.

| Mục kiểm tra                              | Kết quả | Ghi chú                                                                                                                                                                                    |
| ----------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `curl /robots.txt` trả `Disallow: /`      | Pass    |                                                                                                                                                                                            |
| HTML có meta `noindex`                    | Pass    |                                                                                                                                                                                            |
| Cài được như app                          | Pass*   | Manifest `standalone`, icon 192/512/maskable đều trả 200, trang được SW điều khiển. *Chưa chạy Lighthouse vì máy không có Chrome đầy đủ. Các điều kiện installable của Chrome đều đã thoả. |
| Build lại thì tab cũ hiện toast Tải lại   | Pass    | Build lại → `update()` → toast "Đã có phiên bản mới" có nút "Tải lại"; bấm nút thì trang tải bản mới                                                                                       |
| Offline thì hiện banner, app shell vẫn mở | Pass    | `setOffline(true)` rồi reload: trang vẫn mở, có banner "Mất kết nối mạng…"                                                                                                                 |
| test, e2e, lint, typecheck, build         | Pass    | 116/116, e2e 2/2                                                                                                                                                                           |

## Lệch so với plan / quyết định mới

- **`pwaAssets.integration.publicDir` trỏ vào `src/assets/images`**: integration của plugin tính đường dẫn output tương đối với `public/`. Logo nằm ngoài `public/`, nên icon bị ghi thẳng vào `src/assets/images/` thay vì `dist/`. Sau khi sửa, icon xuất ra `dist/`.
- **`public/favicon.svg` là bản sao của `Logo.svg`**, vì thẻ link SVG mà plugin sinh ra cần một file nằm trong `public/` (dùng `resolveSvgName`). Đã bỏ thẻ favicon bị trùng trong `index.html`. Hiện có 2 bản logo, khác với §R.2 ("bản duy nhất"); đổi logo thì phải sửa cả hai.
- **`VITE_API_BASE_URL` cho phép path `/api`**, nếu không bản build production lỗi env ngay khi mở. Môi trường deploy vẫn ghi đè được.
- **Notifier có thêm `prompt()`**: interface ở §Q.3 chỉ có `success` và `error`, nhưng toast "bản mới" cần một nút hành động.
- Phần "mutation bị chặn ở UI khi offline (nút lưu disabled)" chưa làm, vì chưa có form hay mutation nào. Khi làm `FormActions.vue` (P5) thì dùng `useOnline`.

## Việc còn tồn

- **Checklist deploy cho DevOps**: thêm header `X-Robots-Tag: noindex, nofollow` cho mọi response (§R.1); reverse proxy chuyển `/api` tới BE, hoặc đặt `VITE_API_BASE_URL` khi build.
- Chạy Lighthouse PWA trên Chrome thật.
- Token usage: chưa điền.
