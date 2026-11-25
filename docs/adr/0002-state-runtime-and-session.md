# Một runtime chung, state theo owner, session tách khỏi tài khoản

Status: accepted — Q12/Q13/Q17 duyệt ngày 26/11/2026. Chưa triển khai source. Tách ra từ [ADR 0001](0001-domain-workflows-and-vue-naming.md).

Vue Query sở hữu server state; URL sở hữu filter/search/page; form/composable sở hữu draft/dirty/errors; component hoặc màn hình sở hữu UI state cục bộ. Pinia chỉ giữ state chia sẻ có lý do, không sao chép query cache; refetch không ghi đè draft đang sửa.

Giữ một factory tại `app/runtime.ts` dùng cho cả production và test với overrides. Factory nối router, i18n, Pinia, Vue Query, HTTP và session; không tạo runtime/singleton thứ hai.

`integrations/backend/session` sở hữu token/refresh/kết thúc phiên; `modules/auth` sở hữu thông tin tài khoản/quyền và interface đăng nhập. `app/runtime` nối session với HTTP/router/cache.

## Các phương án đã cân nhắc

- **Pinia làm nguồn state chính, kể cả dữ liệu server**: một nơi tra state, nhưng phải tự đồng bộ cache, refetch và invalidation mà Vue Query đã làm.
- **Runtime riêng cho test**: test dựng nhanh hơn, nhưng lệch wiring production và che lỗi nối session/HTTP.
- **Session nằm trong `modules/auth`**: gần màn hình đăng nhập, nhưng HTTP client (integration) phải import ngược module nghiệp vụ để refresh token.
- **Runtime chung, state theo owner, session ở integration (chọn)**: một wiring cho production/test; HTTP và session cùng tầng integration; auth chỉ giữ dữ liệu tài khoản.

## Hệ quả

- Khi migrate phải giữ refresh single-flight, phân biệt Hết phiên với Mất kết nối và xoá token/cache khi đăng xuất.
- Một thay đổi về vòng đời phiên chạm `integrations/backend/session` và wiring ở `app/runtime`; `modules/auth` chỉ đổi khi dữ liệu tài khoản/quyền đổi. Đây là đánh đổi có chủ đích để HTTP không phụ thuộc module nghiệp vụ.
- Form có draft phải có test chứng minh refetch không ghi đè draft dirty (gate chung mục 4).
- GLOSSARY cập nhật vị trí của Session và App runtime khi issue 05 chuyển source.
