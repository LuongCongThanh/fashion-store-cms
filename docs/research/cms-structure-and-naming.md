# Nghiên cứu cấu trúc và đặt tên cho CMS

> Cập nhật quyết định 26/11/2026: đã duyệt root `modules`, `integrations/backend`, `testing` và tên trách nhiệm tại [ADR 0001](../adr/0001-domain-workflows-and-vue-naming.md). Endpoint/request/mapping dữ liệu API thuộc `integrations/backend`; Vue Query/cache/invalidation thuộc `queries` trong module. Các phương án giữ root/path/API gộp bên dưới là lịch sử nghiên cứu, không thay thế quyết định mới; source/lint chưa migrate.

Ngày đối chiếu: **25/11/2026**. Trạng thái: **nghiên cứu và đề xuất; chưa ban hành quyết định mới**.
Phạm vi: Vue SPA, tổ chức nghiệp vụ, đặt tên, ownership state và boundary tích hợp Backend.

> Cập nhật sau phiên thiết kế 25/11/2026: người dùng đã duyệt tổ chức theo nghiệp vụ/workflow và naming Vue mới tại [ADR 0001](../adr/0001-domain-workflows-and-vue-naming.md). Khuyến nghị giữ toàn bộ PascalCase/folder cũ bên dưới là kết quả nghiên cứu trước quyết định đó; source/lint hiện hành chưa được migrate. Các lựa chọn root và API boundary vẫn đang thảo luận.
> Chỉ thêm tài liệu này; không di chuyển source, sửa convention/config, sinh contract, chạy migration, commit hoặc push.
> Khảo sát tĩnh ở checkout `dev`, đang chậm hơn remote-tracking `origin/dev` 3 commit tại lúc đọc; không pull.
> Không suy ra trạng thái remote/CI hoặc hành vi chạy thật từ khảo sát này.

## 1. Kết luận đề xuất

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

Nguồn sở hữu hiện hành: [CONVENTIONS](../CONVENTIONS.md), [kiến trúc CMS](../FE_architecture.md),
[plan tái cấu trúc đã duyệt](../plans/cms-restructure-plan.md), [ESLint thực thi](../../eslint.config.ts).
Tài liệu này không ghi đè các nguồn đó.

## 2. Đầu vào và cách diễn giải tài liệu Storefront

Đã đọc ba tài liệu của repository bên cạnh:

- [Kế hoạch migration Storefront](../../../fe-ecommerce-nike-style/docs/plan/storefront-structure-migration.md).
- [Nghiên cứu naming Next.js](../../../fe-ecommerce-nike-style/docs/research/nextjs-naming-conventions.md).
- [Nghiên cứu cấu trúc Next.js](../../../fe-ecommerce-nike-style/docs/research/nextjs-storefront-structure.md).

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
[config CMS](../../vite.config.ts), [kiến trúc CMS](../FE_architecture.md).

## 3. Bằng chứng hiện trạng trong source

Các đường dẫn dưới đây là bằng chứng source, không phải cây đích đã triển khai đầy đủ.

| Owner/source đã đọc                                                                                    | Quan sát                                                                                | Hệ quả                                                             |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`src/app/Runtime.ts`](../../src/app/Runtime.ts)                                                       | Dựng Pinia, i18n, router, notifier, QueryClient, Session, HttpClient; test có overrides | Giữ một composition root, tránh runtime/test wiring riêng          |
| [`src/app/router/Routes.ts`](../../src/app/router/Routes.ts)                                           | Gom routes feature, gắn layout và fallback                                              | `app` là orchestration; không là kho nghiệp vụ                     |
| [`Products.routes.ts`](../../src/features/products/Products.routes.ts)                                 | Lazy import view ngay trong route module feature                                        | Framework route thực tế không chỉ lazy-import view tại `Routes.ts` |
| [`ProductListView.vue`](../../src/features/products/views/ProductListView.vue)                         | Compose query, URL list state, public auth/categories và UI con                         | View là boundary điều phối hợp lý                                  |
| [`Products.api.ts`](../../src/features/products/api/Products.api.ts)                                   | `useQuery`, typed HTTP, query key reactive, DTO → model                                 | Một module nhỏ vẫn đủ; không bắt buộc thêm repository/service      |
| [`Product.mapper.ts`](../../src/features/products/api/Product.mapper.ts)                               | Mapper riêng của feature                                                                | Mapping đã có owner; không gom mọi mapper vào global integration   |
| [`CategoryEditor.api.ts`](../../src/features/categories/api/CategoryEditor.api.ts)                     | Query/mutation theo workflow editor; invalidate prefix categories                       | Đã có ví dụ tách theo trách nhiệm, không chỉ theo CRUD entity      |
| [`UseCategories.ts`](../../src/features/categories/UseCategories.ts)                                   | Public facade re-export query dùng bởi products                                         | Facade có consumer thật khác với barrel xuất toàn feature          |
| [`UseAuth.ts`](../../src/features/auth/UseAuth.ts)                                                     | Điều phối auth API, store user, Session, quyền                                          | Auth nghiệp vụ không đồng nhất với token/session transport         |
| [`UseListState.ts`](../../src/shared/composables/UseListState.ts)                                      | URL là nguồn list state; parse schema, debounce search, reset page                      | Không thêm Pinia copy của filter/page                              |
| [`Session.ts`](../../src/shared/lib/session/Session.ts)                                                | Refresh lifecycle, token bộ nhớ, logout clear query cache                               | Không chuyển token vào persistent store khi đổi cấu trúc           |
| [`QueryClient.ts`](../../src/shared/lib/query/QueryClient.ts)                                          | Retry policy, staleTime, routing mutation error tập trung                               | Query ownership riêng với global error policy                      |
| [`vite.config.ts`](../../vite.config.ts)                                                               | Nuxt UI explicit import; PWA không cache API; Vite proxy                                | Di chuyển folder phải kiểm build/config và privacy behavior        |
| [`eslint.config.ts`](../../eslint.config.ts) và [`eslint.config.spec.ts`](../../eslint.config.spec.ts) | Naming, import boundaries, test boundary cases                                          | Convention cần executable enforcement, không chỉ cây thư mục       |

