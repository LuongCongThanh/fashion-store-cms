# E. ESLint rules

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

Flat config `eslint.config.ts`, dựa trên `typescript-eslint` (strict), `eslint-plugin-vue` (`flat/recommended`), `eslint-config-prettier` (tắt rule format).

| Rule                                                      | Mức                                                  | Lý do                                                                                               |
| --------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `perfectionist/sort-imports`, `sort-named-imports`        | error                                                | Thứ tự import ổn định, auto-fix                                                                     |
| `unused-imports/no-unused-imports`                        | error                                                | Xoá import thừa khi fix                                                                             |
| `unused-imports/no-unused-vars`                           | warn (bỏ qua `_` prefix)                             |                                                                                                     |
| `@typescript-eslint/no-explicit-any`                      | error                                                | TypeScript strict thực sự                                                                           |
| `@typescript-eslint/consistent-type-imports`              | error                                                | `import type`, tree-shake tốt                                                                       |
| `@typescript-eslint/no-non-null-assertion`                | warn                                                 |                                                                                                     |
| `no-console`                                              | error, cho phép `warn`/`error`                       |                                                                                                     |
| `no-restricted-imports`                                   | error                                                | Ranh giới feature (§B.3, whitelist), ngoài `features/` cấm mọi `../`; trong feature cấm `../../`    |
| `vue/multi-word-component-names`                          | error                                                | Component ≥ 2 từ                                                                                    |
| `vue/component-name-in-template-casing`                   | error, `PascalCase`                                  | `<ProductTable />`                                                                                  |
| `vue/block-order`                                         | error, `script` → `template` → `style`               |                                                                                                     |
| `vue/define-macros-order`                                 | error, `defineProps` → `defineEmits` → `defineModel` |                                                                                                     |
| `vue/component-api-style`                                 | error, `script-setup`                                | Một kiểu viết duy nhất                                                                              |
| `vue/define-props-declaration`                            | error, `type-based`                                  |                                                                                                     |
| `vue/no-v-html`                                           | error                                                | Chỉ cho phép qua component sanitize DOMPurify                                                       |
| `vue/require-explicit-emits`                              | error                                                |                                                                                                     |
| `check-file/filename-naming-convention`                   | error                                                | `src/**/*.{ts,vue}` = PascalCase (bỏ qua phần hậu tố `.store`, `.api`…; ngoại lệ §B.1)              |
| `check-file/folder-naming-convention`                     | error                                                | `src/**/`, `e2e/**/`, `scripts/**/` = `^([a-z]+                                                     | [A-Z][a-zA-Z0-9]*)$` (một từ thường hoặc PascalCase) |
| `check-file/filename-naming-convention` (ngoài src)       | error                                                | `e2e/**`, `scripts/**`, `src/assets/**`, `public/**` = PascalCase (trừ `favicon.svg`, `robots.txt`) |
| `vue/attribute-hyphenation`, `vue/v-on-event-hyphenation` | error, `never`                                       | Không kebab-case trong template                                                                     |

Mẫu ranh giới feature (whitelist — không cần thêm block khi có feature mới):

