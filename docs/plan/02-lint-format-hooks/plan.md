# 02 — Lint, format, hooks

Status: ready-for-agent
Blocked by: 01
Nguồn: Step 2 trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 2 — Lint, format, hooks

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

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

### B. Quy tắc đặt tên

#### B.1. File và thư mục

| Loại | Quy tắc | Ví dụ |
| --- | --- | --- |
| Thư mục | Một từ: viết thường · nhiều từ: PascalCase · không kebab-case; feature số nhiều (trừ danh từ không đếm được: `auth`, `dashboard`, `inventory`, `media`) | `features/products/`, `features/AuditLogs/`, `test/factories/` |
| Thư mục chức năng trong feature | cố định, số nhiều: `api/`, `components/`, `composables/`, `schemas/`, `stores/`, `types/`, `views/` (riêng `api/` giữ nguyên) | |
| Component | PascalCase, ≥ 2 từ | `ProductTable.vue`, `ProductStatusBadge.vue` |
| View (gắn route) | PascalCase + hậu tố `View` | `ProductListView.vue` |
| Layout | PascalCase + hậu tố `Layout` | `DashboardLayout.vue` |
| Composable | `Use` + PascalCase | `UseAuth.ts`, `UseListState.ts` |
| Store | PascalCase + `.store.ts` | `Auth.store.ts` |
| API | PascalCase + `.api.ts` | `Products.api.ts` |
| Schema (Zod) | PascalCase + `.schema.ts` | `Product.schema.ts` |
| Types | PascalCase + `.types.ts` | `Product.types.ts` |
| Config | PascalCase + `.config.ts` | `Env.config.ts` |
| Module thường | PascalCase | `HttpClient.ts`, `ApiError.ts` |
| Test | tên file nguồn + `.spec.ts` | `Guards.spec.ts`, `ProductTable.spec.ts` |
| Route của feature | `<Feature>` + `.routes.ts` | `Products.routes.ts` |
| Mapper | `<Entity>` + `.mapper.ts`, trong `api/`, chỉ khi DTO lệch Model (§T.3) | `Product.mapper.ts` |
| Test factory | `<Entity>` + `.factory.ts` | `User.factory.ts` |
| Khai báo kiểu | PascalCase + `.d.ts` | `Router.d.ts`, `VueQuery.d.ts` |
| File sinh tự động | PascalCase + `.generated.ts` | `Api.generated.ts` |
| Asset tĩnh (`assets/`, `public/`) | PascalCase (trừ `favicon.svg`, `robots.txt` do trình duyệt/bot yêu cầu) | `Logo.svg`, `EmptyBox.svg` |
| Ngoài `src/` (`e2e/`, `scripts/`) | PascalCase | `Smoke.spec.ts`, `GenApi.ts` |
| File do tool quy định | Giữ nguyên tên tool yêu cầu | `package.json`, `vite.config.ts`, `.github/ISSUE_TEMPLATE/bug_report.md`, `pwa-assets.config.ts` |

Hậu tố hợp lệ (cấu hình cho `check-file`): `.api`, `.mapper`, `.routes`, `.store`, `.schema`, `.types`, `.config`, `.factory`, `.generated`, `.spec`, `.d`.

Ngoại lệ (giữ tên do tool quy định): `main.ts`, `main.css`, `env.d.ts`, `locales/*.json`, mọi file config ở thư mục gốc (`vite.config.ts`, `eslint.config.ts`…), `scripts/`.

Lưu ý: tên file `UseAuth.ts` khác hoa/thường với hàm `useAuth` là có chủ đích (D14). Khi đổi tên chỉ khác hoa/thường (VD file Vite sinh sẵn) phải dùng `git mv` — macOS/Windows không phân biệt hoa/thường nên git không nhận đổi tên.

#### B.2. Trong code

