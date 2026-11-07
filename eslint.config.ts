import prettier from 'eslint-config-prettier'
import checkFile from 'eslint-plugin-check-file'
import perfectionist from 'eslint-plugin-perfectionist'
import unusedImports from 'eslint-plugin-unused-imports'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

type Restriction = { group: string[]; message: string } | { message: string; regex: string }

// Whitelist viết bằng regex: với `group` (cú pháp gitignore), `@features/**` loại luôn thư mục cha
// nên phần tử `!` không thể mở lại file bên trong.
const FEATURE_PUBLIC = 'Use[^/]*|types/[^/]+'
const featureBoundary: Restriction = {
  regex: `^@features/[^/]+/(?!(?:${FEATURE_PUBLIC})$).+`,
  message: 'Chỉ import Use*.ts hoặc types/ của feature khác (§B.3).',
}
// Ngoài features/: cấm MỌI import lên thư mục cha (../), chỉ cho ./ cùng thư mục.
const noParentImport: Restriction = {
  group: ['../*', '../**'],
  message: 'Không import thư mục cha bằng ../ ; dùng alias (§N).',
}
// Trong feature: ../ được phép (components/ → ../api/), ../../ là thoát khỏi feature.
const noEscapeFeature: Restriction = {
  group: ['../../*', '../../**'],
  message: 'Không import tương đối ra ngoài feature; dùng alias (§N).',
}
const noApp: Restriction = {
  group: ['@app/*', '@app/**'],
  message: 'Chỉ main.ts và src/test/ được import @app/* (§A, D37).',
}
const noLayouts: Restriction = {
  group: ['@layouts/*', '@layouts/**'],
  message: 'features/ không import layouts/.',
}
const noUpper: Restriction = {
  group: ['@app/**', '@layouts/**', '@features/**'],
  message: 'shared/ không được import app/, layouts/, features/.',
}
const noDto: Restriction = {
  group: ['@shared/types/Api.generated'],
  message: 'DTO chỉ dùng trong features/*/api/ và shared/lib/api/ — dùng Model ở types/ (§T.3).',
}
const presentational: Restriction = {
  group: ['../api/*', '../stores/*', '../composables/*', 'vue-router'],
  message: 'components/ là presentational: chỉ props/emits, không gọi API/store/router (§T.1).',
}
const libIsBottom: Restriction = {
  group: ['@shared/components/*', '@shared/components/**', '@shared/composables/*'],
  message: 'shared/lib/ là tầng dưới: không import components/, composables/ (§A).',
}
const noHttpInSharedUi: Restriction = {
  group: ['@shared/lib/api/client/*'],
  message: 'shared/components/ không gọi API (§A).',
}
const featureBoundaryForRoutes: Restriction = {
  ...featureBoundary,
  regex: `^@features/[^/]+/(?!(?:${FEATURE_PUBLIC}|views/[^/]+|[^/]+\\.routes)$).+`,
}

/**
 * BẢNG RANH GIỚI — nguồn duy nhất cho no-restricted-imports (D41).
 * Mỗi dòng: thư mục nào (`files`) bị cấm import gì (`forbid`).
 * Dòng sau áp cho cùng file sẽ THAY dòng trước (hành vi flat config),
 * nên dòng cụ thể đặt sau dòng chung và tự liệt kê đủ pattern của nó.
 */
export const BOUNDARIES: { files: string[]; forbid: Restriction[]; name: string }[] = [
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
const toFlatConfig = (rows: typeof BOUNDARIES) =>
  rows.map(({ files, forbid, name }) => ({
    name: `boundaries/${name}`,
    files,
    rules: { 'no-restricted-imports': ['error', { patterns: forbid }] as const },
  }))

const SUFFIX =
  '?(.api|.mapper|.routes|.store|.schema|.types|.config|.factory|.generated|.d)?(.spec)'

export default tseslint.config(
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
  ...tseslint.configs.strict,
  ...vue.configs['flat/recommended'],
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
      'unused-imports/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'vue/multi-word-component-names': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/define-macros-order': [
        'error',
        { order: ['defineProps', 'defineEmits', 'defineModel'] },
      ],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/no-v-html': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/attribute-hyphenation': ['error', 'never'],
      'vue/v-on-event-hyphenation': ['error', 'never', { autofix: true }],
    },
  },
  {
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': '+([a-z])|[A-Z]*([a-zA-Z0-9])',
          'e2e/**/': '+([a-z])|[A-Z]*([a-zA-Z0-9])',
          'scripts/**/': '+([a-z])|[A-Z]*([a-zA-Z0-9])',
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,vue}'],
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
    files: ['e2e/**/*.ts', 'scripts/**/*.ts'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.ts': `[A-Z]*([a-zA-Z0-9])${SUFFIX}` },
      ],
    },
  },
  {
    // Component host nhỏ trong test là bình thường.
    files: ['**/*.spec.ts'],
    rules: { 'vue/one-component-per-file': 'off' },
  },
  ...toFlatConfig(BOUNDARIES),
  prettier,
)
