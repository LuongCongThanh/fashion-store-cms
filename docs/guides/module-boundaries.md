# Ranh giới module và ESLint

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Ranh giới feature

> Source đã chuyển theo cấu trúc mới dùng quy tắc của ADR 0001 (bảng thay thế), không dùng mục này.

- **Whitelist**: code ngoài feature chỉ được import `@features/<x>/Use*` và `@features/<x>/types/*`; mọi đường dẫn khác vào `@features/**` bị chặn (bao gồm `api/`, `stores/`, `schemas/`, `components/`, `views/` và thư mục thêm sau).
- Trong cùng một feature: import nội bộ bằng alias `@features/<chính-nó>/...` (được import mọi thư mục của chính nó); chỉ dùng `./` cho file cùng thư mục. Cấm mọi `../` trong toàn bộ `src/` (kể cả `import()` động và `vi.mock()`).
- `<Feature>.routes.ts` lazy-import `./views/...` của chính feature; `app/router/Routes.ts` chỉ ghép các route module. Code ngoài feature không import view riêng của feature đó.
- `types/` chỉ chứa type/const thuần dữ liệu. Map hành vi (VD `OrderStatus → color`) đặt trong `components/` của feature ([§L.4](ui-components.md)), không đặt trong `types/` vì `types/` là interface công khai.
- Không dùng `index.ts` barrel.

---

## ESLint rules

Flat config `eslint.config.ts`, dựa trên `typescript-eslint` (`strictTypeChecked`, lint có kiểm tra kiểu qua `projectService`), `eslint-plugin-vue` (`flat/recommended`), `eslint-config-prettier` (tắt rule format). `src/env.d.ts` khai báo `declare module '*.vue'` để typescript-eslint đọc được import SFC; vue-tsc vẫn resolve file `.vue` thật.

| Rule                                                                            | Mức                                                  | Lý do                                                                                                                                         |
| ------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `perfectionist/sort-imports`, `sort-named-imports`                              | error                                                | Thứ tự import ổn định, auto-fix                                                                                                               |
| `unused-imports/no-unused-imports`                                              | error                                                | Xoá import thừa khi fix                                                                                                                       |
| `unused-imports/no-unused-vars`                                                 | warn (bỏ qua `_` prefix)                             |                                                                                                                                               |
| `@typescript-eslint/no-explicit-any`                                            | error                                                | TypeScript strict thực sự                                                                                                                     |
| `@typescript-eslint/consistent-type-imports`                                    | error                                                | `import type`, tree-shake tốt                                                                                                                 |
| `@typescript-eslint/no-non-null-assertion`                                      | error                                                | Đã bật `noUncheckedIndexedAccess`; dùng `!` là né kiểm tra                                                                                    |
| `@typescript-eslint/no-floating-promises`, `no-misused-promises`, `no-unsafe-*` | error (từ `strictTypeChecked`)                       | Bắt quên `await` và `any` lan vào code. Spec và `src/test/` tắt `no-unsafe-*`, `require-await`                                                |
| `@typescript-eslint/switch-exhaustiveness-check`                                | error                                                | `switch` trên union phải đủ case                                                                                                              |
| `@typescript-eslint/restrict-template-expressions`                              | error, cho phép `number`                             |                                                                                                                                               |
| `no-console`                                                                    | error, cho phép `warn`/`error`                       |                                                                                                                                               |
| `no-restricted-imports`                                                         | error                                                | Ranh giới feature ([§B.3](module-boundaries.md), whitelist); cấm mọi `../` trong `src/`, dùng alias; code production cấm `@test/*` (`noTest`) |
| `no-restricted-syntax`                                                          | error                                                | Cấm `../` trong `import()` động và `vi.mock()`/`vi.importActual()`                                                                            |
| `vue/multi-word-component-names`                                                | error                                                | Component ≥ 2 từ                                                                                                                              |
| `vue/component-name-in-template-casing`                                         | error, `PascalCase`                                  | `<ProductTable />`                                                                                                                            |
| `vue/block-order`                                                               | error, `script` → `template` → `style`               |                                                                                                                                               |
| `vue/define-macros-order`                                                       | error, `defineProps` → `defineEmits` → `defineModel` |                                                                                                                                               |
| `vue/component-api-style`                                                       | error, `script-setup`                                | Một kiểu viết duy nhất                                                                                                                        |
| `vue/define-props-declaration`                                                  | error, `type-based`                                  |                                                                                                                                               |
| `vue/no-v-html`                                                                 | error                                                | Chỉ cho phép qua component sanitize DOMPurify                                                                                                 |
| `vue/require-explicit-emits`                                                    | error                                                |                                                                                                                                               |
| `vue/no-unused-refs`, `vue/no-unused-properties`                                | error                                                | Xoá ref/prop không dùng                                                                                                                       |
| `vue/require-typed-ref`, `vue/prefer-use-template-ref`                          | error                                                | `ref<T>()` có kiểu; template ref dùng `useTemplateRef`                                                                                        |
| `vue/no-ref-object-reactivity-loss`, `vue/no-useless-v-bind`                    | error                                                |                                                                                                                                               |
| `vue/padding-line-between-blocks`                                               | error                                                | Một dòng trống giữa `<script>`, `<template>`, `<style>`                                                                                       |
| `vue/no-bare-strings-in-template`                                               | warn (allowlist: dấu câu, `SKU`, tên ngôn ngữ)       | Text phải qua i18n ([§H](localization.md)).                                                                                                   |
| `check-file/filename-naming-convention`                                         | error                                                | `src/**/*.{ts,vue}` = PascalCase (bỏ qua phần hậu tố `.store`, `.api`…; ngoại lệ [§B.1](naming.md))                                           |
| `check-file/folder-naming-convention`                                           | error                                                | `src/**/`, `e2e/**/`, `scripts/**/` = `^([a-z0-9]+                                                                                            | [A-Z][a-zA-Z0-9]*)$` (một từ thường hoặc PascalCase) |
| `check-file/filename-naming-convention` (ngoài src)                             | error                                                | `e2e/**`, `scripts/**`, `src/assets/**`, `public/**` = PascalCase (trừ `favicon.svg`, `robots.txt`)                                           |
| `vue/attribute-hyphenation`, `vue/v-on-event-hyphenation`                       | error, `never`                                       | Không kebab-case trong template                                                                                                               |

