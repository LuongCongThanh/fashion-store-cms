# 09 — Báo cáo

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/auth-skeleton` (stacked trên `feat/i18n`)
Ngày hoàn thành: 2026-11-07

## Đã làm

Làm theo TDD tại các seam `Guards.spec`, `UseAuth.spec`, `UseStoreScope.spec`, `Runtime.spec`.

- **`features/auth`**:
  - `types/Auth.types.ts`: `CurrentUser`, `LoginPayload`.
  - `api/Auth.api.ts`: `useAuthApi()` gọi `/auth/login` và `/auth/me`.
  - `stores/Auth.store.ts`: giữ user, và `loadUser` gom các lời gọi trùng lúc thành một request.
  - `views/LoginView.vue`: khung trống.
  - `Auth.routes.ts`.
  - `UseAuth.ts` bọc Session, trả `{ user, isAuthenticated, can, ensureUser, login, logout }`.
- `UseAuth.spec.ts` có 4 ca:
  - Login lưu token, tải user, và `can()` tính đúng.
  - Logout xoá user và về `auth.login`.
  - Sau F5, `ensureUser` chỉ gọi `/auth/me` 1 lần.
  - Không có token thì không gọi `/auth/me`.
- **`app/router`**:
  - `Guards.ts` (`authGuard`) kiểm tra `requiresAuth`, gọi `ensureUser()` rồi kiểm tra `meta.permission` bằng `useAuth().can()`.
  - `Routes.ts` gộp `Auth.routes.ts`, bọc `AuthLayout` và `DashboardLayout`, có 403, 404, và `design-system` (chỉ dev).
  - `Router.ts` dùng `Routes` và guard.
  - `RouteMeta.d.ts` theo §S.1.
- `Guards.spec.ts` có 5 ca, mock `@features/auth/UseAuth` theo §I:
  - Chưa đăng nhập thì về `/login?redirect=…`.
  - Đã đăng nhập thì vào được.
  - Thiếu quyền thì vào `forbidden`.
  - Có quyền thì vào được.
  - Tải user trước khi kiểm tra quyền (trường hợp F5).
- **`features/StoreScope`**: `types/StoreScope.types.ts`, `stores/StoreScope.store.ts` (danh sách stub 2 Store), `UseStoreScope.ts` trả `{ storeId, stores, current, switchStore }` và để Session làm phần đổi Store. Spec có 2 ca: đổi Store thì UI và header `X-Store-Id` đổi theo; cache của Store cũ bị xoá.
- **Layout**:
  - `AuthLayout.vue`.
  - `DashboardLayout` dùng `<RouterView/>`, header có `StoreSwitcher` và `UserMenu`.
  - `UserMenu` có thêm tên user và nút đăng xuất.
  - `ForbiddenView` và `NotFoundView`.
- **Runtime**: khi Session phát `authFailure`, ngoài việc về `/login` còn toast `errors.UNAUTHORIZED`, theo bảng §O.4. Có ca mới trong `Runtime.spec`.
- i18n: thêm `auth.login.title`, `common.logout`, `common.store`.

## Kết quả kiểm tra

| Mục kiểm tra                                    | Kết quả | Ghi chú                                                                                                                  |
| ----------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| Chưa đăng nhập vào `/admin` → `/login`          | Pass    | Có ca trong `Guards.spec`; trên browser (Playwright): URL `/login?redirect=/admin`, h1 "Đăng nhập", không có lỗi console |
| `Guards.spec.ts` pass                           | Pass    | 5/5                                                                                                                      |
| `main.ts` chỉ một dòng                          | Pass    | Một dòng logic `createApp(App).use(createAppRuntime().plugin).mount('#app')`, cộng các import (trong đó có import CSS)   |
| `queryClient.clear()` chỉ có trong `Session.ts` | Pass    | grep: không có trong `UseAuth.ts` hay `UseStoreScope.ts`                                                                 |
| `Session.spec`, `Runtime.spec` vẫn pass         | Pass    |                                                                                                                          |
| test, lint, typecheck, build                    | Pass    | 113/113                                                                                                                  |

## Lệch so với plan / quyết định mới

- Thêm `ensureUser()` vào `useAuth()`. Lý do: sau F5 chỉ còn token, chưa có user, nên nếu không tải user trước thì guard kiểm tra quyền sẽ chuyển sai sang 403. Test đã chỉ ra trường hợp này.
- `useStoreScope()` trả thêm `current` (Store hiện tại), để `StoreSwitcher` không phải tự tìm Store trong danh sách.
- Chưa tạo `StoreScope/api/` vì danh sách Store đang là stub cố định. Sẽ thêm ở P3.
- Route `home` (`/admin`) hiện là trang trống. Dashboard thật làm ở P4.
- Trang 403 và 404 nằm trong `DashboardLayout` (`/admin/403`); 404 có thêm route bắt mọi đường dẫn.

## Việc còn tồn

- Login thật (form, validate) làm ở P2. Cần BE chốt dạng response của `/auth/login` và `/auth/me`.
- Token usage: chưa điền.
