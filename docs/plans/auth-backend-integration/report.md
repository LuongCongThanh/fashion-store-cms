# Report — Authentication backend integration

## Nguồn xác nhận

- OpenAPI: `http://localhost:8080/docs-json`, truy cập ngày 2026-11-10.
- API auth prefix: `/api/v1/auth`.
- Login trả `{ accessToken, user }`; refresh token là cookie `HttpOnly` và refresh trả `{ accessToken }`.

## Thay đổi

- Chuyển local API/proxy và OpenAPI generator sang port 8080.
- Sinh lại `src/shared/types/Api.generated.ts` từ Swagger.
- Thay Session persisted token bằng refresh-cookie flow (xem [decisions.md](./decisions.md) D1).
- Gắn credentials cho HTTP, map error `{ statusCode, message, requestId }` của BE.
- Thêm mapper auth role, Customer gate, logout BE, restore route guard.
- Thêm reset-password route/view/schema/i18n; cập nhật test auth/session/HTTP/guard.

## Rủi ro / follow-up

- `STAFF` permissions là ma trận frontend tạm thời vì BE chưa công bố permission contract. BE vẫn phải cưỡng chế mọi quyền.
- Các feature CMS ngoài contract Swagger hiện chưa được tích hợp với BE, và không được suy đoán endpoint.
- Cần kiểm tra cookie domain/SameSite thực tế khi CMS không chạy sau proxy cùng origin.

## Thay đổi sau review (2026-11-11)

- Sửa race khi `restore()` và `refresh()` dùng chung một lượt refresh: `authFailure` phát nếu bất kỳ caller nào cần.
- Chỉ 401 từ refresh mới là Hết phiên; lỗi mạng/5xx giữ phiên ([decisions.md](./decisions.md) D2).
- Route reset-password bỏ `guestOnly`; báo tại chỗ khi link thiếu token hoặc BE trả 400 (token sai/hết hạn/đã dùng).
- Thu hồi refresh cookie khi tài khoản CUSTOMER đăng nhập và khi khôi phục phiên thất bại.
- Logout best-effort với `noRefresh`; màn skeleton/lỗi khi khởi động thay cho màn trắng.
- Tách `Auth.mapper.ts` với ma trận quyền theo role (ADMIN dùng wildcard); test gán user qua `renderWithPlugins({ user })`.

## Validation

- 283 tests across 59 test files passed.
- `npm run typecheck`, `npm run lint`, `npm run format:check` passed.
- `npm run build` passed; Vite only reported the pre-existing large-chunk advisory.

## Chạy và kiểm tra local

1. Chạy BE tại `http://localhost:8080`; xác nhận `http://localhost:8080/docs-json` trả OpenAPI.
2. Tại CMS, chạy `npm run dev`. Vite proxy `/api/v1` sang BE nên browser không gọi cổng 8080 trực tiếp.
3. Đăng nhập bằng một Staff user hoặc Admin user đã được BE provision. Customer sẽ bị từ chối khỏi CMS.
4. Tải lại trang: CMS gọi refresh qua cookie `HttpOnly`, sau đó lấy `/auth/me`.
5. Để cập nhật types sau khi BE đổi API: chạy `npm run gen:api`, sau đó `npm run typecheck`.

### Điều kiện hạ tầng

- Cookie refresh của BE phải phù hợp với host CMS và path `/api/v1` khi dùng proxy/reverse proxy.
- Nếu không dùng proxy mà gọi BE cross-origin, BE phải cho phép origin CMS, credentials và header `Authorization` qua CORS.

### Kiểm tra tối thiểu

- Sai password → message không hợp lệ, không retry refresh.
- F5 sau login → session khôi phục bằng refresh cookie.
- Access token hết hạn → request được refresh và retry đúng một lần.
- Logout → request sau đó không có Bearer token và cache bị xoá.
- Reset link có `?token=` → đổi password thành công.

## Số liệu

## Acceptance metrics

| Metric | Target | Measurement |
| --- | --- | --- |
| Type safety | 0 TypeScript errors | `npm run typecheck` |
| Auth unit tests | 100% selected auth/session/http/guard specs pass | Vitest command in report |
| Access-token persistence | 0 Web Storage writes | Session unit test + code review |
| Refresh duplication | 1 request for concurrent 401s | Session/HTTP unit tests |
| Unauthorized CMS access | 0 Customer sessions reach dashboard | role gate unit/integration coverage |

### Operational metrics to add after deploy

- Login success/failure rate by role, without recording credentials.
- Refresh success rate and 401-after-retry rate.
- Logout revoke failure rate.
- Password reset completion rate.
- 403 rate split by `STAFF` and `ADMIN`.
