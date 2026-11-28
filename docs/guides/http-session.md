# HTTP client và Session

> Policy hiện hành cho source chưa migrate; xem [ADR](../adr/0001-domain-workflows-and-vue-naming.md) cho phần đã chuyển.

## HTTP client và seam với auth

`shared/lib/` không được import `features/`. HttpClient nhận auth qua một collaborator `Session` (`shared/lib/session/`) và locale qua `getLocale`; mọi thứ được nối trong `createAppRuntime()` (`app/Runtime.ts`, D37).

## Interface hẹp, không lộ axios

> Nguồn: [`src/shared/lib/api/client/HttpClient.ts`](../../src/shared/lib/api/client/HttpClient.ts) — tài liệu không chép lại code, đọc file.

- Không trả `AxiosInstance`: caller không đổi được `validateStatus`, không gắn interceptor riêng, không đi vòng qua chuẩn hoá lỗi. Thay transport tập trung ở `HttpClient.ts`, giữ interface của caller.
- `HTTP_CLIENT_KEY` và `useHttpClient()` nằm chung `HttpClient.ts` (một module, một file interface).
- `HttpClientDeps` không có kiểu axios. Test thay transport bằng `deps.transport` (qua `createAppRuntime({ transport })`), không có hàm nội bộ riêng cho test.
- **Một module** (`HttpClient.ts`): không tách `AxiosTransport` / `RefreshQueue` / `NormalizeError`, không cần rule ESLint `noClientInternals` (D40). Chỉ tách khi file > ~300 dòng **và** phần tách ra có spec riêng có ích.
- `skipAuth` là cách duy nhất để gọi API không kèm token; refresh vì thế vẫn có `Accept-Language` và lỗi vẫn là `ApiError`.
- Generated API đã tồn tại, nhưng `HasPaths = false` trong HttpClient vẫn cho path tự do và body/response kiểu `unknown`. Chạy generator không tự bật kiểm kiểu caller. Hướng typing mới và proof trước pilot thuộc [ADR 0003](../adr/0003-backend-api-boundary.md).
- `OPENAPI_URL` trong `.env.development` pin asset `openapi.json` của một tag `openapi-v*` của be-demo. Đổi hợp đồng = đổi tag ở đây rồi chạy `npm run gen:api`; job CI `openapi-contract` sinh lại và fail khi `Api.generated.ts` lệch. Muốn sinh từ BE local thì ghi đè `OPENAPI_URL` trong `.env.local`.
- Flow Contract Version/Breaking Change/merge order theo [workspace](../../../shared/agents/workspace.md). Automation thực thi ở [contract-bump.yml](../../.github/workflows/contract-bump.yml) và [contract-bump.sh](../../scripts/contract-bump.sh); không chép thêm một policy bump tag khác ở đây.
- Quyền: `Permission` là enum của API (`shared/lib/api/Permission.ts`). `meta.permission`, `can()` và widget chỉ nhận `Permission` hoặc `PendingPermission` (quyền của màn hình chưa có API, không bao giờ được cấp). Không tự đặt chuỗi quyền mới, không kiểm theo tên Vai trò.
- Upload ảnh trực tiếp lên storage không qua HttpClient: [ProductImages.api.ts](../../src/features/products/api/ProductImages.api.ts) dùng XHR POST với fields/file, có progress và hủy, không gắn token/credentials. [Form và ảnh](../architecture/README.md) giữ mô tả lifecycle.

## Session và composition root

**Session** = ai đang đăng nhập (token) và điều xảy ra khi token đổi. Một module sâu ở `shared/lib/session/Session.ts`, không phụ thuộc Vue context (interceptor gọi nó ngoài `setup`):

> Nguồn: [`src/shared/lib/session/Session.ts`](../../src/shared/lib/session/Session.ts) — tài liệu không chép lại code, đọc file.

- State nằm trong `useSessionStore` (Pinia, nội bộ `session/`), chỉ gồm token. Thông tin user nằm ở `features/auth`.
- `features/auth` **bọc** Session: `useAuth().login()` gọi API rồi `session.signIn()`; `useAuth().logout()` thu hồi refresh cookie theo best-effort, xóa user rồi gọi `session.logout()`. Không còn `createAuthAdapter`.
- Xoá cache khi logout chỉ xảy ra **trong Session** — một chỗ duy nhất.
- Composable lấy Session qua `useSession()` (inject); Vue component không gọi `useSessionStore` trực tiếp.

**Composition root — `createAppRuntime()` (D37):**

> Nguồn: [`src/app/Runtime.ts`](../../src/app/Runtime.ts) — tài liệu không chép lại code, đọc file.

> Nguồn: [`src/main.ts`](../../src/main.ts) — tài liệu không chép lại code, đọc file.

- `transport` là override nội bộ dành cho test (không lộ kiểu axios ra feature).
- Một cách duy nhất: `*.api.ts` lấy client bằng `useHttpClient()` trong composable; không nhận client làm tham số, không import singleton.
- `Runtime.spec.ts`: dựng runtime với transport mock → request có token + `Accept-Language`; `authFailure` điều hướng về `auth.login`. Đây là test cho wiring prod.

## Một Store, không có header Store

- Hệ thống chỉ có **một Store**: không có khái niệm Store đang quản lý, không có `StoreScope`, `switchStore` hay `storeId`, và HttpClient **không** gửi header `X-Store-Id`.
- Query key không chứa Store (`['products', 'list', params]`); file `*.api.ts` không cần tham số Store.
- Session chỉ giữ access token; `localStorage` không còn key `cms.session.storeId` (bootstrap Session xoá key cũ còn sót).

---

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../README.md).