| Loại | Quy tắc | Ví dụ |
| --- | --- | --- |
| Biến, hàm | camelCase | `fetchProducts`, `isLoading` |
| Boolean | tiền tố `is/has/can/should` | `canEdit` |
| Hằng số module | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |
| Type / interface | PascalCase, không tiền tố `I` | `Product`, `ProductListQuery` |
| Enum-like | `as const` object + union type, không dùng `enum` | `OrderStatus` |
| Composable export | `useXxx` | `export function useAuth()` |
| Pinia store | `useXxxStore`, id = tên feature | `defineStore('auth', …)` |
| Zod schema | `xxxSchema`, type suy ra `XxxInput` | `productSchema` |
| Component trong template | PascalCase | `<ProductTable />` |
| Props / emits | camelCase cả script và template (`vue/attribute-hyphenation: never`, `vue/v-on-event-hyphenation: never`) | `:modelValue`, `@update:modelValue` |
| Route name | `feature.action` | `products.list`, `products.edit` |
| Route path | chữ thường, nhiều từ nối `-` (URL, không phải tên file — giữ chuẩn web), số nhiều | `/admin/products/:id/edit`, `/admin/audit-logs` |
| i18n key | `feature.scope.key`, camelCase từng đoạn | `products.form.titleCreate` |
| Query key | mảng bắt đầu bằng tên feature | `['products', 'list', params]` |
| Env | `VITE_` + UPPER_SNAKE | `VITE_API_BASE_URL` |

#### B.3. Ranh giới feature

- **Whitelist**: code ngoài feature chỉ được import `@features/<x>/Use*` và `@features/<x>/types/*`; mọi đường dẫn khác vào `@features/**` bị chặn (bao gồm `api/`, `stores/`, `schemas/`, `components/`, `views/` và thư mục thêm sau).
- Trong cùng một feature: import nội bộ bằng đường dẫn tương đối `./` / `../` (không vượt ra ngoài thư mục feature); không dùng `@features/<chính-nó>/...`.
- `views/` chỉ được import từ `app/router/Routes.ts` (lazy `() => import(...)`).
- `types/` chỉ chứa type/const thuần dữ liệu. Map hành vi (VD `OrderStatus → color`) đặt trong `components/` của feature (§L.4), không đặt trong `types/` vì `types/` là interface công khai.
- Không dùng `index.ts` barrel.

#### C.2. Commit message — Conventional Commits

```text
<type>(<scope>): <subject>

[body — vì sao thay đổi]

[footer — Refs: CMS-123 | BREAKING CHANGE: ...]
```

