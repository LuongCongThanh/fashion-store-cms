# 01 — Khởi tạo dự án

Status: ready-for-agent
Blocked by: —
Nguồn: Step 1 trong [scaffold-plan.md](../scaffold-plan.md) · Spec: [spec.md](../spec.md)

Phần dùng chung (không chép lại, đọc trong [scaffold-plan.md](../scaffold-plan.md)): Quyết định đã chốt (D1–D41, trong đó D24, D32 đã huỷ), Thuật ngữ, §A cây thư mục, §B đặt tên, §N alias, §T luồng dữ liệu, §U SOLID, §V lý do quyết định.

### Step 1 — Khởi tạo dự án

**Làm gì**

- Tạo Vite + Vue + TypeScript ở thư mục gốc; đổi tên file sinh sẵn theo §B.1.
- Cài dependency theo §K.1 và devDependency theo §K.3 (K.2 cài khi tới Phase).
- TypeScript `strict`, `noUncheckedIndexedAccess`, alias theo §N (`paths` trong `tsconfig.app.json` + `vite-tsconfig-paths`).
- `.nvmrc`, `engines`, `.editorconfig`, `.gitignore`, `.env.example`.

**Output:** `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`.

**Kiểm tra:** `npm run dev` mở được trang; `npm run typecheck` pass.

## Phần tham chiếu (chép nguyên văn từ scaffold-plan.md)

### G. Tooling

| Tool | Vai trò | Package |
| --- | --- | --- |
| EditorConfig | Indent 2 space, LF, UTF-8 | — |
| nvm | Ghim Node 22 | `.nvmrc` + `"engines": { "node": ">=22" }` |
| ESLint | Lint | `eslint`, `typescript-eslint`, `eslint-plugin-vue`, `eslint-plugin-perfectionist`, `eslint-plugin-unused-imports`, `eslint-plugin-check-file`, `eslint-config-prettier` |
| Prettier | Format | `prettier`, `prettier-plugin-tailwindcss` |
| Husky | Git hooks | `husky` |
| lint-staged | Chạy trên file staged | `lint-staged` |
| commitlint | Kiểm tra commit | `@commitlint/cli`, `@commitlint/config-conventional` |
| vue-tsc | Typecheck | `vue-tsc` |
| Vitest / Playwright | Test | `vitest`, `@vue/test-utils`, `jsdom`, `@vitest/coverage-v8`, `axios-mock-adapter`, `@playwright/test` (§I) |
| openapi-typescript | Sinh type API | xem Step 6 |

npm scripts:

```json
{
  "dev": "vite",
  "build": "vue-tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "vue-tsc -b --noEmit",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "gen:api": "openapi-typescript $OPENAPI_URL -o src/shared/types/Api.generated.ts",
  "knip": "knip",
  "analyze": "vite build --mode analyze",
  "pwa:assets": "pwa-assets-generator",
  "prepare": "husky"
}
```

VS Code: `.vscode/settings.json` (format on save bằng Prettier, `source.fixAll.eslint: explicit`); `.vscode/extensions.json` gợi ý Vue - Official, ESLint, Prettier, Tailwind CSS IntelliSense, EditorConfig.

### K. Danh sách package

Nguyên tắc: chỉ cài khi có step/feature dùng đến; khoá version bằng `package-lock.json`; kiểm tra `npm audit` và license (cấm GPL) trước khi thêm package mới; mỗi package mới cần lý do trong PR.

#### K.1. Dependencies — cài ở Foundation (Step 1–4)

| Nhóm | Package | Vai trò |
| --- | --- | --- |
| Core | `vue`, `vue-router`, `pinia` | Framework, routing, client state |
| Server state | `@tanstack/vue-query` | Cache/fetch dữ liệu API |
| HTTP | `axios` | HTTP client + interceptor |
| i18n | `vue-i18n` | Đa ngôn ngữ (§H) |
| UI | `@nuxt/ui`, `tailwindcss` | Component + styling (§J) |
| Icon | `@iconify-json/lucide` | Bộ icon offline cho Nuxt UI |
| Validation | `zod` | Schema env (`Env.config.ts`, Step 3a); sau này cả form, list params |
| Tiện ích | `@vueuse/core` | Composable dùng chung (debounce, storage…) |
| Font | `@fontsource-variable/inter`, `@fontsource-variable/plus-jakarta-sans` | Font self-host (§L.5) |

