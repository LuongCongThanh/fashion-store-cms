# Kiểm thử và runtime dùng chung

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## Cấu hình unit / component test (Vitest)

> Test gì, ở tầng nào và danh sách kịch bản: [chiến lược kiểm thử](strategy.md), [traceability](traceability.md). Mục này giữ cách dựng test.

**Công cụ:** `vitest`, `@vue/test-utils`, `jsdom`, `@vitest/coverage-v8`, `axios-mock-adapter`.

**Chiến lược fake API (đã bỏ MSW):**

| Loại test                              | Cách fake                                                                                                                                        | Ví dụ                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Unit logic thuần (util, schema, guard) | Không fake                                                                                                                                       | `Product.schema.spec.ts`                                                         |
| HTTP client                            | `createHttpClient({ session, transport: mock.adapter() })` trực tiếp trong `HttpClient.spec.ts` (Session dựng bằng `createSession({ initial })`) | N request 401 → 1 lần `session.refresh()`; mất mạng → `ApiError` `NETWORK_ERROR` |
| Session                                | Pinia thật + `axios-mock-adapter` cho endpoint refresh, `QueryClient` thật                                                                       | `Session.spec.ts`: signIn/logout, refresh thất bại → phát `authFailure`          |
| Component / composable / view          | `axios-mock-adapter` trên HTTP client mà `renderWithPlugins()` cung cấp — **một seam duy nhất là HTTP**                                          | `ProductTable.spec.ts`                                                           |
| Code dùng feature khác                 | Chỉ được mock interface công khai: `vi.mock('@features/x/UseX')`                                                                                 | Guard dùng `useAuth`                                                             |

Cấm `vi.mock` vào file nội bộ của feature (`api/`, `stores/`…): test bị buộc vào cấu trúc file, đổi tên là vỡ.

**Quy tắc**

- Test đặt cạnh file nguồn (`*.spec.ts`); E2E ở `e2e/`, Vitest không quét `e2e/`.
- Mỗi test tự tạo Pinia (`createTestingPinia` hoặc `setActivePinia(createPinia())`), `QueryClient` mới (`retry: false`), i18n mới — tất cả do `createAppRuntime()` tạo trong `renderWithPlugins()`; không có singleton nào để rò giữa các test.
- `src/test/Setup.ts` bật `enableAutoUnmount(afterEach)` và xoá `localStorage`/`sessionStorage` sau mỗi test (Nuxt UI dùng shared composable cho locale/toast — không unmount là rò state).
- Helper `renderWithPlugins()` trong `src/test/Render.ts` gọi **chính** `createAppRuntime()` của app (D37) với override: transport mock (`axios-mock-adapter`), `notifier` giả, `session` khởi tạo sẵn trạng thái đã đăng nhập (override được), `retry: false`. Trả về `http` mock để khai báo response và `notifier` để assert toast. Không tự ráp plugin riêng → wiring test không lệch wiring prod.
- Không snapshot toàn component; assert theo hành vi (text, event, gọi API).
- Coverage hiện cấu hình báo cáo trong `vitest.config.ts`; không suy threshold từ một số đo lịch sử.

> Nguồn: [`vitest.config.ts`](../../vitest.config.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/test/Setup.ts`](../../src/test/Setup.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/test/Render.ts`](../../src/test/Render.ts) — tài liệu không chép lại code, đọc file.

Chạy coverage bằng `npm run test:coverage` theo package.json.

---

Tra cứu: [Mục lục chủ đề](../conventions/README.md) · [Toàn bộ tài liệu](../README.md).