- `type`: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`.
- `scope`: tên feature hoặc khu vực — `auth`, `products`, `orders`, `router`, `api`, `ui`, `deps`, `config`… (danh sách cấu hình trong `commitlint.config.ts`, sai scope thì báo lỗi).
- `subject`: tiếng Anh, thể mệnh lệnh, chữ thường đầu câu, không dấu chấm cuối, header ≤ 72 ký tự.
- Breaking change: `feat(api)!: ...` + footer `BREAKING CHANGE:`.
- Mỗi commit một ý; không commit code lỗi build.

Ví dụ: `feat(products): add server-side pagination to product table`.

### D. Git hooks (Husky)

| Hook | Lệnh | Mục đích |
| --- | --- | --- |
| `pre-commit` | `npx lint-staged` | ESLint `--fix` + Prettier trên file staged |
| `commit-msg` | `npx --no -- commitlint --edit "$1"` | Kiểm tra format commit |
| `pre-push` | `npm run typecheck` | Chặn push code sai type |

`lint-staged.config.ts`:

```ts
export default {
  '*.{ts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css,yml}': ['prettier --write'],
}
```

`--no-verify` chỉ dùng khi khẩn cấp và phải ghi lý do trong PR. Test để CI chạy, không chạy trong hook.

### E. ESLint rules

Flat config `eslint.config.ts`, dựa trên `typescript-eslint` (strict), `eslint-plugin-vue` (`flat/recommended`), `eslint-config-prettier` (tắt rule format).

| Rule | Mức | Lý do |
| --- | --- | --- |
| `perfectionist/sort-imports`, `sort-named-imports` | error | Thứ tự import ổn định, auto-fix |
| `unused-imports/no-unused-imports` | error | Xoá import thừa khi fix |
| `unused-imports/no-unused-vars` | warn (bỏ qua `_` prefix) | |
| `@typescript-eslint/no-explicit-any` | error | TypeScript strict thực sự |
| `@typescript-eslint/consistent-type-imports` | error | `import type`, tree-shake tốt |
| `@typescript-eslint/no-non-null-assertion` | warn | |
| `no-console` | error, cho phép `warn`/`error` | |
| `no-restricted-imports` | error | Ranh giới feature (§B.3, whitelist), ngoài `features/` cấm mọi `../`; trong feature cấm `../../` |
| `vue/multi-word-component-names` | error | Component ≥ 2 từ |
| `vue/component-name-in-template-casing` | error, `PascalCase` | `<ProductTable />` |
| `vue/block-order` | error, `script` → `template` → `style` | |
| `vue/define-macros-order` | error, `defineProps` → `defineEmits` → `defineModel` | |
| `vue/component-api-style` | error, `script-setup` | Một kiểu viết duy nhất |
| `vue/define-props-declaration` | error, `type-based` | |
| `vue/no-v-html` | error | Chỉ cho phép qua component sanitize DOMPurify |
| `vue/require-explicit-emits` | error | |
| `check-file/filename-naming-convention` | error | `src/**/*.{ts,vue}` = PascalCase (bỏ qua phần hậu tố `.store`, `.api`…; ngoại lệ §B.1) |
| `check-file/folder-naming-convention` | error | `src/**/`, `e2e/**/`, `scripts/**/` = `^([a-z]+|[A-Z][a-zA-Z0-9]*)$` (một từ thường hoặc PascalCase) |
| `check-file/filename-naming-convention` (ngoài src) | error | `e2e/**`, `scripts/**`, `src/assets/**`, `public/**` = PascalCase (trừ `favicon.svg`, `robots.txt`) |
| `vue/attribute-hyphenation`, `vue/v-on-event-hyphenation` | error, `never` | Không kebab-case trong template |

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
const noApp = { group: ['@app/*'], message: 'Chỉ main.ts và src/test/ được import @app/* (§A, D37).' }
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
  { name: 'mặc định',            files: ['src/**/*.{ts,vue}'],                    forbid: [featureBoundary, noParentImport, noDto] },
  { name: 'layouts',             files: ['src/layouts/**/*.{ts,vue}'],            forbid: [featureBoundary, noParentImport, noApp, noDto] },
  { name: 'features',            files: ['src/features/**/*.{ts,vue}'],           forbid: [featureBoundary, noEscapeFeature, noApp, noLayouts, noDto] },
  { name: 'feature/components',  files: ['src/features/*/components/**/*.{ts,vue}'], forbid: [featureBoundary, noEscapeFeature, noApp, noLayouts, noDto, presentational] },
  { name: 'feature/api (DTO ok)', files: ['src/features/*/api/**/*.ts'],          forbid: [featureBoundary, noEscapeFeature, noApp, noLayouts] },
  { name: 'shared',              files: ['src/shared/**/*.{ts,vue}'],             forbid: [noUpper, noParentImport, noDto] },
  { name: 'shared/components',   files: ['src/shared/components/**/*.{ts,vue}'],  forbid: [noUpper, noParentImport, noDto, noHttpInSharedUi] },
  { name: 'shared/lib',          files: ['src/shared/lib/**/*.ts'],               forbid: [noUpper, noParentImport, noDto, libIsBottom] },
  { name: 'shared/lib/api (DTO ok)', files: ['src/shared/lib/api/**/*.ts'],       forbid: [noUpper, noParentImport, libIsBottom] },
  { name: 'Routes.ts',           files: ['src/app/router/Routes.ts'],             forbid: [featureBoundaryForRoutes, noParentImport] },
]

