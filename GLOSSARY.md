# Glossary

Thuật ngữ kỹ thuật dùng trong code và tài liệu của CMS. Khi đặt tên hoặc viết issue, dùng đúng các từ ở đây.

| Thuật ngữ         | Nghĩa                                                                                                                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Session**       | Ai đang đăng nhập (token) và đang quản lý Store nào, cùng hệ quả khi chúng đổi (refresh, xoá cache, điều hướng login). Module `shared/lib/session/`. Không phải "thông tin user" — cái đó ở `features/auth`.                                 |
| **App runtime**   | Toàn bộ object dựng một lần cho app (pinia, i18n, router, notifier, Session, HttpClient, QueryClient), do `createAppRuntime()` tạo. Prod và test dùng cùng hàm, khác nhau ở override.                                                        |
| **Store**         | Cửa hàng mà người dùng CMS đang quản lý (StoreScope) — không nhầm với Pinia store.                                                                                                                                                           |
| **Shared module** | Code dùng lại nằm trong `shared/`: có ít nhất 2 nơi dùng thật và không chứa tri thức nghiệp vụ. Code nghiệp vụ được nhiều feature dùng (VD upload media) không phải shared module — nó là interface công khai của feature đó (`useMedia()`). |
| **Content Page**  | Trang nội dung tĩnh hiển thị trên storefront (About, Policy…) do CMS soạn. Không nhầm với page/view của chính app CMS.                                                                                                                       |
