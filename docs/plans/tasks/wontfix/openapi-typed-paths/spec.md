# Bật kiểu theo path OpenAPI cho HttpClient

Status: wontfix

## Quyết định (2026-11-29)

Không làm riêng. Việc kiểm kiểu request/response theo API Contract do [issue 06 của cms-architecture-design](../../todo/cms-architecture-design/issues/06-typed-endpoint-proof.md) đảm nhận theo [ADR 0003](../../../../adr/0003-backend-api-boundary.md); issue đó kiểm cả method, path, params, body và response, không chỉ bật `HasPaths`. Giữ hồ sơ này làm bối cảnh cho vấn đề tiền tố `/api/v1` và các endpoint chưa có trong contract.

## Vấn đề

`src/shared/lib/api/client/HttpClient.ts` đặt `type HasPaths = false`, nên path, body và response không được kiểm kiểu theo `paths` trong `Api.generated.ts`. Gọi sai endpoint hay đọc sai field vẫn qua typecheck; feature phải tự gán kiểu DTO bằng `as` ở boundary.

## Vì sao chưa bật được

1. Key trong `paths` có tiền tố `/api/v1` (`/api/v1/auth/login`), còn FE gọi `/auth/login` vì `baseURL` đã chứa `/api/v1`.
2. Nhiều endpoint FE gọi chưa có trong OpenAPI BE: `/orders`, `/customers`, `/inventory`, `/inventory/movements`, `/promotions`, `/roles`, `/permissions`, `/users`, `/stores`, `/settings/*`, `/products/bulk`.
3. Một số endpoint lệch tên: FE `/categories`, `/products` (admin) — BE `/admin/categories`, `/admin/products`.

## Hướng đề xuất

- Kiểu `paths` bỏ tiền tố `/api/v1` ở tầng type.
- Bật dần: path có trong OpenAPI thì kiểm kiểu, path khác tạm cho tự do (đánh dấu rõ là "chưa có contract").
- Đồng bộ tên endpoint admin với BE trước khi bật cho categories/products.
- Khi bật xong, bỏ các `as <Dto>` trong `features/*/api`.

## Comments