`features/products/UseProducts.ts` **chưa tồn tại** trong checkout đã đọc.
Không cần tạo public facade cho feature chưa có consumer bên ngoài.
`UseCategories.ts` tồn tại vì có consumer thật; không suy từ cây mẫu rằng mọi feature đều phải có facade.

Package manifest hiện khai báo Vue `^3.5.45`, Vue Router `^5.4.0`, Pinia `^4.1.0`,
TanStack Vue Query `^5.107.1`, Nuxt UI `^4.12.0`, Vite `^8.3.6`.
Đây là **range khai báo**, không phải xác nhận version đã resolve hoặc tương thích qua chạy thử.
Nguồn: [package.json](../../package.json). Khi triển khai kiểm lockfile và API version thực tế;
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
Đây là đánh giá thiết kế theo [Runtime](../../src/app/Runtime.ts) và [CONVENTIONS §M](../CONVENTIONS.md),
không tuyên bố Vue bắt buộc hoặc cấm class/repository.

## 5. Cây đích khuyến nghị cho CMS

Cây dưới đây giữ phần lớn hiện trạng; chỉ thêm module khi code và consumer yêu cầu.
Không phải checklist tạo folder rỗng. `ProductList` là ví dụ tương lai có điều kiện.

```text
src/
  app/
    Runtime.ts                    # tạo và nối runtime duy nhất
    config/                       # Env.config.ts, Ui.config.ts
    providers/                    # adapter cài đặt global, như ErrorHandling.ts
    router/                       # Router.ts, Routes.ts, Guards.ts, RouteMeta.d.ts
    views/                        # NotFoundView.vue, ForbiddenView.vue
  features/
    auth/                         # UseAuth.ts, api/, stores/, schemas/, types/, views/
    products/
      Products.routes.ts
      api/
        Products.api.ts           # query/HTTP cho list, giữ nhỏ
        Product.mapper.ts
        ProductEditor.api.ts      # chỉ tách nếu workflow editor cần owner riêng
      components/                 # UI props/emits, theo policy hiện hành
      views/                      # ProductListView.vue, ProductEditView.vue
      schemas/                    # ProductList.schema.ts, form schema
      types/                      # Product.types.ts: model public thuần dữ liệu
      ProductList/                # tùy chọn khi một chức năng đủ lớn
        # chỉ áp dụng sau khi boundary/glob được cập nhật và kiểm chứng
    categories/
      UseCategories.ts            # facade public có consumer thật
    orders/
    inventory/
    accounts/
    roles/
    # các domain khác theo plan C2; không tạo trước contract/tier
  layouts/                        # DashboardLayout.vue, AuthLayout.vue, navigation
  shared/
    components/                   # page/, table/, form/, confirm/ theo consumer thật
    composables/                  # UseListState.ts, UseNotify.ts, UseTheme.ts…
    lib/
      api/
        Api.generated.ts          # generated contract, không sửa tay
        client/HttpClient.ts      # transport dùng chung
        errors/                   # ApiError, policy
      session/Session.ts          # lifecycle token/cache
      query/QueryClient.ts
      i18n/I18n.ts
      form/                       # chỉ khi có consumer thứ hai
    types/                        # contract kỹ thuật như Pagination.types.ts
    utils/                        # hàm thuần có trách nhiệm rõ; không đưa domain vào
  assets/
  locales/
  test/                           # Setup.ts, Render.ts, factories/; không gom spec vào đây
  App.vue
  main.ts
e2e/                              # hành trình app thật
```

