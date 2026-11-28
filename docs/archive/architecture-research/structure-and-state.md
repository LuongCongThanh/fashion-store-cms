# Cây đích, naming và state đã bị thay

> Lịch sử research đã superseded; chỉ giữ nguồn và đánh đổi, không dùng làm policy hiện hành.

## 5. Cây đích khuyến nghị cho CMS (đã bị thay)

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
        Api.generated.ts          # Generated API, không sửa tay
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
Nguồn: [ESLint featureRows](../../../eslint.config.ts), [CONVENTIONS §Q](../../guides/README.md).

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

Nguồn: [CONVENTIONS §B](../../guides/README.md), [plan C2](../../plans/api-restructure/README.md),
[eslint naming SUFFIX](../../../eslint.config.ts), [Pinia store conventions](https://pinia.vuejs.org/core-concepts/).
C2 yêu cầu feature một từ; ví dụ tổng quát `AuditLogs/` trong CONVENTIONS không phải quyền
thay feature `audit` đã được duyệt bằng tên mới.

Giữ union/`as const` theo CONVENTIONS, không thêm enum hoặc root `enums/interfaces` chỉ để phân loại.
Giá trị API lấy từ Generated API; form schema thuộc input. Model vẫn khai báo độc lập theo §T.3,
không alias DTO; chỉ tạo mapper khi DTO và Model khác semantics.
Suffix `.service.ts`, `.queries.ts`, `.port.ts`, `.repository.ts` **chưa thuộc whitelist hiện tại**.
Nếu cần một vai trò mới, phải quyết định rõ trách nhiệm rồi sửa owner docs + ESLint + test naming;
không mặc định convention Storefront đã cho phép CMS dùng suffix đó.

Một phương án khác là camelCase cho `.ts`, `useX.ts`, kebab-case folder để đồng nhất Storefront.
Lợi ích chính là tính nhất quán xuyên repo; chi phí là mass rename, import/mock/glob churn và thay policy có chủ đích.
Chưa có bằng chứng lợi ích đủ lớn cho đợt này; chỉ triển khai nếu có quyết định riêng.
Rename khác hoa/thường cần bước `git mv` trung gian trên filesystem không phân biệt casing.
Nguồn: [CONVENTIONS §B.1](../../guides/README.md).

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

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
