# Glossary

Thuật ngữ kỹ thuật dùng trong code và tài liệu của CMS. Khi đặt tên hoặc viết issue, dùng đúng các từ ở đây.

| Thuật ngữ         | Nghĩa                                                                                                                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Session**       | Ai đang đăng nhập (token) và đang quản lý Store nào, cùng hệ quả khi chúng đổi (refresh, xoá cache, điều hướng login). Module `shared/lib/session/`. Không phải "thông tin user" — cái đó ở `features/auth`.                                 |
| **App runtime**   | Toàn bộ object dựng một lần cho app (pinia, i18n, router, notifier, Session, HttpClient, QueryClient), do `createAppRuntime()` tạo. Prod và test dùng cùng hàm, khác nhau ở override.                                                        |
| **Store**         | Cửa hàng mà người dùng CMS đang quản lý (StoreScope) — không nhầm với Pinia store.                                                                                                                                                           |
| **Shared module** | Code dùng lại nằm trong `shared/`: có ít nhất 2 nơi dùng thật và không chứa tri thức nghiệp vụ. Code nghiệp vụ được nhiều feature dùng (VD upload media) không phải shared module — nó là interface công khai của feature đó (`useMedia()`). |
| **Content Page**  | Trang nội dung tĩnh hiển thị trên storefront (About, Policy…) do CMS soạn. Không nhầm với page/view của chính app CMS.                                                                                                                       |
| **Access token**  | JWT ngắn hạn dùng trong header `Authorization` cho request được bảo vệ. CMS chỉ giữ token này trong bộ nhớ; không ghi vào Web Storage.                                                                                                          |
| **Refresh cookie**| Cookie `HttpOnly` do BE sở hữu, dùng để đổi Access token tại endpoint refresh. Không phải dữ liệu frontend có thể đọc hoặc gửi trong JSON body.                                                                                                 |
| **Staff user**    | User có Role `STAFF` hoặc `ADMIN`, được phép truy cập CMS. Không nhầm với Customer, dù cả hai có thể xuất hiện trong response xác thực của BE.                                                                                                  |

## Catalog và vận hành

**Product**: Mẫu sản phẩm được giới thiệu và bán trong Store, có thể có nhiều lựa chọn kích thước hoặc màu.
_Avoid_: Dùng Product để chỉ riêng một SKU.

**Variant**: Một phiên bản bán được của Product, mang SKU, giá và tồn kho riêng. Product không có lựa chọn biến thể vẫn có một Variant mặc định.
_Avoid_: SKU ở cấp Product.

**Promotion**: Ưu đãi áp dụng cho giao dịch theo điều kiện và thời hạn xác định; có thể áp dụng tự động hoặc bằng mã.

**Coupon**: Một loại Promotion mà Customer phải cung cấp mã để sử dụng.
_Avoid_: Dùng Coupon để chỉ mọi Promotion.

**Customer**: Người mua hàng tại Store, có hồ sơ, địa chỉ và lịch sử Order.
_Avoid_: User khi nói về người mua.

**User**: Nhân viên hoặc người quản lý truy cập CMS, được gán Role và các Store được phép quản lý.
_Avoid_: Customer khi nói về tài khoản vận hành CMS.

**Stock Movement**: Một lần nhập, xuất hoặc điều chỉnh tồn kho của Variant, có số lượng, lý do và thông tin truy vết.