Nếu một feature chỉ có vài module, giữ phẳng theo khung hiện có.
Khi chia chức năng thành `ProductList/`, phải cập nhật lint theo đường dẫn mới:
rule presentational hiện nhận `features/<x>/components/**`, không tự bao phủ
`features/<x>/ProductList/components/**`. Không tạo sự phân tầng chỉ tồn tại trong tài liệu.
Nguồn: [ESLint featureRows](../../eslint.config.ts), [CONVENTIONS §Q](../CONVENTIONS.md).

## 6. Đặt tên: giữ policy CMS, cải thiện nghĩa

Vue hướng dẫn dùng tên component đầy đủ và cho phép PascalCase hoặc kebab-case cho SFC;
không quy định tất cả `.ts` phải PascalCase. Composable theo convention hàm `useX`.
Nguồn: [Vue component naming](https://vuejs.org/style-guide/rules-strongly-recommended.html),
[Vue composables](https://vuejs.org/guide/reusability/composables.html).

Policy **đang có hiệu lực** của CMS cụ thể hơn tài liệu framework:

| Vai trò                | Khuyến nghị CMS                                                  | Lý do                                                              |
| ---------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| Feature domain         | `products`, `accounts`, `vouchers`, `inventory`                  | Một từ thường theo plan C2, danh từ theo nghiệp vụ                 |
| Folder nhiều từ nội bộ | `ProductList/` nếu thật sự cần                                   | Hợp pattern PascalCase của CMS; `product-list` hiện không hợp lint |
| Component/view/layout  | `ProductTable.vue`, `ProductListView.vue`, `DashboardLayout.vue` | Giữ nhận diện vai trò và convention hiện hành                      |
| Composable             | File `UseProductEditor.ts`, hàm `useProductEditor`               | Casing file và symbol khác nhau có chủ đích                        |
| API/query module       | `Products.api.ts`, `CategoryEditor.api.ts`                       | Tên entity hoặc workflow, không đặt `Service.ts` chung chung       |
| Mapper                 | `Product.mapper.ts`                                              | Chỉ đổi DTO → model ở owner API feature                            |
| Schema                 | `ProductList.schema.ts`, `Product.schema.ts`                     | Tách query/form input theo semantics                               |
| Type/interface         | `Product.types.ts`; symbol `Product`, không `IProduct`           | Type một consumer có thể đặt cạnh consumer                         |
| Store                  | `Auth.store.ts`, `useAuthStore`, id duy nhất                     | Giữ suffix CMS; không đặt store theo API endpoint                  |
| Module thuần           | `SafeRedirect.ts`, `CategoryTree.ts`                             | Đặt theo hành vi/trách nhiệm thay vì `Helpers.ts`                  |
| Test                   | `Product.mapper.spec.ts`, `UseAuth.spec.ts` cạnh source          | Giữ basename và glob Vitest hiện hành                              |
| Generated              | `Api.generated.ts`                                               | Generator sở hữu nội dung và output path                           |

Nguồn: [CONVENTIONS §B](../CONVENTIONS.md), [plan C2](../plans/cms-restructure-plan.md),
[eslint naming SUFFIX](../../eslint.config.ts), [Pinia store conventions](https://pinia.vuejs.org/core-concepts/).
C2 yêu cầu feature một từ; ví dụ tổng quát `AuditLogs/` trong CONVENTIONS không phải quyền
thay feature `audit` đã được duyệt bằng tên mới.

Giữ union/`as const` theo CONVENTIONS, không thêm enum hoặc root `enums/interfaces` chỉ để phân loại.
Giá trị API lấy từ generated contract; form schema thuộc input. Model vẫn khai báo độc lập theo §T.3,
không alias DTO; chỉ tạo mapper khi DTO và Model khác semantics.
Suffix `.service.ts`, `.queries.ts`, `.port.ts`, `.repository.ts` **chưa thuộc whitelist hiện tại**.
Nếu cần một vai trò mới, phải quyết định rõ trách nhiệm rồi sửa owner docs + ESLint + test naming;
không mặc định convention Storefront đã cho phép CMS dùng suffix đó.

Một phương án khác là camelCase cho `.ts`, `useX.ts`, kebab-case folder để đồng nhất Storefront.
Lợi ích chính là tính nhất quán xuyên repo; chi phí là mass rename, import/mock/glob churn và thay policy có chủ đích.
Chưa có bằng chứng lợi ích đủ lớn cho đợt này; chỉ triển khai nếu có quyết định riêng.
Rename khác hoa/thường cần bước `git mv` trung gian trên filesystem không phân biệt casing.
Nguồn: [CONVENTIONS §B.1](../CONVENTIONS.md).

## 7. Ownership state và workflow

| Loại state                           | Owner đề xuất                                         | Điều tránh                                      |
| ------------------------------------ | ----------------------------------------------------- | ----------------------------------------------- |
| Filter/search/page/sort có deep link | URL + `UseListState`, schema feature                  | Copy thêm vào Pinia rồi đồng bộ hai chiều       |
| Response list/detail và mutation     | TanStack Vue Query ở `*.api.ts`                       | Cache API thứ hai trong store                   |
| Form values, dirty/errors            | Form/view hoặc composable của workflow                | Bind trực tiếp query result vào form có thể sửa |
| Dialog, expanded row, selection tạm  | Local component/view; nâng scope khi có consumer thật | Global store cho mọi boolean                    |
| User/permissions                     | Feature auth qua public `useAuth`                     | UI tự suy quyền từ role name                    |
| Token/refresh/logout/cache cleanup   | Session được runtime inject                           | Web Storage token hoặc singleton ngoài runtime  |
| Locale/theme/notification            | Shared capability và runtime wiring hiện có           | Import `app` ngược từ shared/feature            |

Vue Query theo dõi reactive query key và `enabled`; giữ ref/getter thay vì đọc primitive quá sớm.
Query result là immutable; form cần bản nháp mutable và policy reset khi đổi entity/refetch.
Nguồn: [Vue Query reactivity](https://tanstack.com/query/v5/docs/framework/vue/reactivity).
Query key phải chứa input làm thay đổi dữ liệu; invalidation có thể theo prefix,
nhưng scope invalidate nên do feature sở hữu, không rải trong button/component.
Nguồn: [Query keys](https://tanstack.com/query/v5/docs/framework/vue/guides/query-keys),
[Query invalidation](https://tanstack.com/query/v5/docs/framework/vue/guides/query-invalidation).

Trường hợp mutation dài: view/composable điều phối form → mutation → phản hồi → điều hướng.
Chỉ tách hàm thuần có dependency nhỏ khi workflow có invariant đáng kiểm thử độc lập Vue.
Không dùng Pinia chỉ để giữ toàn bộ kết quả `useQuery`.
Auth hiện giữ user trong store là lựa chọn có lifecycle riêng; không đổi sang query trong migration cấu trúc.

## 8. API, public interface và dependency

Chiều phụ thuộc chủ đạo hiện tại là `main → app → layouts/features → shared`.
Đây là partial order: app có thể import feature route; layout có thể dùng public auth;
feature cũng có thể dùng **public** feature khác khi dependency có chủ đích, không tạo vòng.
[CONVENTIONS §A/§B.3](../CONVENTIONS.md), [ESLint BOUNDARIES](../../eslint.config.ts).

`UseCategories.ts` được phép làm facade export chọn lọc; tránh `index.ts` và re-export toàn bộ nội bộ.
Pattern hiện cho phép `Use[^/]*` và `types/[^/]+`: đây là whitelist theo đường dẫn khá rộng,
không kiểm symbol nào đã được phê duyệt hay ngăn dependency cycle.
Đề xuất ghi consumer/public symbol theo feature và bổ sung ca lint khi mở dependency;
chỉ chuyển sang explicit allowlist/cycle tooling khi inventory cho thấy cần, không thêm công cụ trước bằng chứng.

Có độ lệch nhỏ giữa lời văn và thực thi: CONVENTIONS nói views chỉ được import từ
`app/router/Routes.ts`, trong khi `Products.routes.ts` thực tế lazy-import view của chính nó,
và lint cho phép nội bộ feature. Nên làm rõ ngoại lệ **route module sở hữu feature** trong đợt docs/rules riêng;
không từ đó dời mọi view vào `app` hoặc đổi URL. Vue Router chính thức hỗ trợ route component bằng dynamic import.
Nguồn: [Products.routes.ts](../../src/features/products/Products.routes.ts),
[Vue Router lazy loading](https://router.vuejs.org/guide/advanced/lazy-loading.html).

Giữ HTTP dùng chung ở `shared/lib/api/client`, endpoint/query/mapper tại feature hiện hành.
Tách thành central `integrations/backend/endpoints` có thể hữu ích khi nhiều application dùng cùng SDK,
nhưng hiện sẽ đưa nghiệp vụ feature ra một global layer, đổi DTO/lint/test seam và làm tăng dependency surface.
Không có consumer SDK thứ hai được xác minh trong nghiên cứu này.

`Runtime.ts` inject `callRefresh: () => http.post(...)` cho Session trước khi khởi tạo `http`.
Closure chỉ chạy khi refresh xảy ra: đây là wiring trì hoãn có chủ đích,
không phải bằng chứng circular import cần xử lý bằng global singleton.
Phải giữ single-flight refresh, phân biệt 401 với lỗi mạng/5xx, cache cleanup và test isolation khi refactor.
Nguồn: [Runtime](../../src/app/Runtime.ts), [Session](../../src/shared/lib/session/Session.ts),
[HttpClient](../../src/shared/lib/api/client/HttpClient.ts).

TypeScript generated chỉ cung cấp type tĩnh, không tự kiểm JSON runtime.
Runtime validation mới cần thiết kế theo boundary/contract thực tế, không sao chép mọi DTO thành schema form.
Vite chỉ transpile TypeScript; vẫn giữ `vue-tsc`/typecheck riêng.
Nguồn: [Vite TypeScript](https://vite.dev/guide/features#typescript), [scripts CMS](../../package.json).
Nuxt UI cho phép tắt auto-import và import component/composable rõ ràng;
giữ cấu hình hiện tại và `Ui.config.ts` thay vì dùng auto-import để che import graph.
Nguồn: [Nuxt UI options](https://ui.nuxt.com/docs/getting-started/installation/vue).

## 9. Lộ trình và gates nếu được duyệt triển khai

| Đợt                        | Công việc                                                                                                 | Gate và tiêu chí chấp nhận                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 0. Xác nhận hiện trạng     | Kiểm branch/worktree/dirty files/remote/CI; inventory file, imports, public symbols, runtime và contract  | Không dùng snapshot research làm trạng thái mới nhất; giữ sửa đổi ngoài scope |
| 1. Chốt quyết định nhỏ     | Ghi giữ feature/naming; làm rõ route-module exception; chọn có cần allowlist public hơn không             | Owner docs, ESLint và `eslint.config.spec.ts` khớp nhau                       |
| 2. Pilot một workflow      | Chọn products list hoặc category editor; chỉ chia file khi có vấn đề cụ thể; giữ endpoint/model semantics | Không mass rename, đổi UI, contract hoặc auth trong cùng slice                |
| 3. Kiểm chứng pilot        | Test URL/debounce/page reset, query input/refetch, mapper, form error và permission bị tác động           | Lint, typecheck, test, build theo scripts repo; E2E đúng flow thay đổi        |
| 4. Mở rộng theo dependency | Áp mẫu đã chứng minh cho feature tiếp theo; chỉ đưa shared khi có consumer thứ hai                        | Không private imports, vòng dependency hay duplicate state/cache              |
| 5. Reconcile               | Xoá compatibility path nếu có, rà config/glob/mock/generated paths và docs                                | Tree hiện trạng đúng source, không folder rỗng hoặc policy chỉ viết trên giấy |

Giữ test `*.spec.ts` cạnh source và E2E root `e2e`; mock HTTP bằng `axios-mock-adapter`
qua runtime transport, hoặc mock module API/public facade đúng seam theo CONVENTIONS §I.
Không chuyển sang MSW để giống Storefront. Không tạo test chỉ kiểm tên file/type.
Plan tái cấu trúc đã duyệt có C11 hạn chế test mới trước Phase 7; nếu implementation nằm trong plan đó,
phải tuân gate/phase hiện hành thay vì coi bảng khuyến nghị này là quyền vượt quy trình.

Giữ C8: đơn hàng chỉ hiện hành động Backend trả qua `allowedActions[]`;
C17: chưa có contract thì không đoán DTO, endpoint hoặc dựng mock để lấp chức năng.
Thay đổi API xuyên repo phải theo flow contract của workspace tại thời điểm triển khai;
research này không cập nhật tag generated, không tự xác nhận các tier API đã sẵn sàng.
Nguồn: [plan CMS C8/C11/C17](../plans/cms-restructure-plan.md).

Các gate trên là đề xuất cho **implementation sau khi duyệt**, chưa được chạy trong nghiên cứu này.
Không báo hiệu năng tốt hơn từ rename; chỉ đo bundle/request nếu thực sự đổi loading hoặc query behavior.
Giá trị cần đạt là ít dependency mơ hồ hơn, ownership dễ tìm hơn và bảo toàn hành vi đang có.
