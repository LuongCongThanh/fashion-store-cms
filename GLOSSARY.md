# Glossary

Thuật ngữ **kỹ thuật** của app CMS. Nghĩa nghiệp vụ (Product, Variant, Voucher, Order, Tài khoản nội bộ…) lấy từ [`be-demo/GLOSSARY.md`](../be-demo/GLOSSARY.md) theo [`GLOSSARY-MAP.md`](../GLOSSARY-MAP.md); không định nghĩa lại ở đây.

| Thuật ngữ          | Nghĩa                                                                                                                                                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Session**        | Ai đang đăng nhập (token) và hệ quả khi nó đổi (refresh, xoá cache, điều hướng login). Module `shared/lib/session/`. Không phải "thông tin tài khoản" — cái đó ở `features/auth`.                                                             |
| **App runtime**    | Toàn bộ object dựng một lần cho app (pinia, i18n, router, notifier, Session, HttpClient, QueryClient), do `createAppRuntime()` tạo. Prod và test dùng cùng hàm, khác nhau ở override.                                                       |
| **Shared module**  | Code dùng lại nằm trong `shared/`: có ít nhất 2 nơi dùng thật và không chứa tri thức nghiệp vụ. Code nghiệp vụ được nhiều feature dùng (VD upload media) không phải shared module — nó là interface công khai của feature đó (`useMedia()`). |
| **Access token**   | JWT ngắn hạn dùng trong header `Authorization` cho request được bảo vệ. CMS chỉ giữ token này trong bộ nhớ; không ghi vào Web Storage. Mang `roles[]` và `permissions[]` của Tài khoản nội bộ.                                               |
| **Refresh cookie** | Cookie `HttpOnly` do BE sở hữu, dùng để đổi Access token tại endpoint refresh. Không phải dữ liệu frontend có thể đọc hoặc gửi trong JSON body.                                                                                              |
| **Hết phiên**      | BE từ chối refresh token (401): người dùng phải đăng nhập lại. Không nhầm với Mất kết nối.                                                                                                                                                  |
| **Mất kết nối**    | Không tới được BE hoặc BE lỗi (mạng, timeout, 5xx). Phiên vẫn được giữ; người dùng thử lại. Không phải Hết phiên.                                                                                                                           |
| **Generated API**  | `Api.generated.ts` (ở `shared/lib/api/`), sinh từ OpenAPI của BE bằng `npm run gen:api`, không sửa tay. DTO chỉ import trong `features/<feature>/api/` và `shared/lib/api/`; mapper trong feature là nơi duy nhất đổi DTO → view model.             |

Đã bỏ (không còn trong phạm vi): Store, StoreScope, `X-Store-Id`, Promotion và Coupon (dùng **Voucher**), User và Staff user (dùng **Tài khoản nội bộ**), Content Page.
