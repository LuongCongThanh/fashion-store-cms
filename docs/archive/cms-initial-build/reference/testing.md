# I. Cấu hình unit / component test (Vitest)

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

**Công cụ:** `vitest`, `@vue/test-utils`, `jsdom`, `@vitest/coverage-v8`, `axios-mock-adapter`.

**Chiến lược fake API (đã bỏ MSW):**

| Loại test                              | Cách fake                                                                                                                                        | Ví dụ                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Unit logic thuần (util, schema, guard) | Không fake                                                                                                                                       | `Product.schema.spec.ts`                                                                         |
| HTTP client                            | `createHttpClient({ session, transport: mock.adapter() })` trực tiếp trong `HttpClient.spec.ts` (Session dựng bằng `createSession({ initial })`) | N request 401 → 1 lần `session.refresh()`; mất mạng → `ApiError` `NETWORK_ERROR`                 |
| Session                                | Pinia thật + `axios-mock-adapter` cho endpoint refresh, `QueryClient` thật                                                                       | `Session.spec.ts`: signIn/logout, `switchStore` xoá cache, refresh thất bại → phát `authFailure` |
| Component / composable / view          | `axios-mock-adapter` trên HTTP client mà `renderWithPlugins()` cung cấp — **một seam duy nhất là HTTP**                                          | `ProductTable.spec.ts`                                                                           |
| Code dùng feature khác                 | Chỉ được mock interface công khai: `vi.mock('@features/x/UseX')`                                                                                 | Guard dùng `useAuth`                                                                             |

Cấm `vi.mock` vào file nội bộ của feature (`api/`, `stores/`…): test bị buộc vào cấu trúc file, đổi tên là vỡ.

**Quy tắc**

- Test đặt cạnh file nguồn (`*.spec.ts`); E2E ở `e2e/`, Vitest không quét `e2e/`.
- Mỗi test tự tạo Pinia (`createTestingPinia` hoặc `setActivePinia(createPinia())`), `QueryClient` mới (`retry: false`), i18n mới — tất cả do `createAppRuntime()` tạo trong `renderWithPlugins()`; không có singleton nào để rò giữa các test.
- Helper `renderWithPlugins()` trong `src/test/Render.ts` gọi **chính** `createAppRuntime()` của app (D37) với override: transport mock (`axios-mock-adapter`), `notifier` giả, `session` khởi tạo sẵn trạng thái đã đăng nhập (override được), `retry: false`. Trả về `http` mock để khai báo response và `notifier` để assert toast. Không tự ráp plugin riêng → wiring test không lệch wiring prod.
- Không snapshot toàn component; assert theo hành vi (text, event, gọi API).
- Coverage: báo cáo, chưa đặt ngưỡng bắt buộc ở giai đoạn Foundation.

```ts
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: false,
      include: ['src/**/*.spec.ts', 'eslint.config.spec.ts'], // + test bảng ranh giới (D41)
      setupFiles: ['src/test/Setup.ts'],
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,vue}'],
        exclude: ['src/**/*.spec.ts', 'src/shared/types/Api.generated.ts', 'src/main.ts'],
      },
    },
  }),
)
```

```ts
// src/test/Setup.ts — chỉ thiết lập môi trường, không gắn plugin dùng chung
import { afterEach } from 'vitest'

afterEach(() => {
  localStorage.clear()
})
```

```ts
// src/test/Render.ts (phác thảo)
export function renderWithPlugins(component, options: RenderOptions = {}) {
  const http = new MockAdapter() // axios-mock-adapter
  const notifier = createFakeNotifier() // ghi lại toast để assert
  const runtime = createAppRuntime({
    transport: http.adapter(),
    notifier,
    session: options.session ?? { accessToken: 'test-token', storeId: 'store-1' },
    retry: false,
    router: options.router, // mặc định memory history
  })
  const wrapper = mount(component, { global: { plugins: [runtime.plugin] }, ...options.mount })
  return { wrapper, http, notifier, runtime }
}
```

Script thêm: `"test:coverage": "vitest run --coverage"`.

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).
