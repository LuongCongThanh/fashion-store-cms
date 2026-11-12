# Decisions — Authentication backend integration

Quyết định khó đảo ngược của feature auth. Mỗi mục ghi bối cảnh, lựa chọn và hệ quả để người đọc sau hiểu vì sao.

## D1 — Refresh cookie và access token trong bộ nhớ

Chốt: 2026-11-10.

**Bối cảnh.** BE trả access token sau login/refresh, nhưng đặt refresh token bằng cookie `HttpOnly` và chỉ xoay cookie đó ở `POST /api/v1/auth/refresh`. CMS cần khôi phục phiên sau khi tải lại trang mà không cho JavaScript truy cập refresh token.

**Quyết định.** CMS chỉ giữ access token trong bộ nhớ. Axios gửi request có credentials để trình duyệt tự đính refresh cookie. Khi khởi động app hoặc nhận 401 từ request được bảo vệ, CMS gọi refresh không body, lấy access token mới và chỉ thử lại request gốc một lần. CMS không ghi token nào vào `localStorage` hay `sessionStorage`. Logout gọi BE để thu hồi cookie, rồi xoá state và cache cục bộ ngay cả khi request logout lỗi.

**Hệ quả.**

- Tải lại trang cần một refresh request trước khi khôi phục user và route được bảo vệ; app hiện skeleton trong lúc chờ.
- BE phải cho phép origin CMS gửi credential cookie qua CORS ở môi trường không dùng proxy cùng origin.
- Không có refresh token nào lộ ra cho JavaScript hoặc persisted storage.
- "Remember me" không còn thuộc frontend; thời hạn cookie do BE quyết định.

## D2 — Chỉ 401 từ refresh mới là Hết phiên

Chốt: 2026-11-11.

**Bối cảnh.** BE trả 401 khi refresh token thiếu, sai hoặc hết hạn. Lỗi mạng hoặc 5xx khi refresh không nói gì về phiên: cookie có thể vẫn hợp lệ. Trước đây CMS coi mọi lỗi refresh là Hết phiên, nên wifi chập lúc F5 cũng đăng xuất người dùng và có thể làm mất dữ liệu đang nhập.

**Quyết định.** Chỉ khi `/auth/refresh` trả 401 thì CMS mới xoá access token, báo Hết phiên và đưa về trang login. Lỗi mạng hoặc 5xx được ném tiếp: request gốc báo lỗi mạng như bình thường, phiên được giữ để người dùng thử lại. Tương tự, `/auth/me` chỉ kết thúc phiên khi trả 401/403.

**Hệ quả.**

- Mất kết nối và Hết phiên là hai trạng thái khác nhau với thông báo khác nhau (xem GLOSSARY).
- Nếu khởi động app gặp lỗi mạng khi refresh, app hiện màn lỗi có nút tải lại thay vì trang login.
- Logout dùng `noRefresh`: phiên đã chết thì logout không kích hoạt refresh hay toast Hết phiên.
