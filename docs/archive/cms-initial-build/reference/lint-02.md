# E. ESLint rules — phần 2

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

```ts
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
  ['src/layouts/AuthLayout.vue', '@features/auth/stores/Auth.store', true],
  ['src/layouts/AuthLayout.vue', '@features/auth/UseAuth', false],
  ['src/features/auth/views/LoginView.vue', '../../products/api/X', true],
  ['src/features/auth/views/LoginView.vue', '../stores/Auth.store', false],
  ['src/app/router/Routes.ts', '@features/auth/views/LoginView.vue', false],
  ['src/test/Render.ts', '@app/Runtime', false],
  ['src/features/auth/api/Auth.api.ts', '@app/Runtime', true],
  ['src/shared/composables/UseNotify.ts', '@features/auth/UseAuth', true],
  ['src/features/auth/components/X.vue', 'vue-router', true],
  ['src/features/auth/views/LoginView.vue', '@shared/types/Api.generated', true],
  ['src/features/auth/api/Auth.api.ts', '@shared/types/Api.generated', false],
  ['src/shared/lib/query/QueryClient.ts', '@shared/composables/UseNotify', true],
  ['src/shared/lib/api/client/HttpClient.ts', '@shared/components/confirm/UseConfirm', true],
  ['src/shared/lib/query/QueryClient.ts', '@shared/lib/api/errors/ErrorPolicy', false],
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

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần tiếp](lint.md)
