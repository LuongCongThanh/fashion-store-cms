# Guide — chạy và kiểm tra auth local

1. Chạy BE tại `http://localhost:8080`; xác nhận `http://localhost:8080/docs-json` trả OpenAPI.
2. Tại CMS, chạy `npm run dev`. Vite proxy `/api/v1` sang BE nên browser không gọi cổng 8080 trực tiếp.
3. Đăng nhập bằng một Staff user hoặc Admin user đã được BE provision. Customer sẽ bị từ chối khỏi CMS.
4. Tải lại trang: CMS gọi refresh qua cookie `HttpOnly`, sau đó lấy `/auth/me`.
5. Để cập nhật types sau khi BE đổi API: chạy `npm run gen:api`, sau đó `npm run typecheck`.

## Điều kiện hạ tầng

- Cookie refresh của BE phải phù hợp với host CMS và path `/api/v1` khi dùng proxy/reverse proxy.
- Nếu không dùng proxy mà gọi BE cross-origin, BE phải cho phép origin CMS, credentials và header `Authorization` qua CORS.

## Kiểm tra tối thiểu

- Sai password → message không hợp lệ, không retry refresh.
- F5 sau login → session khôi phục bằng refresh cookie.
- Access token hết hạn → request được refresh và retry đúng một lần.
- Logout → request sau đó không có Bearer token và cache bị xoá.
- Reset link có `?token=` → đổi password thành công.
