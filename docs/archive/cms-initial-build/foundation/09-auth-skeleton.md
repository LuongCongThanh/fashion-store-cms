# F09 — Khung features/auth và StoreScope

> Hồ sơ lịch sử nền tảng; trạng thái và số đo bên dưới thuộc đợt gốc. Policy hiện hành ở [docs](../../../README.md).

## Đặc tả và kế hoạch

Status: done
Blocked by: 06, 07, 08
Nguồn: Step 4 · Spec tổng: [Phạm vi giai đoạn](../foundation.md) · Chi tiết: [Kế hoạch thực hiện](#kế-hoạch-thực-hiện)

### Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../foundation.md#lưu-ý-bắt-buộc) trong spec tổng.

### Mục tiêu

Có khung features/auth (stub) và StoreScope, guard chặn route cần đăng nhập.

### Phạm vi (Làm gì)

- Tạo `features/auth/` theo §A với interface `useAuth()` (§8.1) trong `UseAuth.ts` — stub, chưa gọi API thật; bọc Session (§M.2), không có adapter riêng cho HttpClient.
- `LoginView.vue` rỗng.
- `Guards.ts` kiểm tra `meta.requiresAuth`, chỉ dùng `useAuth()` (không import store).
- `features/StoreScope/` stub: `useStoreScope()` bọc Session, `stores` cố định; `layouts/components/StoreSwitcher.vue` hiện tên Store.
- `useAuth()` bọc Session theo §M.2 (`login()` gọi API rồi `session.signIn()`, `logout()` = `session.logout()`); `Session.spec.ts` + `Runtime.spec.ts` (từ Step 3a) vẫn pass.
- `Guards.spec.ts` viết cùng step này (mock `@features/auth/UseAuth` theo §I).

### Tiêu chí hoàn thành

truy cập `/admin` khi chưa đăng nhập → chuyển về `/login`; `Guards.spec.ts` pass; `main.ts` chỉ một dòng; không còn `queryClient.clear()` ngoài `Session.ts` — kể cả trong `UseAuth.ts`, `UseStoreScope.ts` (§V.1).

### Phụ thuộc

- Blocked by: 06, 07, 08

### Ngoài phạm vi

- Những việc của các plan con khác trong [spec tổng](../foundation.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

### Kế hoạch thực hiện

#### Step 4 — Khung `features/auth`

**Làm gì**

**Kiểm tra:** truy cập `/admin` khi chưa đăng nhập → chuyển về `/login`; `Guards.spec.ts` pass; `main.ts` chỉ một dòng; không còn `queryClient.clear()` ngoài `Session.ts` — kể cả trong `UseAuth.ts`, `UseStoreScope.ts` (§V.1).

### Phần tham chiếu

Các đoạn dùng chung được giữ một lần ở scaffold plan; đây là tài liệu lịch sử, không phải quy tắc hiện hành.

- [Scaffold — f2-khung-feature-mới-copy-tay-chưa-có-generator](../reference/templates.md#f2-khung-feature-mới-copy-tay-chưa-có-generator)
- [Scaffold — q-cấu-trúc-từng-module](../reference/features.md#q-cấu-trúc-từng-module)

Bảng §Q.3 gồm shared module (`shared/`) và interface công khai của feature / `app/` mà nơi khác gọi tới. Chỉ các dòng `shared/` là shared module theo [GLOSSARY.md](../../../../GLOSSARY.md).

## Kết quả và review

Trạng thái: xong phần code, chờ review/merge
Nhánh / PR: `feat/auth-skeleton` (stacked trên `feat/i18n`)
Ngày hoàn thành: 2026-11-07

### Đã làm

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

### Kết quả kiểm tra

| Mục kiểm tra                                    | Kết quả | Ghi chú                                                                                                                  |
| ----------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| Chưa đăng nhập vào `/admin` → `/login`          | Pass    | Có ca trong `Guards.spec`; trên browser (Playwright): URL `/login?redirect=/admin`, h1 "Đăng nhập", không có lỗi console |
| `Guards.spec.ts` pass                           | Pass    | 5/5                                                                                                                      |
| `main.ts` chỉ một dòng                          | Pass    | Một dòng logic `createApp(App).use(createAppRuntime().plugin).mount('#app')`, cộng các import (trong đó có import CSS)   |
| `queryClient.clear()` chỉ có trong `Session.ts` | Pass    | grep: không có trong `UseAuth.ts` hay `UseStoreScope.ts`                                                                 |
| `Session.spec`, `Runtime.spec` vẫn pass         | Pass    |                                                                                                                          |
| test, lint, typecheck, build                    | Pass    | 113/113                                                                                                                  |

### Lệch so với plan / quyết định mới

- Thêm `ensureUser()` vào `useAuth()`. Lý do: sau F5 chỉ còn token, chưa có user, nên nếu không tải user trước thì guard kiểm tra quyền sẽ chuyển sai sang 403. Test đã chỉ ra trường hợp này.
- `useStoreScope()` trả thêm `current` (Store hiện tại), để `StoreSwitcher` không phải tự tìm Store trong danh sách.
- Chưa tạo `StoreScope/api/` vì danh sách Store đang là stub cố định. Sẽ thêm ở P3.
- Route `home` (`/admin`) hiện là trang trống. Dashboard thật làm ở P4.
- Trang 403 và 404 nằm trong `DashboardLayout` (`/admin/403`); 404 có thêm route bắt mọi đường dẫn.

### Việc còn tồn

- Login thật (form, validate) làm ở P2. Cần BE chốt dạng response của `/auth/login` và `/auth/me`.
- Token usage: chưa điền.
