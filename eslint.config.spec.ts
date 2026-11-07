// @vitest-environment node
// Kiểm tra BẢNG RANH GIỚI (BOUNDARIES) chạy đúng — thay cho kiểm tay ở Step 2 (D41).
// lintText() lint một đoạn code giả như thể nó nằm ở `filePath` → không cần tạo file thật.
import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

const eslint = new ESLint()

/** Trả true nếu dòng import này bị no-restricted-imports chặn khi đặt trong file `from`. */
async function isBlocked(from: string, importPath: string) {
  const code = `import '${importPath}'\n`
  const text = from.endsWith('.vue') ? `<script setup lang="ts">\n${code}</script>\n` : code
  const [result] = await eslint.lintText(text, { filePath: from })
  return (result?.messages ?? []).some((m) => m.ruleId === 'no-restricted-imports')
}

// [file đặt code, đường import, có bị chặn không] — mỗi dòng là một ca ở Step 2
const CASES: [string, string, boolean][] = [
  ['src/layouts/AuthLayout.vue', '@features/auth/stores/Auth.store', true],
  ['src/layouts/AuthLayout.vue', '@features/auth/schemas/X', true],
  ['src/layouts/AuthLayout.vue', '@features/auth/UseAuth', false],
  ['src/layouts/AuthLayout.vue', '@features/auth/types/Auth.types', false],
  ['src/layouts/AuthLayout.vue', '@features/auth/views/LoginView.vue', true],
  ['src/features/auth/views/LoginView.vue', '../../products/api/X', true],
  ['src/features/auth/views/LoginView.vue', '../stores/Auth.store', false],
  ['src/app/router/Routes.ts', '@features/auth/views/LoginView.vue', false],
  ['src/layouts/AuthLayout.vue', '../lib/api/client/HttpClient', true],
  ['src/layouts/AuthLayout.vue', '@shared/lib/api/client/HttpClient', false],
  ['src/test/Render.ts', '@app/Runtime', false],
  ['src/features/auth/api/Auth.api.ts', '@app/Runtime', true],
  ['src/layouts/components/AppHeader.vue', './UserMenu.vue', false],
  ['src/layouts/components/AppHeader.vue', '../AuthLayout.vue', true],
  ['src/layouts/components/UserMenu.vue', '@app/Runtime', true],
  ['src/layouts/components/UserMenu.vue', '@shared/composables/UseTheme', false],
  ['src/features/auth/UseAuth.ts', '@layouts/DashboardLayout.vue', true],
  ['src/shared/composables/UseNotify.ts', '@features/auth/UseAuth', true],
  ['src/shared/lib/query/QueryClient.ts', '@shared/composables/UseNotify', true],
  ['src/shared/lib/api/client/HttpClient.ts', '@shared/components/confirm/UseConfirm', true],
  ['src/shared/lib/query/QueryClient.ts', '@shared/lib/api/errors/ErrorPolicy', false],
  ['src/shared/components/feedback/ErrorState.vue', '@shared/lib/api/client/HttpClient', true],
  ['src/shared/components/feedback/ErrorState.vue', '@shared/composables/UseNotify', false],
  ['src/features/auth/components/LoginForm.vue', '../api/Auth.api', true],
  ['src/features/auth/components/LoginForm.vue', 'vue-router', true],
  ['src/features/auth/views/LoginView.vue', '@shared/types/Api.generated', true],
  ['src/features/auth/api/Auth.api.ts', '@shared/types/Api.generated', false],
]

describe('ranh giới import (BOUNDARIES)', () => {
  it.each(CASES)('%s import %s → chặn=%s', async (from, path, blocked) => {
    expect(await isBlocked(from, path)).toBe(blocked)
  })
})

describe('đặt tên file', () => {
  it('báo lỗi tên file kebab-case trong src/', async () => {
    const [result] = await eslint.lintText('export {}\n', { filePath: 'src/foo-bar.ts' })
    expect(result?.messages.some((m) => m.ruleId === 'check-file/filename-naming-convention')).toBe(
      true,
    )
  })

  it('chấp nhận PascalCase kèm hậu tố hợp lệ', async () => {
    const [result] = await eslint.lintText('export {}\n', {
      filePath: 'src/features/auth/stores/Auth.store.ts',
    })
    expect(result?.messages.some((m) => m.ruleId?.startsWith('check-file/'))).toBe(false)
  })
})
