# 05 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/session-http-runtime` (stacked trên `chore/test-env-foundation`)
Ngày hoàn thành: 2026-11-07

## Đã làm

Làm theo TDD, mỗi slice viết 1 test và thấy đỏ trước khi viết code. Chỉ test ở 3 seam đã chốt.

- **Session** (`shared/lib/session/Session.ts`, `Session.store.ts`). File spec có 7 ca:
  - `signIn` xong thì đọc được token.
  - N lời gọi `refresh()` đồng thời chỉ gọi `callRefresh` 1 lần.
  - Refresh thất bại thì xoá token, phát `authFailure`, trả `null`.
  - Không có refresh token thì không gọi endpoint.
  - `logout` xoá token, xoá cache và phát `loggedOut`.
  - `switchStore` đổi storeId và xoá cache.
  - Token và storeId còn sau khi reload, vì được lưu bằng `useLocalStorage`. Các key là `cms.session.*`.
- **HttpClient** (một file, theo §M.1 và §O.3). File spec có 15 ca, gồm cả các ca chạy theo bảng mã lỗi:
  - Có đủ header `Authorization`, `X-Store-Id`, `Accept-Language`.
  - `skipAuth` thì không gửi `Authorization`. Chưa chọn Store thì không gửi `X-Store-Id`.
  - N request bị 401 chỉ refresh 1 lần, rồi gửi lại từng request.
  - Refresh thất bại thì trả `ApiError UNAUTHORIZED` và Session phát `authFailure`.
  - Body lỗi chuẩn được chuyển thành code, fields và requestId. Body không chuẩn thì lấy `codeFromStatus`.
  - Mất mạng thì trả `NETWORK_ERROR`. Timeout thì trả `TIMEOUT`. Request bị huỷ thì ném lại nguyên lỗi huỷ.
- `ApiError.ts`, `ErrorCode.ts` theo §O.1 và §O.2. `Api.generated.ts` hiện là placeholder (`paths` rỗng), nên các helper kiểu rơi về `unknown` hoặc `string`.
- **Runtime** (`app/Runtime.ts`). File spec có 3 ca:
  - Request có token, `X-Store-Id` và `Accept-Language`.
  - Refresh thất bại thì về `auth.login`. Đã kiểm chứng test này: tắt dòng wiring `on('authFailure')` thì test đỏ.
  - `logout` thì về `auth.login`.
- `app/router/Router.ts` là router tối thiểu, có `home` và `auth.login`. `main.ts` chỉ còn một dòng. `App.vue` là `<RouterView/>`. `Render.ts` gọi `createAppRuntime()` với các override.

## Kết quả kiểm tra

| Mục kiểm tra                                                     | Kết quả | Ghi chú                                         |
| ---------------------------------------------------------------- | ------- | ----------------------------------------------- |
| `npm test`                                                       | Pass    | 57/57                                           |
| `shared/lib/` không import `features/`                           | Pass    | Có rule trong `BOUNDARIES`; `npm run lint` pass |
| `client/` chỉ có `HttpClient.ts` + spec, refresh dùng `skipAuth` | Pass    |                                                 |
| `Session.spec.ts`, `Runtime.spec.ts`                             | Pass    |                                                 |
| `queryClient.clear()` chỉ có trong `Session.ts`                  | Pass    | Đã grep                                         |
| typecheck, lint, format                                          | Pass    |                                                 |

## Lệch so với plan / quyết định mới

- Runtime chưa có i18n (plan 08), notifier và `createAppQueryClient` (plan 06), Nuxt UI (plan 07), `installErrorHandling` (plan 06). Tạm thời `getLocale` trả `'vi'` và dùng `QueryClient` thường.
- Router tạm: route `auth.login` đang trỏ tới `DashboardLayout`. Plan 09 thay bằng `Routes.ts`, `Guards` và `LoginView`.
- `ApiError` khai báo field tường minh thay vì dùng parameter properties, vì `erasableSyntaxOnly` không cho phép parameter properties.
- Ở vài slice, code viết hơi trước test, nên test pass ngay: header khi `skipAuth` hoặc chưa chọn Store, và điều hướng khi `logout`. Các test này vẫn được giữ làm test bảo vệ.
- Token lưu ở localStorage (`cms.session.accessToken`, `refreshToken`, `storeId`).

## Việc còn tồn

- Token usage: chưa điền.