```bash
npm i vue-router pinia @tanstack/vue-query axios vue-i18n zod \
  @nuxt/ui tailwindcss @iconify-json/lucide \
  @vueuse/core \
  @fontsource-variable/inter @fontsource-variable/plus-jakarta-sans
```

#### K.2. Dependencies — cài khi tới Phase tương ứng (§30)

| Package | Khi nào | Vai trò |
| --- | --- | --- |
| `echarts`, `vue-echarts` | Phase 4 — Dashboard | Biểu đồ, import theo module, lazy-load |
| `@tiptap/vue-3`, `@tiptap/pm`, `@tiptap/starter-kit` | Phase 5 — Product (mô tả) | Rich text editor |
| `dompurify` | Cùng lúc Tiptap | Sanitize HTML trước khi render (`vue/no-v-html`) |
| `vee-validate`, `@vee-validate/zod` | Form có validate đầu tiên (login thật / P5) | Form + map lỗi API; field array cho Variants (lý do chọn: FE_architecture §2) |
| `dayjs` | P5 — `RelativeTime.vue` | Format ngày giờ, thời gian tương đối |
| `@internationalized/date` | DatePicker đầu tiên | Kiểu ngày cho DatePicker Nuxt UI (có thể đã có sẵn qua `@nuxt/ui` — chỉ thêm khi import trực tiếp) |

#### K.3. DevDependencies

| Nhóm | Package |
| --- | --- |
| Build | `vite`, `@vitejs/plugin-vue`, `typescript`, `vue-tsc`, `@types/node`, `@vue/tsconfig` |
| Lint | `eslint`, `typescript-eslint`, `eslint-plugin-vue`, `eslint-plugin-perfectionist`, `eslint-plugin-unused-imports`, `eslint-plugin-check-file`, `eslint-config-prettier`, `jiti` (đọc `eslint.config.ts`) |
| Format | `prettier`, `prettier-plugin-tailwindcss` |
| Git | `husky`, `lint-staged`, `@commitlint/cli`, `@commitlint/config-conventional` |
| Unit test | `vitest`, `@vitest/coverage-v8`, `@vue/test-utils`, `jsdom`, `axios-mock-adapter`, `@pinia/testing` |
| E2E | `@playwright/test` |
| API types | `openapi-typescript`, `tsx` (chạy `scripts/GenApi.ts`) |
| Dev UX | `vite-plugin-vue-devtools`, `vite-plugin-checker`, `@tanstack/vue-query-devtools`, `vite-tsconfig-paths` |
| PWA | `vite-plugin-pwa`, `@vite-pwa/assets-generator` |
| Test data | `@faker-js/faker` |
| Bảo trì | `knip`, `rollup-plugin-visualizer` |

```bash
npm i -D @types/node vue-tsc \
  eslint typescript-eslint eslint-plugin-vue eslint-plugin-perfectionist \
  eslint-plugin-unused-imports eslint-plugin-check-file eslint-config-prettier jiti \
  prettier prettier-plugin-tailwindcss \
  husky lint-staged @commitlint/cli @commitlint/config-conventional \
  vitest @vitest/coverage-v8 @vue/test-utils jsdom axios-mock-adapter @pinia/testing \
  @playwright/test openapi-typescript tsx vite-plugin-vue-devtools \
  vite-plugin-checker @tanstack/vue-query-devtools vite-tsconfig-paths \
  vite-plugin-pwa @vite-pwa/assets-generator @faker-js/faker knip rollup-plugin-visualizer
```

#### K.4. Lib bổ trợ — cân nhắc, chưa cài

