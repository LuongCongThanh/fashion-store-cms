import { readdirSync } from 'node:fs'

import prettier from 'eslint-config-prettier'
import checkFile from 'eslint-plugin-check-file'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'
import vue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

import type { Linter } from 'eslint'

type Restriction = ({ group: string[]; message: string } | { message: string; regex: string }) & {
  importNamePattern?: string
}

// Danh sách feature đọc từ thư mục → mỗi feature có dòng ranh giới riêng (được import alias của chính nó).
const FEATURES = readdirSync(new URL('./src/features', import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

// Whitelist viết bằng regex: với `group` (cú pháp gitignore), `@features/**` loại luôn thư mục cha
// nên phần tử `!` không thể mở lại file bên trong.
const FEATURE_PUBLIC = 'Use[^/]*|types/[^/]+'
const featureBoundary: Restriction = {
  regex: `^@features/[^/]+/(?!(?:${FEATURE_PUBLIC})$).+`,
  message: 'Only import Use*.ts or types/ from another feature (§B.3).',
}
// Trong feature `f`: alias tới chính `f` được tự do, feature khác chỉ qua public API.
const featureBoundaryFor = (feature: string): Restriction => ({
  ...featureBoundary,
  regex: `^@features/(?!${feature}/)[^/]+/(?!(?:${FEATURE_PUBLIC})$).+`,
})
// Cấm MỌI import lên thư mục cha (../ hoặc ..) ở toàn bộ src/; chỉ cho ./ cùng thư mục.
// Một regex cho mọi chỗ chặn `../`: import tĩnh, import() động, vi.*().
// `/` viết là \u002F vì selector của no-restricted-syntax (esquery) không cho `/` trong regex.
const PARENT_PATH = String.raw`^\.\.(\u002F|$)`
const noParentImport: Restriction = {
  regex: PARENT_PATH,
  message: 'Relative parent imports (../) are not allowed; use an alias such as @features/... (§N).',
}
const noApp: Restriction = {
  group: ['@app/*', '@app/**'],
  message: 'Only main.ts and src/test/ may import @app/* (§A, D37).',
}
const noTest: Restriction = {
  group: ['@test/*', '@test/**'],
  message: 'Production code must not import @test/* (only *.spec.ts and src/test/).',
}
const noLayouts: Restriction = {
  group: ['@layouts/*', '@layouts/**'],
  message: 'features/ must not import layouts/.',
}
const noUpper: Restriction = {
  group: ['@app/*', '@app/**', '@layouts/*', '@layouts/**', '@features/*', '@features/**'],
  message: 'shared/ must not import app/, layouts/, features/.',
}
const noDto: Restriction = {
  group: ['@shared/types/Api.generated'],
  message: 'DTOs are only allowed in features/*/api/ and shared/lib/api/ — use Models from types/ (§T.3).',
}
// Chặn cả import thẳng thư mục (index) và file ở thư mục con của chính feature.
const presentationalFor = (feature: string): Restriction => ({
  group: ['api', 'stores', 'composables']
    .flatMap((dir) => [`@features/${feature}/${dir}`, `@features/${feature}/${dir}/**`])
    .concat('vue-router'),
  message: 'components/ are presentational: props/emits only, no API/store/router calls (§T.1).',
})
// Use*.ts là barrel public: export cả component lẫn hook. components/ được lấy component
// nhưng không được gọi hook `use*` (có thể chạm API/store/router).
const noFeatureComposable: Restriction = {
  regex: '^@features/[^/]+/Use[^/]*$',
  importNamePattern: '^use[A-Z]',
  message: 'components/ are presentational: must not call use* hooks from features (§T.1).',
}
const libIsBottom: Restriction = {
  group: ['@shared/components/*', '@shared/components/**', '@shared/composables/*'],
  message: 'shared/lib/ is the bottom layer: must not import components/ or composables/ (§A).',
}
const noHttpInSharedUi: Restriction = {
  group: ['@shared/lib/api/client/*'],
  message: 'shared/components/ must not call the API (§A).',
}
const featureBoundaryForRoutes: Restriction = {
  ...featureBoundary,
  regex: String.raw`^@features/[^/]+/(?!(?:${FEATURE_PUBLIC}|views/[^/]+|[^/]+\.routes)$).+`,
}

type Boundary = { files: string[]; forbid: Restriction[]; name: string }

/** Ba dòng ranh giới cho một feature: chung, components/ (presentational), api/ (DTO ok). */
const featureRows = (feature: string): Boundary[] => {
  const base = [featureBoundaryFor(feature), noApp, noLayouts]
  return [
    { name: `features/${feature}`, files: [`src/features/${feature}/**/*.{ts,vue}`], forbid: [...base, noDto] },
    {
      name: `features/${feature}/components`,
      files: [`src/features/${feature}/components/**/*.{ts,vue}`],
      forbid: [...base, noDto, presentationalFor(feature), noFeatureComposable],
    },
    {
      name: `features/${feature}/api (DTO ok)`,
      files: [`src/features/${feature}/api/**/*.ts`],
      forbid: base,
    },
  ]
}

/**
 * BẢNG RANH GIỚI — nguồn duy nhất cho no-restricted-imports (D41).
 * Mỗi dòng: thư mục nào (`files`) bị cấm import gì (`forbid`).
 * Dòng sau áp cho cùng file sẽ THAY dòng trước (hành vi flat config),
 * nên dòng cụ thể đặt sau dòng chung và tự liệt kê đủ pattern của nó.
 */
export const BOUNDARIES: Boundary[] = [
  {
    name: 'default',
    files: ['src/**/*.{ts,vue}'],
    forbid: [featureBoundary, noDto],
  },
  {
    name: 'layouts',
    files: ['src/layouts/**/*.{ts,vue}'],
    forbid: [featureBoundary, noApp, noDto],
  },
  ...FEATURES.flatMap(featureRows),
  { name: 'shared', files: ['src/shared/**/*.{ts,vue}'], forbid: [noUpper, noDto] },
  {
    name: 'shared/components',
    files: ['src/shared/components/**/*.{ts,vue}'],
    forbid: [noUpper, noDto, noHttpInSharedUi],
  },
  {
    name: 'shared/lib',
    files: ['src/shared/lib/**/*.ts'],
    forbid: [noUpper, noDto, libIsBottom],
  },
  {
    name: 'shared/lib/api (DTO ok)',
    files: ['src/shared/lib/api/**/*.ts'],
    forbid: [noUpper, libIsBottom],
  },
  {
    name: 'Routes.ts',
    files: ['src/app/router/Routes.ts'],
    forbid: [featureBoundaryForRoutes, noDto],
  },
]

const TEST_FILES = ['**/*.spec.ts', 'src/test/**']

/**
 * Chuyển bảng thành các block flat config. noParentImport và noTest áp cho MỌI dòng nên thêm ở đây,
 * không lặp trong bảng. Mỗi dòng sinh 2 block: code thường, và file test (giao `files` × TEST_FILES)
 * không có noTest — test được import @test/*.
 */
const toFlatConfig = (rows: typeof BOUNDARIES): Linter.Config[] =>
  rows.flatMap(({ files, forbid, name }) => [
    { files, name, patterns: [...forbid, noParentImport, noTest] },
    { files: files.flatMap((f) => TEST_FILES.map((t) => [f, t])), name: `${name} (test)`, patterns: [...forbid, noParentImport] },
  ]).map(({ files, name, patterns }) => ({
    name: `boundaries/${name}`,
    files,
    rules: { 'no-restricted-imports': ['error', { patterns }] },
  }))

const SUFFIX = '?(.api|.mapper|.routes|.store|.schema|.types|.config|.factory|.generated|.d)?(.spec)'

export default defineConfig(
  {
    ignores: [
      'dist/',
      'coverage/',
      'dev-dist/',
      'playwright-report/',
      'test-results/',
      'src/shared/types/Api.generated.ts',
    ],
  },
  ...tseslint.configs.strictTypeChecked,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser, extraFileExtensions: ['.vue'] } },
  },
  {
    plugins: { perfectionist, 'unused-imports': unusedImports },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          internalPattern: ['^@(app|assets|features|layouts|locales|shared|test)/'],
          // built-in → ngoài → alias nội bộ → tương đối; `import type` cuối mỗi nhóm (§N).
          groups: [
            'side-effect',
            'value-builtin',
            'type-builtin',
            'value-external',
            'type-external',
            'value-internal',
            'type-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            ['type-parent', 'type-sibling', 'type-index'],
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-named-imports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'vue/multi-word-component-names': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits', 'defineModel'] }],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/no-v-html': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/attribute-hyphenation': ['error', 'never'],
      'vue/v-on-event-hyphenation': ['error', 'never', { autofix: true }],
      'vue/no-unused-refs': 'error',
      'vue/no-unused-properties': 'error',
      'vue/require-typed-ref': 'error',
      'vue/no-ref-object-reactivity-loss': 'error',
      'vue/prefer-use-template-ref': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/padding-line-between-blocks': 'error',
      'vue/no-bare-strings-in-template': [
        'warn',
        {
          // Mặc định của rule + thuật ngữ/tên ngôn ngữ không dịch.
          allowlist: [
            ...'(),.&+-=*/#%!?:[]{}<>|'.split(''),
            '·',
            '•',
            '–',
            '—',
            'SKU',
            'Tiếng Việt',
            'English',
          ],
        },
      ],
    },
  },
  {
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': '+([a-z0-9])|[A-Z]*([a-zA-Z0-9])',
          'e2e/**/': '+([a-z0-9])|[A-Z]*([a-zA-Z0-9])',
          'scripts/**/': '+([a-z0-9])|[A-Z]*([a-zA-Z0-9])',
        },
      ],
    },
  },
  {
    // Một block chung cho src/, e2e/, scripts/: middle extension được khớp qua SUFFIX.
    files: ['src/**/*.{ts,vue}', 'e2e/**/*.ts', 'scripts/**/*.ts'],
    ignores: ['src/main.ts', 'src/env.d.ts'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{ts,vue}': `[A-Z]*([a-zA-Z0-9])${SUFFIX}` },
        { ignoreMiddleExtensions: false },
      ],
    },
  },
  {
    // Component host nhỏ trong test là bình thường; mock/axios history/JSON.parse trả `any`.
    files: ['**/*.spec.ts', 'src/test/**/*.ts'],
    rules: {
      'vue/one-component-per-file': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
  {
    // Trang chỉ có ở dev (design system, prototype Phase 0.5) — không cần i18n.
    files: [
      'src/app/views/DesignSystemView.vue',
      'src/features/*/prototype/**/*.vue',
      'src/shared/components/prototype/**/*.vue',
    ],
    rules: { 'vue/no-bare-strings-in-template': 'off' },
  },
  {
    // import() động và vi.mock()/vi.importActual() cũng phải dùng alias, không dùng ../
    files: ['src/**/*.{ts,vue}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `ImportExpression[source.value=/${PARENT_PATH}/]`,
          message: 'Relative parent imports (../) are not allowed; use an alias (§N).',
        },
        {
          selector: `CallExpression[callee.object.name='vi'][arguments.0.value=/${PARENT_PATH}/]`,
          message: 'Relative parent paths (../) are not allowed in vi.*; use an alias (§N).',
        },
      ],
    },
  },
  ...toFlatConfig(BOUNDARIES),
  prettier,
)
