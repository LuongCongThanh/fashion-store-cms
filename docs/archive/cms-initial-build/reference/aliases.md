# N. Import alias

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

Mỗi thư mục cấp 1 trong `src/` có một alias (7 alias: `@app`, `@assets`, `@features`, `@layouts`, `@locales`, `@shared`, `@test`). Quy tắc import tương đối (ESLint, §E):

- **Ngoài `features/`**: chỉ được `./` (cùng thư mục). Mọi `../` đều bị chặn, kể cả trong cùng thư mục cấp 1 (`layouts/components/AppHeader.vue` → `../AuthLayout.vue` phải viết `@layouts/AuthLayout.vue`).
- **Trong một feature**: được `./` và `../` (một cấp, giữa `api/`, `components/`…); `../../` bị chặn.
- Còn lại luôn dùng alias.

| Alias         | Trỏ tới          | Ví dụ                                                                                                          |
| ------------- | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `@app/*`      | `src/app/*`      | `@app/router/Router` (chỉ `main.ts`)                                                                           |
| `@assets/*`   | `src/assets/*`   | `@assets/images/Logo.svg`                                                                                      |
| `@features/*` | `src/features/*` | `@features/auth/UseAuth`                                                                                       |
| `@layouts/*`  | `src/layouts/*`  | `@layouts/DashboardLayout.vue`                                                                                 |
| `@shared/*`   | `src/shared/*`   | `@shared/components/feedback/ErrorState.vue`, `@shared/lib/api/errors/ApiError`, `@shared/types/Api.generated` |
| `@locales/*`  | `src/locales/*`  | `@locales/vi.json`                                                                                             |
| `@test/*`     | `src/test/*`     | `@test/Render` (chỉ trong `*.spec.ts`)                                                                         |

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
      "@test/*": ["src/test/*"],
    },
  },
}
```

```ts
// vite.config.ts
import tsconfigPaths from 'vite-tsconfig-paths'
plugins: [tsconfigPaths(), vue(), ui({ autoImport: false, ui: uiConfig })]
```

Thứ tự nhóm import (`perfectionist/sort-imports`): built-in → package ngoài → alias nội bộ (`@app`, `@features`… theo bảng) → tương đối `./ ../` → `import type` cuối mỗi nhóm. Cấu hình `internalPattern: ['^@(app|assets|features|layouts|locales|shared|test)/']`.

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
