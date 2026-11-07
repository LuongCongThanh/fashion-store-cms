# Spec 02 — Lint, format, hooks

Status: ready-for-agent
Blocked by: 01
Nguồn: Step 2 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi *làm gì và thế nào là xong*. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Mọi code và commit đều bị ESLint, Prettier, Husky, commitlint kiểm tự động; ranh giới import bị chặn.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 2; mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

1. ESLint flat config theo §E (bảng `BOUNDARIES` + `toFlatConfig`) và `eslint.config.spec.ts` (D41).
2. Prettier + `.prettierignore` (bỏ `Api.generated.ts`, `dist/`, `coverage/`).
3. `npx husky init`; tạo 3 hook theo §D.
4. `lint-staged.config.ts`, `commitlint.config.ts` (extends `config-conventional`, `scope-enum` theo §C.2, `header-max-length: 72`).
5. `.vscode/settings.json` + `extensions.json`.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

(các ca import dưới đây nằm trong `eslint.config.spec.ts`, chạy bằng `npm test` — không kiểm tay)

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

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 01

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
