# 0001 — Refresh cookie và access token trong bộ nhớ

## Status

Accepted — 2026-11-10

## Context

BE trả access token sau login/refresh, nhưng đặt refresh token bằng cookie `HttpOnly` và chỉ xoay cookie đó ở `POST /api/v1/auth/refresh`. CMS cần khôi phục phiên sau khi tải lại trang mà không cho JavaScript truy cập refresh token.

## Decision

CMS chỉ giữ access token trong bộ nhớ. Axios gửi request có credentials để trình duyệt tự đính refresh cookie. Khi khởi động app hoặc nhận 401 từ request được bảo vệ, CMS gọi refresh không body, lấy access token mới và chỉ thử lại request gốc một lần.

CMS không ghi access token hoặc refresh token vào `localStorage` hay `sessionStorage`. Logout gọi BE để thu hồi cookie, rồi xoá state và cache cục bộ ngay cả khi request logout lỗi.

## Consequences

- Tải lại trang cần một refresh request trước khi khôi phục user/route được bảo vệ.
- BE phải cho phép origin CMS gửi credential cookie qua CORS ở môi trường local và production.
- Không có refresh token nào lộ ra cho JavaScript hoặc persisted storage.
- Tùy chọn "Remember me" không còn là ownership của frontend; thời hạn cookie do BE quyết định.
