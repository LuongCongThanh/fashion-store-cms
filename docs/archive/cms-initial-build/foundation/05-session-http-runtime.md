# F05 — Session, HttpClient, Runtime

> Hồ sơ lịch sử nền tảng; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: done
Blocked by: 04
Nguồn: Step 3a (phần 2) · Spec tổng: [Phạm vi giai đoạn](../foundation.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../foundation.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Có Session, HttpClient một file và composition root createAppRuntime(), refresh token an toàn khi gọi đồng thời.

### Phạm vi (Làm gì)

- Tạo `shared/lib/api/`.
- `shared/lib/session/Session.ts` theo §M.2 (tạo **trước** HttpClient vì HttpClient phụ thuộc Session) + `Session.spec.ts`: N lời gọi `refresh()` đồng thời → 1 lần `callRefresh`; refresh thất bại → xoá token + phát `authFailure`; `logout()`/`switchStore()` gọi `queryClient.clear()`.
- `HttpClient.ts` (một file) theo §M.1 (interface hẹp, có kiểu theo `paths`, deps không có kiểu axios) + `HttpClient.spec.ts`: N request 401 → 1 lần `session.refresh()`; request `skipAuth` không có `Authorization`; refresh thất bại → Session phát `authFailure`; mọi request có `X-Store-Id`, `Accept-Language`; lỗi luôn là `ApiError`.
- `app/Runtime.ts` theo §M.2 (`createAppRuntime()`) + `Runtime.spec.ts`; `main.ts` chỉ một dòng `createApp(App).use(createAppRuntime().plugin).mount('#app')`. Chưa có `features/auth` nên Session bắt đầu ở trạng thái chưa đăng nhập.

### Tiêu chí hoàn thành

`npm test` pass; `shared/lib/` không import `features/` (ESLint); `client/` chỉ có `HttpClient.ts` + spec, refresh dùng `skipAuth` (§V.5); `Session.spec.ts` pass; `Runtime.spec.ts` pass: request có token + `X-Store-Id` + `Accept-Language`, `authFailure` điều hướng về `auth.login` (§V.1); `queryClient.clear()` chỉ xuất hiện trong `Session.ts`.

### Phụ thuộc

- Blocked by: 04

### Ngoài phạm vi

- Những việc của các plan con khác trong [spec tổng](../foundation.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

### Kế hoạch thực hiện

#### Step 3a (phần 2) — Session, HttpClient, Runtime

**Làm gì**

**Kiểm tra:** `npm test` pass; `shared/lib/` không import `features/` (ESLint); `client/` chỉ có `HttpClient.ts` + spec, refresh dùng `skipAuth` (§V.5); `Session.spec.ts` pass; `Runtime.spec.ts` pass: request có token + `X-Store-Id` + `Accept-Language`, `authFailure` điều hướng về `auth.login` (§V.1); `queryClient.clear()` chỉ xuất hiện trong `Session.ts`.

### Phần tham chiếu

Các đoạn dùng chung được giữ một lần ở scaffold plan; đây là tài liệu lịch sử, không phải quy tắc hiện hành.

- [Scaffold — m-http-client-seam-với-auth-và-storescope](../reference/http-session.md#m-http-client-seam-với-auth-và-storescope)

## Kết quả và review

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/session-http-runtime` (stacked trên `chore/test-env-foundation`)
Ngày hoàn thành: 2026-11-07

### Đã làm

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

### Kết quả kiểm tra

| Mục kiểm tra                                                     | Kết quả | Ghi chú                                         |
| ---------------------------------------------------------------- | ------- | ----------------------------------------------- |
| `npm test`                                                       | Pass    | 57/57                                           |
| `shared/lib/` không import `features/`                           | Pass    | Có rule trong `BOUNDARIES`; `npm run lint` pass |
| `client/` chỉ có `HttpClient.ts` + spec, refresh dùng `skipAuth` | Pass    |                                                 |
| `Session.spec.ts`, `Runtime.spec.ts`                             | Pass    |                                                 |
| `queryClient.clear()` chỉ có trong `Session.ts`                  | Pass    | Đã grep                                         |
| typecheck, lint, format                                          | Pass    |                                                 |

### Lệch so với plan / quyết định mới

- Runtime chưa có i18n (plan 08), notifier và `createAppQueryClient` (plan 06), Nuxt UI (plan 07), `installErrorHandling` (plan 06). Tạm thời `getLocale` trả `'vi'` và dùng `QueryClient` thường.
- Router tạm: route `auth.login` đang trỏ tới `DashboardLayout`. Plan 09 thay bằng `Routes.ts`, `Guards` và `LoginView`.
- `ApiError` khai báo field tường minh thay vì dùng parameter properties, vì `erasableSyntaxOnly` không cho phép parameter properties.
- Ở vài slice, code viết hơi trước test, nên test pass ngay: header khi `skipAuth` hoặc chưa chọn Store, và điều hướng khi `logout`. Các test này vẫn được giữ làm test bảo vệ.
- Token lưu ở localStorage (`cms.session.accessToken`, `refreshToken`, `storeId`).

### Việc còn tồn

- Token usage: chưa điền.
