# Spec — Authentication backend integration

## Contract

Base URL browser: `/api/v1`; development proxy target: `http://localhost:8080`.

| Flow | Request | Kết quả CMS |
| --- | --- | --- |
| Login | `POST /auth/login` | Lưu `accessToken` trong memory, map `user`; chỉ nhận STAFF/ADMIN. |
| Restore/401 | `POST /auth/refresh`, body rỗng, `withCredentials` | Nhận access token mới và retry request một lần. |
| User | `GET /auth/me`, Bearer token | Đồng bộ Staff user và role. |
| Logout | `POST /auth/logout`, Bearer token | BE revoke refresh cookie; CMS luôn xoá memory/cache. |
| Forgot | `POST /auth/forgot-password` | Luôn hiển thị kết quả không tiết lộ email. |
| Reset | `POST /auth/reset-password` | Route `/reset-password?token=...` tạo mật khẩu mới. |

## Security invariants

- Không có refresh token hoặc access token trong `localStorage`/`sessionStorage`.
- Refresh request gửi cookie bởi browser (`withCredentials: true`), không gửi token trong JSON.
- Request 401 chỉ retry sau một refresh; refresh lỗi xoá local state và điều hướng login.
- Lần restore không có cookie là guest state bình thường, không toast lỗi.
- Frontend role gate chỉ cải thiện UX; BE vẫn là nguồn cưỡng chế quyền.

## Role matrix tạm thời

| Role | CMS access | UI permissions |
| --- | --- | --- |
| CUSTOMER | Không | Không có |
| STAFF | Có | `category:read`, `product:read` |
| ADMIN | Có | Toàn bộ |

Ma trận phải được thay bằng permission claims/endpoint BE khi API cung cấp contract đó.
