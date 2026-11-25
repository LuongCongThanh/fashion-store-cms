# Checklist coverage API Contract của CMS

Status: initial-inventory — chưa triển khai typed boundary. Các dòng dưới được ghi từ source hiện tại, chưa xác nhận khớp operation của Contract Version đã pin.

## Phạm vi và cách hoàn thiện

Issue 01 phải liệt kê **mọi Backend operation đang được source CMS gọi hoặc hỗ trợ**, không chỉ endpoint pilot. Bao gồm login/logout/refresh ở runtime, API trong mọi module, helper gọi HTTP và consumer trực tiếp. Chuẩn hoá method + contract path (kể cả prefix/baseURL/path params) sau khi đối chiếu generated `paths`; lưu mọi call site/owner, không chỉ grep string. Source đang gated vẫn phải có dòng và bằng chứng gating.

Bảng hiện mới có sáu call site auth/session đã đọc, không phải inventory hoàn chỉnh. Issue 01 bổ sung phần còn lại trước khi đóng. Không bỏ một operation khỏi bảng chỉ vì đã chuyển folder hoặc không có DTO import.

## Trạng thái

- `unverified`: chưa đối chiếu contract/call sites, không đạt gate.
- `legacy-untyped`: operation đã có contract nhưng còn path/body/response tự do hoặc ép kiểu che thiếu checking; chỉ được tồn tại trong slice chưa đến lượt, không đạt gate cuối.
- `typed`: method/path/path params/query/body/success response được nối với operation generated; có evidence signature/call sites và kiểm kiểu tương ứng, không chỉ annotation return type hoặc `as DTO`.
- `blocked-no-contract`: chưa có operation trong contract đã pin và chức năng vẫn bị chặn đúng policy; có call site/gate và ticket nhu cầu Backend, không được tính vào tổng typed.
- `external`: request ngoài Backend (ví dụ byte upload lên storage); ghi owner/adapter/test riêng, không ép vào generated Backend hoặc tính là typed Backend.
- `removed`: call site bị bỏ có lý do hợp lệ trong scope đã duyệt và evidence không còn consumer; không dùng để che chức năng đang cần giữ.

Nếu contract readiness không rõ thì giữ `unverified`; không tự phân `blocked-no-contract` từ việc thiếu generated type. Source migration không tự bump Contract Version hoặc mở tính năng pending.

## Bảng operation

| Method + path source hiện tại | Owner/call site                                                | Contract Version + generated operation/path | Request/response checking                           | Trạng thái | Slice chịu trách nhiệm | Evidence/gating                                           |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------- | ---------- | ---------------------- | --------------------------------------------------------- |
| POST /auth/login              | src/features/auth/api/Auth.api.ts:createAuthApi.login          | Chưa đối chiếu                              | Còn cast response LoginResponseDto                  | unverified | 06 (retrofit 05)       | Cần kiểm method/path/body/response và skipAuth            |
| GET /auth/me                  | src/features/auth/api/Auth.api.ts:createAuthApi.me             | Chưa đối chiếu                              | Còn cast response MeResponseDto                     | unverified | 06 (retrofit 05)       | Giữ AbortSignal và kiểm tài khoản CMS                     |
| POST /auth/forgot-password    | src/features/auth/api/Auth.api.ts:createAuthApi.forgotPassword | Chưa đối chiếu                              | HTTP transport hiện trả unknown                     | unverified | 06 (retrofit 05)       | Giữ skipAuth, không tiết lộ email                         |
| POST /auth/reset-password     | src/features/auth/api/Auth.api.ts:createAuthApi.resetPassword  | Chưa đối chiếu                              | Body có annotation nhưng path/response chưa checked | unverified | 06 (retrofit 05)       | Giữ skipAuth và error behavior                            |
| POST /auth/logout             | src/features/auth/api/Auth.api.ts:createAuthApi.logout         | Chưa đối chiếu                              | HTTP transport hiện trả unknown                     | unverified | 06 (retrofit 05)       | Giữ noRefresh và best-effort cleanup                      |
| POST /auth/refresh            | src/app/Runtime.ts:callRefresh                                 | Chưa đối chiếu                              | Còn cast Promise accessToken                        | unverified | 06 (retrofit 05)       | Không bỏ sót runtime callback; giữ single-flight/skipAuth |

Path ở cột đầu là request source, chưa phải xác nhận prefix/template trong generated contract. Issue 01 thêm operation các module và storage adapter rồi chốt normalized key trước khi dùng làm coverage denominator.

## Gate theo slice và toàn bộ migration

1. Issue 05 được phép giữ typing cũ trong thời gian chuyển runtime/auth, nhưng phải ghi trạng thái đúng và giao lại toàn bộ auth/session call sites cho issue 06.
2. Issue 06 proof cách nối typing, sau đó **retrofit mọi operation đã phát hành của auth/session đã chuyển ở 05**, bao gồm runtime refresh; chỉ đóng khi các dòng đó typed hoặc có evidence blocked-no-contract/removed hợp lệ. Contract gap không được che bằng cast.
3. Issue 07–14 phải đưa mọi operation Backend đã phát hành thuộc slice về typed trước khi đóng; cập nhật bảng và rà direct HTTP/casts trong source slice, kể cả wrapper và consumer chưa đổi tên. Không giới hạn vào một endpoint mẫu.
4. Kiểm compile-time request hợp lệ/sai tại typed boundary cho các nhóm signature liên quan (method/path/required params/query/body/success response, bodyless 204); không viết nhiều test trùng chỉ để đủ một test cho mỗi dòng. Runtime tests vẫn chứng minh refresh/errors/cancellation và mapper/form behavior riêng.
5. Issue 15 đối chiếu ngược source cuối với bảng: **100% operation Backend đã phát hành và còn được CMS sử dụng phải typed**. Không còn unverified/legacy-untyped; blocked-no-contract có evidence gating/ticket; external có adapter contract riêng. Báo số operation theo trạng thái và evidence, không suy coverage từ typecheck xanh hoặc generated diff không đổi.

`npm run gen:api` + generated diff chỉ chứng minh file contract đồng bộ, không chứng minh tất cả caller dùng typed boundary. `as DTO`, generic tuỳ ý do caller chọn hoặc disable typechecking không phải evidence đạt yêu cầu.

Tham khảo [spec delivery](spec.md), [thiết kế đã duyệt](../../docs/plans/cms-structure-migration.md), [issue 06](issues/06-typed-endpoint-proof.md), [issue 15](issues/15-final-reconcile.md).
