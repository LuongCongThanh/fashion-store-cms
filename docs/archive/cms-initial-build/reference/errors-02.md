# O. Lỗi API, mã lỗi, xử lý trong HttpClient — phần 2

> Lịch sử scaffold đã đóng; không áp branch, stack, StoreScope hoặc API mẫu vào source hiện hành.

```ts
// src/shared/lib/query/QueryClient.ts
export function createAppQueryClient(opts: {
  onMutationError: (e: unknown) => void
  retry?: false // test truyền false
}) {
  const { onMutationError } = opts
  return new QueryClient({
    defaultOptions: {
      queries: { retry: opts.retry ?? ((n, e) => n < 2 && isRetryable(e)), staleTime: 30_000 },
    },
    mutationCache: new MutationCache({
      onError: (error, _v, _c, mutation) => {
        if (routeMutationError(error, mutation.meta) === 'toast') onMutationError(error)
      },
    }),
  })
}
// isRetryable, routeMutationError: ErrorPolicy.ts — không viết lại logic ở đây.
```

```ts
// src/shared/lib/query/VueQuery.d.ts
import '@tanstack/vue-query'
declare module '@tanstack/vue-query' {
  interface Register {
    mutationMeta: { errorHandling?: 'global' | 'local' }
  }
}
```

`ErrorHandling.ts` có một interface: `installErrorHandling(app, { router, notifier })` — gắn `app.config.errorHandler`, `unhandledrejection`, `router.onError`. `main.ts` gọi một lần.

`notifier` tạo bằng `createNotifier()` trong `UseNotify.ts` — dùng được ngoài `setup` (toast của Nuxt UI chỉ cần `UApp` đã mount, gọi trước khi mount thì xếp hàng). `useNotify()` trong component chỉ là `createNotifier()` dùng chung một instance.

Component **không** tự `try/catch` để toast lỗi mutation (đã có global); chỉ toast **thành công** qua `useNotify().success(...)`.

---

Tra cứu: [Mục lục chủ đề](../README.md) · [Toàn bộ tài liệu](../../../README.md).

[Phần tiếp](errors.md)
