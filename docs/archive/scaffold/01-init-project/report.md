# 01 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `chore/init-project` / —
Ngày hoàn thành: 2026-11-07

## Đã làm

- Dựng Vite + Vue + TS (template `vue-ts` của create-vite) ở thư mục gốc. Bỏ file demo (`HelloWorld.vue`, `hero.png`, `vue.svg`, `vite.svg`, `style.css`, `public/icons.svg`); chỉ giữ `public/favicon.svg` (ngoại lệ §B.1). `App.vue`/`main.ts` tối giản.
- `index.html`: `lang="vi"`, title `Fashion Store CMS`.
- Cài đủ §K.1 (dependencies) và §K.3 (devDependencies); K.2 chưa cài.
- `tsconfig.app.json` và `tsconfig.node.json`: `strict`, `noUncheckedIndexedAccess`; `paths` cho 7 alias §N trong `tsconfig.app.json`.
- `vite.config.ts`: `tsconfigPaths({ loose: true })` + `vue()`.
- `src/env.d.ts` khai báo `VITE_API_BASE_URL`.
- `.nvmrc` (22), `engines.node >=22`, `.editorconfig`, `.gitignore` (gộp bản cũ với bản Vite và thêm coverage/Playwright), `.env.example`, `.vscode/extensions.json`.
- Script trong `package.json`: `dev`, `build`, `preview`, `typecheck`. Các script còn lại của §G thêm ở plan dùng tới (lint → 02, test → 04…).

## Kết quả kiểm tra

| Mục kiểm tra (theo plan.md)            | Kết quả | Ghi chú                                                                |
| -------------------------------------- | ------- | ---------------------------------------------------------------------- |
| `npm run dev` mở được trang            | Pass    | `curl localhost:5179` trả HTML có `<title>Fashion Store CMS</title>`   |
| `npm run typecheck`                    | Pass    |                                                                        |
| Alias §N chạy ở cả vue-tsc và Vite     | Pass    | Thử bằng file tạm `@shared/AliasProbe` import từ `App.vue`, sau đó xoá |
| `noUncheckedIndexedAccess` có hiệu lực | Pass    | `const y: number = x[0]` báo TS2322                                    |
| `vite build`                           | Pass    |                                                                        |

## Lệch so với plan / quyết định mới

- **TypeScript `~5.9`, không dùng 6.x/7.x**: `typescript-eslint@8` cần `<6.1`, `openapi-typescript@7` cần `^5.x`. Nâng TS khi hai package này hỗ trợ.
- **Không có `baseUrl`**: `paths` dùng đường dẫn `./src/...` tương đối với tsconfig. `baseUrl` không còn cần cho `paths` và đã bị đánh dấu deprecated ở TS 6.
- **`tsconfigPaths({ loose: true })` thay vì `tsconfigPaths()`**: nếu không có `loose`, plugin không resolve alias khi file import là `.vue` (Vite báo `Failed to resolve import "@shared/..." from "src/App.vue"`). Cách khác là bật `allowJs`. Cần cập nhật đoạn mẫu §N trong scaffold-plan.
- **`@types/node@22`** để khớp `.nvmrc`.

## Việc còn tồn

- `npm audit`: 20 lỗi (3 low, 17 moderate), đều nằm trong devDependency (chuỗi `@typescript-eslint/*`, `minimatch`, `esbuild`). Phần prod (`--omit=dev`) chỉ có 1 low (esbuild). Chưa chạy `audit fix --force` vì sẽ đổi major.
- License: không có GPL. Có một gói LGPL-3.0: `@img/sharp-libvips` (dependency gián tiếp của `@vite-pwa/assets-generator` → `sharp`). Gói này là devDependency, chỉ chạy lúc sinh icon, không vào bundle. Cần người phụ trách xác nhận chấp nhận.
- npm 12 chặn install script mặc định (`vue-demi` postinstall…). Hiện chưa gây lỗi; theo dõi ở các plan sau.
- Token usage: chưa điền, cần lấy từ `/cost`.
