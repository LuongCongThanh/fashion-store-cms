# Đầu vào, bằng chứng và phương án cũ

> Lịch sử research đã superseded; chỉ giữ nguồn và đánh đổi, không dùng làm policy hiện hành.

## 1. Kết luận đề xuất (đã bị thay)

**Giữ feature modular hiện có, làm rõ trách nhiệm và siết public boundary theo nhu cầu.**
CMS đã có composition root, feature, layout, transport, mapper, query cache và test seam khá rõ.
Không có bằng chứng cần đổi đồng loạt `features → modules`, `shared/lib/api → integrations/backend`,
`test → testing` hoặc mọi tên TypeScript sang camelCase chỉ để giống Storefront.
Đây là đánh giá chi phí/lợi ích trên source hiện tại, không phải cấu trúc bắt buộc của Vue.

Nên thống nhất giữa các repository về **nguyên tắc**: tên tiếng Anh diễn đạt trách nhiệm,
owner nghiệp vụ rõ, transport có một nơi quản lý, public API được kiểm soát và test cạnh source.
Không cần đồng nhất từng tên folder giữa một Next.js storefront và một Vue back-office.

Ưu tiên thực tế:

1. Giữ `app/Runtime.ts` làm composition root và giữ `features` theo nghiệp vụ đã duyệt.
2. Giữ casing và suffix của CMS; chọn tên cụ thể thay vì thêm tầng kiến trúc chung chung.
3. Giữ query/HTTP/DTO mapping trong feature; chỉ tách module lớn khi có lý do thay đổi độc lập.
4. Phân ownership URL, query cache, form, local UI và session trước khi thêm store/composable.
5. Kiểm chính xác dependency và giới hạn lint; tránh hiểu whitelist theo tên file là danh sách public API đã duyệt.

Nguồn sở hữu hiện hành: [CONVENTIONS](../../guides/README.md), [kiến trúc CMS](../../architecture/README.md),
[plan tái cấu trúc đã duyệt](../../plans/api-restructure/README.md), [ESLint thực thi](../../../eslint.config.ts).
Tài liệu này không ghi đè các nguồn đó.

## 2. Đầu vào và cách diễn giải tài liệu Storefront

Đã đọc ba tài liệu của repository bên cạnh:

- [Kế hoạch migration Storefront](../../../../fe-ecommerce-nike-style/docs/plan/storefront-structure-migration.md).
- [Nghiên cứu naming Next.js](../../../../fe-ecommerce-nike-style/docs/research/nextjs-naming-conventions.md).
- [Nghiên cứu cấu trúc Next.js](../../../../fe-ecommerce-nike-style/docs/research/nextjs-storefront-structure.md).

Plan và phần quyết định cập nhật trong nghiên cứu naming sở hữu đích Storefront:
`modules`, `providers`, `layouts`, `integrations/backend`, `shared/components`, `testing`.
Một số kết luận khảo sát cũ phía dưới tài liệu vẫn nói giữ `features` hoặc `lib/api`;
không dùng chúng để phủ định phần quyết định mới ở đầu tài liệu.

| Nguyên tắc từ Storefront           | Áp dụng cho CMS                                    | Điều cần thích nghi                                                        |
| ---------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| Route/entry mỏng                   | Có: route khai báo URL/meta, view compose workflow | Vue Router khai báo route; không có Next special files/RSC                 |
| Business ownership                 | Có: `features/products`, `categories`, `orders`…   | Giữ tên domain CMS đã được plan C2 duyệt                                   |
| Providers tách khỏi route          | Có về trách nhiệm                                  | CMS đã có `createAppRuntime`; chưa cần root `providers/` mới               |
| Backend integration rõ             | Có                                                 | Transport dùng chung; endpoint, mapper, query thuộc feature hiện tại       |
| Public boundary và test cạnh owner | Có                                                 | CMS dùng facade `Use*.ts` và `*.spec.ts`, không phải mọi export đều public |
| CamelCase TS, folder kebab-case    | Không tự áp dụng                                   | Xung đột CONVENTIONS và ESLint CMS                                         |
| Server/client và SSR catalog       | Không chuyển nguyên mẫu                            | CMS hiện là SPA back-office, không yêu cầu SEO theo architecture           |