Ranh giới feature là whitelist; các dòng của từng feature được sinh tự động từ thư mục `src/features/` (không cần thêm block khi có feature mới). `featureBoundary` viết bằng `regex` (lookahead), **không** dùng `group` cú pháp gitignore: với `group`, pattern `@features/**` loại luôn thư mục cha nên phần tử `!@features/*/Use*` không mở lại được file bên trong. Bảng `BOUNDARIES` và các pattern:

> Nguồn: [`eslint.config.ts`](../../eslint.config.ts) — tài liệu không chép lại code, đọc file.

Ghi chú: trong flat config, block sau **thay** (không gộp) giá trị `no-restricted-imports` của block trước cho cùng file, nên mỗi block liệt kê đủ pattern của nó. Các pattern khác dùng `group` (cú pháp gitignore). Mỗi feature `x` có rule riêng: alias `@features/x/**` được phép trong chính `x`, feature khác chỉ qua `Use*`/`types/`. `components/` không import `@features/x/api|stores|composables`, `vue-router`, và không gọi hook `use*` lấy từ `Use*.ts` (vẫn lấy được component). `import()` động và `vi.*('../...')` bị chặn bằng `no-restricted-syntax`. Mọi ca ranh giới có test tự động trong `eslint.config.spec.ts` (D41) — sửa bảng thì thêm ca vào đó. `noParentImport` và `noTest` được `toFlatConfig` tự thêm vào mọi dòng; với mỗi dòng nó sinh thêm một block cho `**/*.spec.ts` và `src/test/**` không có `noTest`, nên test vẫn import được `@test/*`.

`eslint-disable` chỉ dùng cho báo nhầm từ thư viện hoặc API deprecated chưa thay được: luôn dùng dạng `-next-line` (hoặc cặp `disable`/`enable` bao một khối nhỏ), ghi rõ tên rule, và đặt comment giải thích ngay dòng trên (hoặc sau `--`).

