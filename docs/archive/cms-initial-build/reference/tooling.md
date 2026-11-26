# G. Tooling

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

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
| Vitest / Playwright | Test                      | `vitest`, `@vue/test-utils`, `jsdom`, `@vitest/coverage-v8`, `axios-mock-adapter`, `@playwright/test` (§I)                                                              |
| openapi-typescript  | Sinh type API             | xem Step 6                                                                                                                                                              |

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

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