Nuxt UI có bản tích hợp Vue/Vite riêng; việc dùng `@nuxt/ui` **không biến CMS thành ứng dụng Nuxt**.
Nguồn: [Nuxt UI installation for Vue](https://ui.nuxt.com/docs/getting-started/installation/vue),
[config CMS](../../../vite.config.ts), [kiến trúc CMS](../../architecture/README.md).

## 3. Bằng chứng hiện trạng trong source

Các đường dẫn dưới đây là bằng chứng source, không phải cây đích đã triển khai đầy đủ.

| Owner/source đã đọc                                                                                          | Quan sát                                                                                | Hệ quả                                                             |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`src/app/Runtime.ts`](../../../src/app/Runtime.ts)                                                          | Dựng Pinia, i18n, router, notifier, QueryClient, Session, HttpClient; test có overrides | Giữ một composition root, tránh runtime/test wiring riêng          |
| [`src/app/router/Routes.ts`](../../../src/app/router/Routes.ts)                                              | Gom routes feature, gắn layout và fallback                                              | `app` là orchestration; không là kho nghiệp vụ                     |
| [`Products.routes.ts`](../../../src/features/products/Products.routes.ts)                                    | Lazy import view ngay trong route module feature                                        | Framework route thực tế không chỉ lazy-import view tại `Routes.ts` |
| [`ProductListView.vue`](../../../src/features/products/views/ProductListView.vue)                            | Compose query, URL list state, public auth/categories và UI con                         | View là boundary điều phối hợp lý                                  |
| [`Products.api.ts`](../../../src/features/products/api/Products.api.ts)                                      | `useQuery`, typed HTTP, query key reactive, DTO → model                                 | Một module nhỏ vẫn đủ; không bắt buộc thêm repository/service      |
| [`Product.mapper.ts`](../../../src/features/products/api/Product.mapper.ts)                                  | Mapper riêng của feature                                                                | Mapping đã có owner; không gom mọi mapper vào global integration   |
| [`CategoryEditor.api.ts`](../../../src/features/categories/api/CategoryEditor.api.ts)                        | Query/mutation theo workflow editor; invalidate prefix categories                       | Đã có ví dụ tách theo trách nhiệm, không chỉ theo CRUD entity      |
| [`UseCategories.ts`](../../../src/features/categories/UseCategories.ts)                                      | Public facade re-export query dùng bởi products                                         | Facade có consumer thật khác với barrel xuất toàn feature          |
| [`UseAuth.ts`](../../../src/features/auth/UseAuth.ts)                                                        | Điều phối auth API, store user, Session, quyền                                          | Auth nghiệp vụ không đồng nhất với token/session transport         |
| [`UseListState.ts`](../../../src/shared/composables/UseListState.ts)                                         | URL là nguồn list state; parse schema, debounce search, reset page                      | Không thêm Pinia copy của filter/page                              |
| [`Session.ts`](../../../src/shared/lib/session/Session.ts)                                                   | Refresh lifecycle, token bộ nhớ, logout clear query cache                               | Không chuyển token vào persistent store khi đổi cấu trúc           |
| [`QueryClient.ts`](../../../src/shared/lib/query/QueryClient.ts)                                             | Retry policy, staleTime, routing mutation error tập trung                               | Query ownership riêng với global error policy                      |
| [`vite.config.ts`](../../../vite.config.ts)                                                                  | Nuxt UI explicit import; PWA không cache API; Vite proxy                                | Di chuyển folder phải kiểm build/config và privacy behavior        |
| [`eslint.config.ts`](../../../eslint.config.ts) và [`eslint.config.spec.ts`](../../../eslint.config.spec.ts) | Naming, import boundaries, test boundary cases                                          | Convention cần executable enforcement, không chỉ cây thư mục       |

`features/products/UseProducts.ts` **chưa tồn tại** trong checkout đã đọc.
Không cần tạo public facade cho feature chưa có consumer bên ngoài.
`UseCategories.ts` tồn tại vì có consumer thật; không suy từ cây mẫu rằng mọi feature đều phải có facade.

Package manifest hiện khai báo Vue `^3.5.45`, Vue Router `^5.4.0`, Pinia `^4.1.0`,
TanStack Vue Query `^5.107.1`, Nuxt UI `^4.12.0`, Vite `^8.3.6`.
Đây là **range khai báo**, không phải xác nhận version đã resolve hoặc tương thích qua chạy thử.
Nguồn: [package.json](../../../package.json). Khi triển khai kiểm lockfile và API version thực tế;
tài liệu online có thể cập nhật độc lập, đường dẫn TanStack v5 hiện redirect sang `latest` và ghi v5.

## 4. Các lựa chọn kiến trúc và đánh đổi

| Lựa chọn                            | Điểm mạnh                                        | Chi phí/rủi ro tại CMS                                            | Khuyến nghị                                               |
| ----------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- | --------------------------------------------------------- |
| Feature modular hiện tại            | Gần owner domain, có lint/runtime/test seam      | Cần kiểm public surface và module quá lớn                         | **Chọn làm nền**                                          |
| Copy cây Storefront                 | Từ vựng folder giống nhau                        | Rename lớn; dễ kéo endpoint khỏi feature và phá DTO boundary      | Chỉ chọn tên mới nếu người dùng muốn và có lợi ích cụ thể |
| Chia toàn app theo technical layers | Dễ tìm mọi API/types một chỗ                     | Một nghiệp vụ trải nhiều folder; owner và dependency khó theo dõi | Không chuyển sang root `services/types/stores`            |
| FSD đầy đủ                          | Có luật layer/slice và public API mạnh           | Phải phân lại page/widget/entity/feature; không chỉ đổi tên       | Chưa có nhu cầu chứng minh chi phí                        |
| Clean/Hexagonal toàn feature        | Port có ích khi có adapter hoặc logic độc lập UI | Repository/service chuyển tiếp 1:1, contract và mock tăng         | Áp chọn lọc cho workflow phức tạp                         |
| Route colocation toàn bộ            | Gần màn hình                                     | Khó reuse các màn list/edit, auth, category picker                | Giữ route config và view; logic dùng chung thuộc feature  |

FSD quy định dependency giữa layer/slice; public API là contract có chủ đích.
CMS hiện không phải FSD nguyên bản chỉ vì có folder `features`.
Nguồn: [FSD layers](https://feature-sliced.design/docs/reference/layers),
[FSD public API](https://feature-sliced.design/docs/reference/public-api).

Dependency inversion nên dùng interface nhỏ khi thực sự có boundary cần thay adapter hoặc test độc lập.
CMS đã có ví dụ thực tế: `Session` nhận `callRefresh`, HttpClient nhận session/locale/transport;
không cần nhân bản dạng `ProductRepository → ProductService → Products.api` cho request đơn giản.
Đây là đánh giá thiết kế theo [Runtime](../../../src/app/Runtime.ts) và [CONVENTIONS §M](../../guides/README.md),
không tuyên bố Vue bắt buộc hoặc cấm class/repository.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