Lint có kiểm tra kiểu phải dựng cả chương trình TypeScript nên `npm run lint` mất khoảng 20s. `vite-plugin-checker` giữ chương trình này trong bộ nhớ: sau khi sửa `env.d.ts`, `tsconfig*.json` hoặc `eslint.config.ts` phải khởi động lại dev server, nếu không checker vẫn báo lỗi cũ.

> Nguồn: [`eslint.config.spec.ts`](../../eslint.config.spec.ts) — tài liệu không chép lại code, đọc file.

Prettier (`.prettierrc.json`): `semi: false`, `singleQuote: true`, `printWidth: 120`, `trailingComma: "all"`, plugin `prettier-plugin-tailwindcss`. Phạm vi: chỉ `src/**/*.{ts,vue}` (code + test), mọi file khác bị `.prettierignore` bỏ qua. Line ending LF được ép bằng `.gitattributes`.

---

## Interface công khai của các module

Bảng gồm shared module (`shared/`) và interface công khai của feature / `app/` mà nơi khác gọi tới. Chỉ các dòng `shared/` là shared module theo [GLOSSARY.md](../../GLOSSARY.md).

| Module                                               | Interface                                                                                                                                   | Giấu bên trong                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `shared/lib/api/client/HttpClient.ts`                | `createHttpClient(deps): HttpClient` (get/post/put/patch/delete; giới hạn caller typing xem ADR 0003), `HTTP_CLIENT_KEY`, `useHttpClient()` | axios, gắn header (token, locale), gom refresh, timeout, chuẩn hoá lỗi        |
| `shared/lib/session/Session.ts`                      | `createSession()`, `useSession()`                                                                                                           | token, refresh (1 lần đồng thời), xoá cache khi logout, sự kiện `authFailure` |
| `features/auth/UseAuth.ts`                           | `useAuth()` → `{ user, isAuthenticated, can, ensureUser, login, logout }`                                                                   | user, login/logout qua Session                                                |
| `shared/lib/api/errors/ApiError.ts` + `ErrorCode.ts` | `ApiError`, `isApiError`, `ErrorCode`, `codeFromStatus`                                                                                     | — (kiểu dữ liệu)                                                              |
| `shared/composables/UsePwa.ts`                       | `usePwa()` → `{ needRefresh, reload }`                                                                                                      | Đăng ký SW, kiểm tra định kỳ                                                  |
| `shared/lib/form/ApplyApiErrorToForm.ts`             | `applyApiErrorToForm(error, form): boolean`                                                                                                 | Map `fields`, phân biệt 400/422                                               |
| `shared/composables/UseNotify.ts`                    | `useNotify()` → `{ success, error, prompt }`; `createNotifier(deps)` dùng ngoài setup                                                       | Hiển thị toast; key lấy từ `ErrorPolicy.messageKeyOf`                         |
| `shared/lib/api/errors/ErrorPolicy.ts`               | `isRetryable`, `messageKeyOf`, `isSilent`, `routeMutationError`                                                                             | Toàn bộ quy tắc [§O.4](api-errors.md)                                         |
| `shared/components/confirm/UseConfirm.ts`            | `useConfirm()` → `(opts) => Promise<boolean>`                                                                                               | `useOverlay`, `ConfirmDialog.vue`                                             |
| `app/providers/ErrorHandling.ts`                     | `installErrorHandling(app, deps)`                                                                                                           | errorHandler, unhandledrejection, chunk reload                                |
| `shared/lib/query/QueryClient.ts`                    | `createAppQueryClient({ onMutationError, retry })`                                                                                          | Nối ErrorPolicy vào Vue Query (retry, MutationCache)                          |
| `shared/lib/i18n/I18n.ts`                            | `createAppI18n()`, `useLocale()`, `useT()`                                                                                                  | persist, `<html lang>`, locale Nuxt UI — do instance sở hữu                   |
| `shared/composables/UseTheme.ts`                     | `useTheme()` → `{ mode }` (ref ghi được)                                                                                                    | storage key, đồng bộ script chống nháy                                        |

---

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../README.md).
