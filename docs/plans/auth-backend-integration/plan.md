# Plan — tích hợp xác thực với BE

## Mục tiêu

Kết nối CMS với BE tại `http://localhost:8080`, dùng contract OpenAPI ở `/docs-json`, và thay auth skeleton bằng phiên JWT an toàn cho CMS.

## Phạm vi đã chốt

1. Chỉ `STAFF` và `ADMIN` truy cập CMS; `CUSTOMER` bị từ chối sau login.
2. Access token chỉ ở memory; refresh token là cookie `HttpOnly` của BE.
3. Login, refresh, logout, `/auth/me`, forgot password và reset password.
4. `ADMIN` toàn quyền UI; `STAFF` có ma trận quyền đọc tạm thời cho categories/products.
5. Local dùng Vite proxy `/api/v1` đến `localhost:8080`; production dùng reverse proxy cùng origin.

## Thực hiện

- Sinh `Api.generated.ts` từ OpenAPI hiện tại.
- Cập nhật Session, HTTP interceptors và route guard.
- Mapper DTO auth → `CurrentUser`, adapter lỗi BE và role gate.
- Bổ sung reset password route/view/schema/i18n.
- Viết/điều chỉnh unit tests, typecheck và build.

## Ngoài phạm vi

Các API CMS cho orders, inventory, promotions, users, roles, settings, media và dashboard chưa có trong OpenAPI BE hiện tại; không đổi chúng thành endpoint suy đoán.