```ts
// eslint.config.ts
const featureBoundary = {
  group: ['@features/**', '!@features/*/Use*', '!@features/*/types/*'],
  message: 'Chỉ import Use*.ts hoặc types/ của feature khác (§B.3).',
}
// Ngoài features/: cấm MỌI import lên thư mục cha (../), chỉ cho ./ cùng thư mục.
const noParentImport = {
  group: ['../*', '../**'],
  message: 'Không import thư mục cha bằng ../ ; dùng alias (§N).',
}
// Trong feature: ../ được phép (components/ → ../api/), ../../ là thoát khỏi feature.
const noEscapeFeature = {
  group: ['../../*', '../../**'],
  message: 'Không import tương đối ra ngoài feature; dùng alias (§N).',
}
const noApp = {
  group: ['@app/*'],
  message: 'Chỉ main.ts và src/test/ được import @app/* (§A, D37).',
}
const noLayouts = { group: ['@layouts/*'], message: 'features/ không import layouts/.' }
const noUpper = {
  group: ['@app/*', '@layouts/*', '@features/*'],
  message: 'shared/ không được import app/, layouts/, features/.',
}
const noDto = {
  group: ['@shared/types/Api.generated'],
  message: 'DTO chỉ dùng trong features/*/api/ và shared/lib/api/ — dùng Model ở types/ (§T.3).',
}
const presentational = {
  group: ['../api/*', '../stores/*', '../composables/*', 'vue-router'],
  message: 'components/ là presentational: chỉ props/emits, không gọi API/store/router (§T.1).',
}
const libIsBottom = {
  group: ['@shared/components/*', '@shared/components/**', '@shared/composables/*'],
  message: 'shared/lib/ là tầng dưới: không import components/, composables/ (§A).',
}
const noHttpInSharedUi = {
  group: ['@shared/lib/api/client/*'],
  message: 'shared/components/ không gọi API (§A).',
}
const featureBoundaryForRoutes = {
  ...featureBoundary,
  group: [...featureBoundary.group, '!@features/*/views/*', '!@features/*/*.routes'],
}

/**
 * BẢNG RANH GIỚI — nguồn duy nhất cho no-restricted-imports (D41).
 * Mỗi dòng: thư mục nào (`files`) bị cấm import gì (`forbid`).
 * Thứ tự quan trọng: dòng sau áp cho cùng file sẽ THAY dòng trước (hành vi flat config),
 * nên dòng cụ thể đặt sau dòng chung và tự liệt kê đủ pattern của nó.
 */
export const BOUNDARIES = [
  {
    name: 'mặc định',
    files: ['src/**/*.{ts,vue}'],
    forbid: [featureBoundary, noParentImport, noDto],
  },
  {
    name: 'layouts',
    files: ['src/layouts/**/*.{ts,vue}'],
    forbid: [featureBoundary, noParentImport, noApp, noDto],
  },
  {
    name: 'features',
    files: ['src/features/**/*.{ts,vue}'],
    forbid: [featureBoundary, noEscapeFeature, noApp, noLayouts, noDto],
  },
  {
    name: 'feature/components',
    files: ['src/features/*/components/**/*.{ts,vue}'],
    forbid: [featureBoundary, noEscapeFeature, noApp, noLayouts, noDto, presentational],
  },
  {
    name: 'feature/api (DTO ok)',
    files: ['src/features/*/api/**/*.ts'],
    forbid: [featureBoundary, noEscapeFeature, noApp, noLayouts],
  },
  { name: 'shared', files: ['src/shared/**/*.{ts,vue}'], forbid: [noUpper, noParentImport, noDto] },
  {
    name: 'shared/components',
    files: ['src/shared/components/**/*.{ts,vue}'],
    forbid: [noUpper, noParentImport, noDto, noHttpInSharedUi],
  },
  {
    name: 'shared/lib',
    files: ['src/shared/lib/**/*.ts'],
    forbid: [noUpper, noParentImport, noDto, libIsBottom],
  },
  {
    name: 'shared/lib/api (DTO ok)',
    files: ['src/shared/lib/api/**/*.ts'],
    forbid: [noUpper, noParentImport, libIsBottom],
  },
  {
    name: 'Routes.ts',
    files: ['src/app/router/Routes.ts'],
    forbid: [featureBoundaryForRoutes, noParentImport],
  },
]

/** Chuyển bảng thành các block flat config. Không chứa logic nào khác. */
const toFlatConfig = (rows) =>
  rows.map(({ files, forbid }) => ({
    files,
    rules: { 'no-restricted-imports': ['error', { patterns: forbid }] },
  }))

export default [
```

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần trước](lint-02.md)
