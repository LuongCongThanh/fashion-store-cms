# Report — Authentication backend integration

## Nguồn xác nhận

- OpenAPI: `http://localhost:8080/docs-json`, truy cập ngày 2026-11-10.
- API auth prefix: `/api/v1/auth`.
- Login trả `{ accessToken, user }`; refresh token là cookie `HttpOnly` và refresh trả `{ accessToken }`.

## Thay đổi

- Chuyển local API/proxy và OpenAPI generator sang port 8080.
- Sinh lại `src/shared/types/Api.generated.ts` từ Swagger.
- Thay Session persisted token bằng refresh-cookie flow; ghi ADR 0001.
- Gắn credentials cho HTTP, map error `{ statusCode, message, requestId }` của BE.
- Thêm mapper auth role, Customer gate, logout BE, restore route guard.
- Thêm reset-password route/view/schema/i18n; cập nhật test auth/session/HTTP/guard.

## Rủi ro / follow-up

- `STAFF` permissions là ma trận frontend tạm thời vì BE chưa công bố permission contract. BE vẫn phải cưỡng chế mọi quyền.
- Các feature CMS ngoài contract Swagger hiện chưa được tích hợp với BE, và không được suy đoán endpoint.
- Cần kiểm tra cookie domain/SameSite thực tế khi CMS không chạy sau proxy cùng origin.

## Validation

- 265 tests across 57 test files passed after obsolete MockAuth tests were removed.
- `npm run typecheck` passed.
- `npm run build` passed; Vite only reported the pre-existing large-chunk advisory.