/** Chuyển bảng thành các block flat config. Không chứa logic nào khác. */
const toFlatConfig = (rows) =>
  rows.map(({ files, forbid }) => ({ files, rules: { 'no-restricted-imports': ['error', { patterns: forbid }] } }))

export default [
  // ...typescript-eslint, vue, prettier, check-file, perfectionist (bảng rule ở trên)
  ...toFlatConfig(BOUNDARIES),
]
```

Ghi chú: trong flat config, block sau **thay** (không gộp) giá trị `no-restricted-imports` của block trước cho cùng file, nên mỗi block liệt kê đủ pattern của nó. `group` dùng cú pháp gitignore, phần tử `!` là ngoại lệ. Pattern `../../*` trong feature cho phép `features/x/components/A.vue` → `../api/X.api` nhưng chặn `../../products/...` (thoát khỏi `features/x/`). Hệ quả: trong feature chỉ lồng tối đa 1 cấp thư mục (`api/`, `components/`…), không tạo `components/sub/`. Các ca ở phần "Kiểm tra" của Step 2 được viết thành test tự động `eslint.config.spec.ts` (D41).

```ts
// eslint.config.spec.ts — kiểm tra BẢNG RANH GIỚI chạy đúng, thay cho kiểm tay ở Step 2.
// lintText() lint một đoạn code giả như thể nó nằm ở `filePath` → không cần tạo file thật.
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

const eslint = new ESLint()

/** Trả true nếu dòng import này bị no-restricted-imports chặn khi đặt trong file `from`. */
async function isBlocked(from: string, importPath: string) {
  const [result] = await eslint.lintText(`import '${importPath}'\n`, { filePath: from })
  return result.messages.some((m) => m.ruleId === 'no-restricted-imports')
}

// [file đặt code, đường import, có bị chặn không] — mỗi dòng là một ca ở Step 2
const CASES: [string, string, boolean][] = [
  ['src/layouts/AuthLayout.vue',                 '@features/auth/stores/Auth.store', true],
  ['src/layouts/AuthLayout.vue',                 '@features/auth/UseAuth',           false],
  ['src/features/auth/views/LoginView.vue',      '../../products/api/X',             true],
  ['src/features/auth/views/LoginView.vue',      '../stores/Auth.store',             false],
  ['src/app/router/Routes.ts',                   '@features/auth/views/LoginView.vue', false],
  ['src/test/Render.ts',                         '@app/Runtime',                     false],
  ['src/features/auth/api/Auth.api.ts',          '@app/Runtime',                     true],
  ['src/shared/composables/UseNotify.ts',        '@features/auth/UseAuth',           true],
  ['src/features/auth/components/X.vue',         'vue-router',                       true],
  ['src/features/auth/views/LoginView.vue',      '@shared/types/Api.generated',      true],
  ['src/features/auth/api/Auth.api.ts',          '@shared/types/Api.generated',      false],
  ['src/shared/lib/query/QueryClient.ts',        '@shared/composables/UseNotify',    true],
  ['src/shared/lib/api/client/HttpClient.ts',    '@shared/components/confirm/UseConfirm', true],
  ['src/shared/lib/query/QueryClient.ts',        '@shared/lib/api/errors/ErrorPolicy', false],
  ['src/shared/components/feedback/ErrorState.vue', '@shared/lib/api/client/HttpClient', true],
  ['src/shared/components/feedback/ErrorState.vue', '@shared/composables/UseNotify', false],
  // ... đủ các ca liệt kê ở Step 2
]

describe('ranh giới import (BOUNDARIES)', () => {
  it.each(CASES)('%s import %s → chặn=%s', async (from, path, blocked) => {
    expect(await isBlocked(from, path)).toBe(blocked)
  })
})
```

Prettier (`.prettierrc.json`): `semi: false`, `singleQuote: true`, `printWidth: 100`, `trailingComma: "all"`, plugin `prettier-plugin-tailwindcss`.
