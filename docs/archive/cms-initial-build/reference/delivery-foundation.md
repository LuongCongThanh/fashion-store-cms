# Các bước scaffold nền tảng

> Lịch sử thực hiện scaffold; giữ tiêu chí và bằng chứng ban đầu, không chạy lại như hướng dẫn mới.

## Step 0 — Chốt tài liệu

**Làm gì**

- Đồng bộ `FE_architecture.md` với plan (cây thư mục, tên file, bỏ MSW, danh sách package, Store scope, `Session` + `createAppRuntime()`) — đã làm trong PR tài liệu (#1).
- Chỉ sửa chỗ lệch; không chép lại convention của plan vào `FE_architecture.md` (tránh hai nguồn chuẩn — convention sẽ sang `CONVENTIONS.md` ở Step 7).

**Kiểm tra:** review và xác nhận trước khi viết code. Step 0 đã hoàn tất trong PR tài liệu (#1).

---

## Step 1 — Khởi tạo dự án

**Làm gì**

- Tạo Vite + Vue + TypeScript ở thư mục gốc; đổi tên file sinh sẵn theo §B.1.
- Cài dependency theo §K.1 và devDependency theo §K.3 (K.2 cài khi tới Phase).
- TypeScript `strict`, `noUncheckedIndexedAccess`, alias theo §N (`paths` trong `tsconfig.app.json` + `vite-tsconfig-paths`).
- `.nvmrc`, `engines`, `.editorconfig`, `.gitignore`, `.env.example`.

**Output:** `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`.

**Kiểm tra:** `npm run dev` mở được trang; `npm run typecheck` pass.

---

## Step 2 — Lint, format, hooks

**Làm gì**

1. ESLint flat config theo §E (bảng `BOUNDARIES` + `toFlatConfig`) và `eslint.config.spec.ts` (D41).
2. Prettier + `.prettierignore` (bỏ `Api.generated.ts`, `dist/`, `coverage/`).
3. `npx husky init`; tạo 3 hook theo §D.
4. `lint-staged.config.ts`, `commitlint.config.ts` (extends `config-conventional`, `scope-enum` theo §C.2, `header-max-length: 72`).
5. `.vscode/settings.json` + `extensions.json`.

**Kiểm tra** (các ca import dưới đây nằm trong `eslint.config.spec.ts`, chạy bằng `npm test` — không kiểm tay)

- `npm run lint`, `npm run format:check` pass; `eslint.config.spec.ts` pass.
- Commit `"update stuff"` → bị chặn; `"chore(config): add eslint"` → qua.
- File `src/foo-bar.ts` → ESLint báo sai tên.
- Import `@features/auth/stores/Auth.store` từ `layouts/` → ESLint báo lỗi.
- Import `@features/auth/schemas/X` từ `layouts/` → báo lỗi; `@features/auth/UseAuth` → qua.
- Trong `features/auth/views/`, import `../../products/api/X` → báo lỗi; `../stores/Auth.store` → qua.
- Import `@features/auth/views/LoginView.vue` từ `Routes.ts` → qua; từ `layouts/` → báo lỗi.
- `layouts/AuthLayout.vue` import `../lib/api/client/HttpClient` → báo lỗi; `@shared/lib/api/client/HttpClient` → qua.
- `src/test/Render.ts` import `@app/Runtime` → qua; `features/auth/api/Auth.api.ts` import `@app/Runtime` → báo lỗi.
- `layouts/components/AppHeader.vue` import `./UserMenu.vue` → qua; `../AuthLayout.vue` → báo lỗi.
- `layouts/components/UserMenu.vue` import `@app/Runtime` → báo lỗi; `@shared/composables/UseTheme` → qua.
- `features/auth/UseAuth.ts` import `@layouts/DashboardLayout.vue` → báo lỗi.
- `shared/composables/UseNotify.ts` import `@features/auth/UseAuth` → báo lỗi.
- `shared/lib/` import `@shared/composables/*` hoặc `@shared/components/*` → báo lỗi; import `@shared/lib/...` khác → qua.
- `shared/components/` import `@shared/lib/api/client/HttpClient` → báo lỗi; `@shared/composables/*` → qua.
- `features/auth/components/X.vue` import `../api/Auth.api` hoặc `vue-router` → báo lỗi (presentational).
- `features/auth/views/LoginView.vue` import `@shared/types/Api.generated` → báo lỗi; trong `features/auth/api/` → qua.
- Push khi có lỗi type → bị chặn.

---

## Step 2b — GitHub

**Làm gì**

- PR template, issue templates theo §F.1.
- `.github/workflows/ci.yml`: `npm ci` → `lint` → `typecheck` → `test` → `build` (e2e thêm khi có flow thật).
- Bảo vệ `main` theo §C.4 — **bạn bật tay trên GitHub**.

**Kiểm tra:** mở PR thử thấy template; CI chạy xanh.

---

## Step 3a — Khung `src/`, HTTP client, nền tảng test

**Làm gì**

- Tạo `app/`, `config/Env.config.ts`, `shared/lib/api/`, `layouts/`, `App.vue`, `main.ts` với nội dung tối thiểu.
- `Env.config.ts`: đọc và validate `VITE_*` bằng Zod.
- `shared/lib/session/Session.ts` theo §M.2 (tạo **trước** HttpClient vì HttpClient phụ thuộc Session) + `Session.spec.ts`: N lời gọi `refresh()` đồng thời → 1 lần `callRefresh`; refresh thất bại → xoá token + phát `authFailure`; `logout()`/`switchStore()` gọi `queryClient.clear()`.
- `HttpClient.ts` (một file) theo §M.1 (interface hẹp, có kiểu theo `paths`, deps không có kiểu axios) + `HttpClient.spec.ts`: N request 401 → 1 lần `session.refresh()`; request `skipAuth` không có `Authorization`; refresh thất bại → Session phát `authFailure`; mọi request có `X-Store-Id`, `Accept-Language`; lỗi luôn là `ApiError`.
- Vitest theo §I: `vitest.config.ts`, `src/test/Setup.ts`, `src/test/Render.ts`(cài sớm để các step sau viết test ngay).
- `app/Runtime.ts` theo §M.2 (`createAppRuntime()`) + `Runtime.spec.ts`; `main.ts` chỉ một dòng `createApp(App).use(createAppRuntime().plugin).mount('#app')`. Chưa có `features/auth` nên Session bắt đầu ở trạng thái chưa đăng nhập.

**Kiểm tra:** app chạy thấy `DashboardLayout.vue` rỗng (sidebar thật làm ở Step 4/5b); `npm test` pass; `shared/lib/` không import `features/` (ESLint); `client/` chỉ có `HttpClient.ts` + spec, refresh dùng `skipAuth` (§V.5); `Session.spec.ts` pass; `Runtime.spec.ts` pass: request có token + `X-Store-Id` + `Accept-Language`, `authFailure` điều hướng về `auth.login` (§V.1); `queryClient.clear()` chỉ xuất hiện trong `Session.ts`.

---

## Step 3a+ — Lỗi, toast, dialog, alias

**Làm gì**

- ESLint `perfectionist` nhóm import theo danh sách alias §N (alias đã cấu hình ở Step 1).
- `shared/lib/api/errors/` + hàm `toApiError` trong `HttpClient.ts` theo §O; thêm vào `HttpClient.spec.ts` đủ các ca ở bảng §O.3 (test qua interface).
- `ErrorPolicy.ts` + `ErrorPolicy.spec.ts` (mỗi dòng bảng §O.4 một ca), `shared/lib/query/QueryClient.ts`, `ErrorHandling.ts` theo §O.4; `UseNotify.ts`, `UseConfirm.ts`, `ConfirmDialog.vue`, `ErrorState.vue`, `EmptyState.vue` theo §P.

**Kiểm tra:** mutation lỗi 500 → toast global; mutation có `meta.errorHandling: 'local'` → không toast; query lỗi → `ErrorState` có Retry; mất mạng → `ApiError` mã `NETWORK_ERROR`; `useConfirm()` trả `true`/`false` đúng nút bấm; `ErrorPolicy.spec.ts` có đủ mỗi dòng bảng §O.4; không còn chỗ nào tự kiểm `status === 5xx` hay tự tra `errors.*` (§V.4).

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