| Package | Dùng khi | Ghi chú |
| --- | --- | --- |
| `@intlify/eslint-plugin-vue-i18n` | Muốn ESLint bắt text hard-code / key thiếu | Bổ sung cho §H |
| `@intlify/unplugin-vue-i18n` | Locale tách nhiều file, muốn precompile | Giảm bundle, bỏ runtime compiler |
| `pinia-plugin-persistedstate` | Nhiều store cần persist | Hiện chỉ locale → dùng `useLocalStorage` của VueUse |
| `@sentry/vue` | Có môi trường production | Theo dõi lỗi runtime |
| `nprogress` | Muốn thanh tiến trình khi đổi route | Có thể dùng `ULoadingIndicator`/tự làm |

#### K.5. Không dùng

| Package | Lý do |
| --- | --- |
| `msw` | Đã bỏ (D18) |
| `lodash` | Dùng JS thuần + VueUse; nếu cần thì `es-toolkit` |
| `moment` | Đã chọn dayjs |
| `sass` | CSS-first Tailwind (§J) |
| `vuex` | Đã chọn Pinia |
| `unplugin-auto-import` cho code nội bộ | Quy định import tường minh (§2) |

### N. Import alias

Mỗi thư mục cấp 1 trong `src/` có một alias (7 alias: `@app`, `@assets`, `@features`, `@layouts`, `@locales`, `@shared`, `@test`). Quy tắc import tương đối (ESLint, §E):

- **Ngoài `features/`**: chỉ được `./` (cùng thư mục). Mọi `../` đều bị chặn, kể cả trong cùng thư mục cấp 1 (`layouts/components/AppHeader.vue` → `../AuthLayout.vue` phải viết `@layouts/AuthLayout.vue`).
- **Trong một feature**: được `./` và `../` (một cấp, giữa `api/`, `components/`…); `../../` bị chặn.
- Còn lại luôn dùng alias.

| Alias | Trỏ tới | Ví dụ |
| --- | --- | --- |
| `@app/*` | `src/app/*` | `@app/router/Router` (chỉ `main.ts`) |
| `@assets/*` | `src/assets/*` | `@assets/images/Logo.svg` |
| `@features/*` | `src/features/*` | `@features/auth/UseAuth` |
| `@layouts/*` | `src/layouts/*` | `@layouts/DashboardLayout.vue` |
| `@shared/*` | `src/shared/*` | `@shared/components/feedback/ErrorState.vue`, `@shared/lib/api/errors/ApiError`, `@shared/types/Api.generated` |
| `@locales/*` | `src/locales/*` | `@locales/vi.json` |
| `@test/*` | `src/test/*` | `@test/Render` (chỉ trong `*.spec.ts`) |

- Không có alias gốc `@/` — mỗi import cho thấy ngay nó thuộc tầng nào, ESLint kiểm tra chiều phụ thuộc (§A) dễ hơn.
- **Nguồn duy nhất là `tsconfig.app.json`**; Vite/Vitest đọc lại qua `vite-tsconfig-paths`, không khai báo lặp `resolve.alias`.

```jsonc
// tsconfig.app.json (phần liên quan)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/app/*"],
      "@assets/*": ["src/assets/*"],
      "@features/*": ["src/features/*"],
      "@layouts/*": ["src/layouts/*"],
      "@locales/*": ["src/locales/*"],
      "@shared/*": ["src/shared/*"],
      "@test/*": ["src/test/*"]
    }
  }
}
```

```ts
// vite.config.ts
import tsconfigPaths from 'vite-tsconfig-paths'
plugins: [tsconfigPaths(), vue(), ui({ autoImport: false, ui: uiConfig })]
```

Thứ tự nhóm import (`perfectionist/sort-imports`): built-in → package ngoài → alias nội bộ (`@app`, `@features`… theo bảng) → tương đối `./ ../` → `import type` cuối mỗi nhóm. Cấu hình `internalPattern: ['^@(app|assets|features|layouts|locales|shared|test)/']`.
