# Plan tổng — Authentication backend integration

Kết nối CMS với xác thực của BE: đăng nhập, khôi phục phiên bằng refresh cookie, đăng xuất, quên và đặt lại mật khẩu. Chỉ Staff user (`STAFF`, `ADMIN`) truy cập CMS.

Trạng thái: done — PR #58.

| File | Nội dung |
| --- | --- |
| [spec.md](./auth-backend-integration/spec.md) | Contract API, security invariants, ma trận quyền tạm thời |
| [plan.md](./auth-backend-integration/plan.md) | Mục tiêu, phạm vi, các bước thực hiện |
| [decisions.md](./auth-backend-integration/decisions.md) | Quyết định khó đảo ngược (D1 lưu phiên, D2 Hết phiên) |
| [report.md](./auth-backend-integration/report.md) | Kết quả, rủi ro, cách chạy local, số liệu |

Follow-up: bật kiểu theo path của OpenAPI cho HttpClient — `.scratch/openapi-typed-paths/spec.md`.
