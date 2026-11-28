# K. Danh sách package

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

Nguyên tắc: chỉ cài khi có step/feature dùng đến; khoá version bằng `package-lock.json`; kiểm tra `npm audit` và license (cấm GPL) trước khi thêm package mới; mỗi package mới cần lý do trong PR.

### K.1. Dependencies — cài ở Foundation (Step 1–4)

| Nhóm         | Package                                                                | Vai trò                                                             |
| ------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Core         | `vue`, `vue-router`, `pinia`                                           | Framework, routing, client state                                    |
| Server state | `@tanstack/vue-query`                                                  | Cache/fetch dữ liệu API                                             |
| HTTP         | `axios`                                                                | HTTP client + interceptor                                           |
| i18n         | `vue-i18n`                                                             | Đa ngôn ngữ (§H)                                                    |
| UI           | `@nuxt/ui`, `tailwindcss`                                              | Component + styling (§J)                                            |
| Icon         | `@iconify-json/lucide`                                                 | Bộ icon offline cho Nuxt UI                                         |
| Validation   | `zod`                                                                  | Schema env (`Env.config.ts`, Step 3a); sau này cả form, list params |
| Tiện ích     | `@vueuse/core`                                                         | Composable dùng chung (debounce, storage…)                          |
| Font         | `@fontsource-variable/inter`, `@fontsource-variable/plus-jakarta-sans` | Font self-host (§L.5)                                               |

```bash
npm i vue-router pinia @tanstack/vue-query axios vue-i18n zod \
  @nuxt/ui tailwindcss @iconify-json/lucide \
  @vueuse/core \
  @fontsource-variable/inter @fontsource-variable/plus-jakarta-sans
```

### K.2. Dependencies — cài khi tới Phase tương ứng (§30)

| Package                                              | Khi nào                                     | Vai trò                                                                                            |
| ---------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `echarts`, `vue-echarts`                             | Phase 4 — Dashboard                         | Biểu đồ, import theo module, lazy-load                                                             |
| `@tiptap/vue-3`, `@tiptap/pm`, `@tiptap/starter-kit` | Phase 5 — Product (mô tả)                   | Rich text editor                                                                                   |
| `dompurify`                                          | Cùng lúc Tiptap                             | Sanitize HTML trước khi render (`vue/no-v-html`)                                                   |
| `vee-validate`, `@vee-validate/zod`                  | Form có validate đầu tiên (login thật / P5) | Form + map lỗi API; field array cho Variants (lý do chọn: FE_architecture §2)                      |
| `dayjs`                                              | P5 — `RelativeTime.vue`                     | Format ngày giờ, thời gian tương đối                                                               |
| `@internationalized/date`                            | DatePicker đầu tiên                         | Kiểu ngày cho DatePicker Nuxt UI (có thể đã có sẵn qua `@nuxt/ui` — chỉ thêm khi import trực tiếp) |

### K.3. DevDependencies

| Nhóm      | Package                                                                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build     | `vite`, `@vitejs/plugin-vue`, `typescript`, `vue-tsc`, `@types/node`, `@vue/tsconfig`                                                                                                                    |
| Lint      | `eslint`, `typescript-eslint`, `eslint-plugin-vue`, `eslint-plugin-perfectionist`, `eslint-plugin-unused-imports`, `eslint-plugin-check-file`, `eslint-config-prettier`, `jiti` (đọc `eslint.config.ts`) |
| Format    | `prettier`, `prettier-plugin-tailwindcss`                                                                                                                                                                |
| Git       | `husky`, `lint-staged`, `@commitlint/cli`, `@commitlint/config-conventional`                                                                                                                             |
| Unit test | `vitest`, `@vitest/coverage-v8`, `@vue/test-utils`, `jsdom`, `axios-mock-adapter`, `@pinia/testing`                                                                                                      |
| E2E       | `@playwright/test`                                                                                                                                                                                       |
| API types | `openapi-typescript`, `tsx` (chạy `scripts/GenApi.ts`)                                                                                                                                                   |
| Dev UX    | `vite-plugin-vue-devtools`, `vite-plugin-checker`, `@tanstack/vue-query-devtools`, `vite-tsconfig-paths`                                                                                                 |
| PWA       | `vite-plugin-pwa`, `@vite-pwa/assets-generator`                                                                                                                                                          |
| Test data | `@faker-js/faker`                                                                                                                                                                                        |
| Bảo trì   | `knip`, `rollup-plugin-visualizer`                                                                                                                                                                       |

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

### K.4. Lib bổ trợ — cân nhắc, chưa cài

| Package                           | Dùng khi                                   | Ghi chú                                             |
| --------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| `@intlify/eslint-plugin-vue-i18n` | Muốn ESLint bắt text hard-code / key thiếu | Bổ sung cho §H                                      |
| `@intlify/unplugin-vue-i18n`      | Locale tách nhiều file, muốn precompile    | Giảm bundle, bỏ runtime compiler                    |
| `pinia-plugin-persistedstate`     | Nhiều store cần persist                    | Hiện chỉ locale → dùng `useLocalStorage` của VueUse |
| `@sentry/vue`                     | Có môi trường production                   | Theo dõi lỗi runtime                                |
| `nprogress`                       | Muốn thanh tiến trình khi đổi route        | Có thể dùng `ULoadingIndicator`/tự làm              |

### K.5. Không dùng

| Package                                | Lý do                                            |
| -------------------------------------- | ------------------------------------------------ |
| `msw`                                  | Đã bỏ (D18)                                      |
| `lodash`                               | Dùng JS thuần + VueUse; nếu cần thì `es-toolkit` |
| `moment`                               | Đã chọn dayjs                                    |
| `sass`                                 | CSS-first Tailwind (§J)                          |
| `vuex`                                 | Đã chọn Pinia                                    |
| `unplugin-auto-import` cho code nội bộ | Quy định import tường minh (§2)                  |

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
