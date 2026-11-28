# Toolchain và dependency

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Tooling

| Tool                | Vai trò                   | Package                                                                                                                                                                 |
| ------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EditorConfig        | Indent 2 space, LF, UTF-8 | —                                                                                                                                                                       |
| nvm                 | Ghim Node 22              | `.nvmrc` + `"engines": { "node": ">=22" }`                                                                                                                              |
| ESLint              | Lint                      | `eslint`, `typescript-eslint`, `eslint-plugin-vue`, `eslint-plugin-perfectionist`, `eslint-plugin-unused-imports`, `eslint-plugin-check-file`, `eslint-config-prettier` |
| Prettier            | Format                    | `prettier`, `prettier-plugin-tailwindcss`                                                                                                                               |
| Husky               | Git hooks                 | `husky`                                                                                                                                                                 |
| lint-staged         | Chạy trên file staged     | `lint-staged`                                                                                                                                                           |
| commitlint          | Kiểm tra commit           | `@commitlint/cli`, `@commitlint/config-conventional`                                                                                                                    |
| vue-tsc             | Typecheck                 | `vue-tsc`                                                                                                                                                               |
| Vitest / Playwright | Test                      | `vitest`, `@vue/test-utils`, `jsdom`, `@vitest/coverage-v8`, `axios-mock-adapter`, `@playwright/test` ([§I](../testing/runtime.md))                                                |
| openapi-typescript  | Sinh type API             | `npm run gen:api` (`scripts/GenApi.ts`)                                                                                                                                 |

npm scripts:

> Nguồn: [`package.json`](../../package.json) — tài liệu không chép lại code, đọc file.

VS Code: `.vscode/settings.json` (format on save bằng Prettier, `source.fixAll.eslint: explicit`); `.vscode/extensions.json` gợi ý Vue - Official, ESLint, Prettier, Tailwind CSS IntelliSense, EditorConfig.

---

## Danh sách package

Nguyên tắc: chỉ cài khi có step/feature dùng đến; khoá version bằng `package-lock.json`; kiểm tra `npm audit` và license (cấm GPL) trước khi thêm package mới; mỗi package mới cần lý do trong PR.

## Dependencies hiện hành

[`package.json`](../../package.json) và `package-lock.json` sở hữu dependency/version thực tế; không chép danh sách package dự kiến từ scaffold. Cấu hình nằm ở `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.ts` và scripts trong package.json.

## Dependencies theo nhu cầu

Chỉ thêm dependency khi có consumer thật và lý do cụ thể. Form hiện dùng vee-validate + Zod 4 `safeParse`, không cài adapter Zod 3. Format qua `shared/lib/format` và `Intl`; không cần dayjs. DOMPurify và `@internationalized/date` không được coi là dependency trực tiếp đã cài chỉ vì có trong kế hoạch scaffold. Nếu cần render HTML hoặc import DatePicker trực tiếp, đánh giá boundary và thêm dependency trong thay đổi có scope tương ứng.

Lý do chọn stack và đánh đổi: [stack](../architecture/README.md) và [form](../architecture/README.md). Các Phase cài đặt ban đầu chỉ là lịch sử trong [scaffold plan](../archive/cms-initial-build/README.md).

## DevDependencies

Đọc `devDependencies` và `scripts` trong [package.json](../../package.json); CI dùng [workflow](../../.github/workflows/ci.yml). Không giữ bảng bản sao dễ lệch khi nâng toolchain.

## Lib bổ trợ — cân nhắc, chưa cài

| Package                           | Dùng khi                                   | Ghi chú                                             |
| --------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| `@intlify/eslint-plugin-vue-i18n` | Muốn ESLint bắt text hard-code / key thiếu | Bổ sung cho [§H](localization.md)                   |
| `@intlify/unplugin-vue-i18n`      | Locale tách nhiều file, muốn precompile    | Giảm bundle, bỏ runtime compiler                    |
| `pinia-plugin-persistedstate`     | Nhiều store cần persist                    | Hiện chỉ locale → dùng `useLocalStorage` của VueUse |
| `@sentry/vue`                     | Có môi trường production                   | Theo dõi lỗi runtime                                |
| `nprogress`                       | Muốn thanh tiến trình khi đổi route        | Có thể dùng `ULoadingIndicator`/tự làm              |

## Không dùng

| Package                                | Lý do                                            |
| -------------------------------------- | ------------------------------------------------ |
| `msw`                                  | Đã bỏ (D18)                                      |
| `lodash`                               | Dùng JS thuần + VueUse; nếu cần thì `es-toolkit` |
| `moment`                               | Dùng `Intl` và helper format của repo            |
| `sass`                                 | CSS-first Tailwind ([§J](ui-components.md))      |
| `vuex`                                 | Đã chọn Pinia                                    |
| `unplugin-auto-import` cho code nội bộ | Quy định import tường minh trong guide boundary  |

---

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../README.md).
