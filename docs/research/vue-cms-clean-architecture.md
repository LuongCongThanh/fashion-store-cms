# Vue CMS: clean code và kiến trúc theo nghiệp vụ

> Tài liệu research hiện hành. Quyết định nằm ở [ADR 0001](../adr/0001-domain-workflows-and-vue-naming.md), [0002](../adr/0002-state-runtime-and-session.md), [0003](../adr/0003-backend-api-boundary.md); tài liệu này giữ nguồn và đánh đổi. [Nghiên cứu ngày 25/11](cms-structure-and-naming.md) đã superseded. Các phương án bị loại bên dưới được ghi để tra lý do; source/lint chưa migrate.

Ngày đối chiếu: **26/11/2026**. Phạm vi: toàn repository CMS, giữ Vue SPA + Vite và baseline UI/hành vi.
Đây là nghiên cứu và đề xuất migration; không phải báo cáo đã refactor, kiểm API thật hoặc đo hiệu năng.
Các dòng ghi **Đề xuất** là nhận định thiết kế cho CMS; nguồn framework không ban hành cây thư mục này.

## 1. Quyết định đích và nguồn hiện hành

Người dùng đã duyệt **domain-first**, chia tiếp theo workflow khi cần; folder kebab-case,
`.vue` PascalCase, composable `useCamelCase.ts`, TypeScript khác camelCase,
role suffix như `.schema.ts`, `.types.ts`, `.store.ts`; test `.spec.ts` cạnh source.
Quyết định được ghi tại [ADR domain/workflow/naming](../adr/0001-domain-workflows-and-vue-naming.md),
thay thế khuyến nghị giữ toàn bộ PascalCase của
[nghiên cứu trước](cms-structure-and-naming.md) **đối với đích migration**.

Source hiện tại vẫn chịu [CONVENTIONS](../CONVENTIONS.md), [FE_architecture](../FE_architecture.md)
và [ESLint](../../eslint.config.ts) cho đến khi implementation cập nhật chúng cùng nhau.
Không áp naming mới lẻ tẻ vào code rồi coi lỗi lint là lý do tắt rule.
Đề xuất dùng domain-first như nguyên tắc ownership; tên root `features` hay `modules` là quyết định riêng,
không phải hệ quả bắt buộc của Vue hoặc domain-first.

Stack thực tế được khai báo trong [package.json](../../package.json) và [vite.config.ts](../../vite.config.ts):
Vue, Vue Router, Pinia, TanStack Vue Query, Nuxt UI tích hợp Vite, Zod, Vitest và Playwright.
Đây là dependency ranges, chưa xác nhận installed/resolved versions qua runtime.
Vite transpile TypeScript; giữ bước `vue-tsc` riêng như scripts hiện tại.
Nguồn: [Vite TypeScript](https://vite.dev/guide/features#typescript), [scripts CMS](../../package.json).

## 2. Clean/Hexagonal thực sự giúp gì

Clean Architecture đặt chiều dependency của source hướng vào policy; dữ liệu qua boundary nên độc lập
với chi tiết framework/database. Bài gốc không bắt frontend phải có một cây folder cụ thể.
Nguồn: [Robert C. Martin, The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).
Hexagonal tách ứng dụng khỏi thiết bị ngoài qua ports/adapters để chạy và kiểm thử độc lập.
Nguồn: [Alistair Cockburn, bài gốc 2005](https://alistair.cockburn.us/hexagonal-architecture).

**Đề xuất:** dùng modular Vue theo domain làm nền; chọn lọc hàm thuần và use case độc lập Vue
cho workflow có invariant/điều phối thực sự. CRUD đơn giản có thể là query composable + HTTP + mapper.
Không bắt buộc `Repository → Service → UseCase → Controller` chuyển tiếp cùng một payload.
Đây là trade-off cho CMS, không phải tuyên bố Clean cấm class hay Vue cấm repository.

| Phương án                              | Giá trị                                | Chi phí ở CMS                            | Đề xuất                             |
| -------------------------------------- | -------------------------------------- | ---------------------------------------- | ----------------------------------- |
| Domain-first modular Vue               | Owner nghiệp vụ và workflow ở gần nhau | Cần public boundary rõ                   | Làm nền                             |
| Modular + pure rules/use case chọn lọc | Test logic không cần mount Vue         | Phải xác định đúng policy thuộc CMS      | Áp dụng khi có logic thật           |
| Full Clean mọi domain                  | Dependency inversion đồng nhất         | Adapter/interface/DTO lặp cho CRUD nhỏ   | Chưa có bằng chứng cần toàn bộ      |
| Full FSD                               | Luật layer/slice/public API tường minh | Phân lại pages/widgets/features/entities | Không chọn chỉ để có cấu trúc chuẩn |
| Root services/types/stores             | Gom theo kỹ thuật dễ lúc đầu           | Một thay đổi nghiệp vụ trải nhiều root   | Tránh làm nền                       |

FSD có luật import layer/slice riêng; CMS có folder `features` chưa có nghĩa đang theo FSD.
Nguồn: [FSD layers](https://feature-sliced.design/docs/reference/layers).
Cây đích phía dưới là **đề xuất CMS**, không tự nhận tuân Full Clean/FSD.

## 3. Bằng chứng hiện tại cần bảo toàn

| Source owner                                                                 | Hiện trạng quan sát                                            | Giá trị cần giữ                           |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| [Runtime.ts](../../src/app/Runtime.ts)                                       | Một composition root, overrides cho test                       | Không thêm singleton runtime thứ hai      |
| [Products.api.ts](../../src/features/products/api/Products.api.ts)           | Query key reactive, request có AbortSignal, mapping phân trang | Hành vi list và cancellation              |
| [ProductEditor.api.ts](../../src/features/products/api/ProductEditor.api.ts) | Detail/query, mutations, invalidation, payload typed           | Không đổi endpoint/payload khi đổi folder |
| [Product.mapper.ts](../../src/features/products/api/Product.mapper.ts)       | DTO → model trong domain products                              | DTO không rò vào mọi view                 |
| [UseCategories.ts](../../src/features/categories/UseCategories.ts)           | Public facade dùng qua domain                                  | Boundary theo consumer thật               |
| [UseListState.ts](../../src/shared/composables/UseListState.ts)              | Query URL và debounce/reset pagination                         | Deep link, Back/Forward                   |
| [Session.ts](../../src/shared/lib/session/Session.ts)                        | Refresh/logout và cache lifecycle                              | Session isolation và logout cleanup       |
| [QueryClient.ts](../../src/shared/lib/query/QueryClient.ts)                  | Retry/staleTime/error routing tập trung                        | Một chính sách lỗi toàn app               |
| [Routes.ts](../../src/app/router/Routes.ts)                                  | Composition routes/layout/fallback                             | URL và quyền truy cập                     |
| [vite.config.ts](../../vite.config.ts)                                       | Explicit UI imports, PWA config                                | Giữ loading/privacy behavior              |

Không kết luận tính đúng đắn lúc chạy từ khảo sát tĩnh này.
Baseline giao diện thuộc [DESIGN.md](../../DESIGN.md); thay tổ chức code không phải quyền redesign UI.

## 4. Nghiệp vụ quyết định boundary

Tài liệu business là **yêu cầu đích**, không chứng minh endpoint đã release.
Nguồn scope: [01 vision/scope](../../../be-demo/docs/business/01-vision-scope.md),
[02 actors/permissions](../../../be-demo/docs/business/02-actors-permissions.md),
[03 user stories](../../../be-demo/docs/business/03-user-stories.md),
[04 rules](../../../be-demo/docs/business/04-business-rules.md),
[05 order lifecycle](../../../be-demo/docs/business/05-order-lifecycle.md),
[06 compliance](../../../be-demo/docs/business/06-compliance.md).

| Nghiệp vụ                        | Owner/workflow đề xuất                                       | CMS giữ gì                            | Backend quyết định gì                                 |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------- | ----------------------------------------------------- |
| Sản phẩm, SKU, biến thể size×màu | products/product-editor, variants                            | Form, chọn size/màu, preview          | Uniqueness, eligibility đăng bán                      |
| Ảnh theo màu, thứ tự/ảnh chính   | products/product-editor/images                               | Upload state, selection, preview      | Persisted relations và validation                     |
| Giá khuyến mãi                   | products/sale-prices                                         | Form và preview theo input            | Hiệu lực/chồng thời gian/giá áp dụng                  |
| Danh mục cây và nội dung         | categories/category-editor                                   | Tree interaction, bản nháp dịch       | Slug ổn định, hidden subtree, translation persistence |
| Đơn và hành động xử lý           | orders/order-processing                                      | Hiện action API, dialog, lý do        | State transition/eligibility/atomicity                |
| Đổi trả, hàng hoàn về, hoàn tiền | Workflow phân biệt trong orders hoặc domain riêng khi đủ lớn | Nhập dòng/số lượng, xác nhận và lỗi   | Số tiền, nhập lại kho, trạng thái/idempotency         |
| Tồn kho, giữ hàng, hàng chờ xuất | inventory/stock-adjustment, stock-count                      | Bản đếm, lý do, preview               | Tồn tại thời điểm xác nhận và giới hạn giảm           |
| Voucher                          | vouchers/voucher-editor                                      | Input validation, draft               | Điều kiện áp dụng và tổng tiền                        |
| Staff, quyền, cấu hình           | accounts, roles, settings                                    | Form, affordance theo permission      | Authorization và invariant tài khoản                  |
| Khách hàng, xoá dữ liệu/audit    | customers, workflow privacy theo contract                    | Xác minh/input và theo dõi trạng thái | Anonymization, audit và điều kiện hoàn tất            |
| Báo cáo/xuất cho kế toán         | dashboard/reporting khi có consumer                          | Bộ lọc và download                    | Dữ liệu thu tiền có thẩm quyền                        |

Các hàng là **đề xuất ownership** suy từ business owner docs ở trên; không phải danh sách API đã tồn tại.
Đề xuất chưa tạo sẵn mọi folder/domain: yêu cầu thiếu contract được ghi thành nhu cầu Backend.
C17 hiện cấm đoán DTO/API/màn hình hoặc dùng mock để lấp contract thiếu.
Nguồn: [plan CMS C17 và dependency](../plans/cms-restructure-plan.md).

Có drift tài liệu cần giữ rõ: scope còn dòng “back-office Next.js”, trong khi source CMS dùng Vue/Vite;
scope loại nội dung sản phẩm đa ngôn ngữ, nhưng rule category cụ thể có yêu cầu vi/en và bảo toàn bản dịch thủ công.
Không suy rộng category thành mọi product content. Nguồn: [scope](../../../be-demo/docs/business/01-vision-scope.md),
[rules category](../../../be-demo/docs/business/04-business-rules.md), [config CMS](../../vite.config.ts).
Tài liệu actors mô tả STAFF/ADMIN; glossary/backend và CMS RBAC có mô hình role/permission riêng.
Không rút gọn quyền UI thành so sánh tên role trong migration.
Nguồn: [actors](../../../be-demo/docs/business/02-actors-permissions.md),
[glossary Backend](../../../be-demo/GLOSSARY.md), [UseAuth.ts](../../src/features/auth/UseAuth.ts).
Compliance ở đây là yêu cầu thiết kế nội bộ; báo cáo này không xác minh hiệu lực pháp luật.
Nguồn: [nhãn cần xác minh của compliance](../../../be-demo/docs/business/06-compliance.md).

## 5. Cây root đích thực dụng

**Đề xuất:** giữ `features` để giảm rename không phục vụ ownership; bên trong tổ chức theo domain/workflow.
Nếu sau grill chọn `modules`, đổi tên một lần cùng alias/lint; không duy trì hai root có cùng trách nhiệm.
Tên file trong cây là **đích**, chưa phải đường dẫn source tồn tại.

```text
src/
  app/
    runtime.ts                    # composition root; tạo runtime dùng chung
    config/                       # env.config.ts, ui.config.ts
    providers/                    # cài plugin/global handlers
    router/                       # routes.ts, router.ts, guards.ts
    views/                        # NotFoundView.vue, ForbiddenView.vue
  features/
    auth/                         # auth workflow, user/permission state
    products/                     # xem cây workflow phía dưới
    categories/
    orders/
    inventory/
    customers/
    vouchers/
    accounts/
    roles/
    settings/
    dashboard/
    colors/                       # giữ owner hiện có; regroup chỉ khi có quyết định
    sizes/
  layouts/                        # DashboardLayout.vue, AuthLayout.vue
  shared/
    components/                   # UI không biết domain
    composables/                  # useListState.ts, useNotify.ts
    lib/
      api/                        # api.generated.ts; transport, lỗi dùng chung
      query/                      # queryClient.ts
      session/                    # session.ts, session.store.ts
      i18n/
      form/                       # tiện ích khi có consumer thật
    types/                        # chỉ technical contracts dùng chung
    utils/                        # hàm thuần có tên theo trách nhiệm
  test/                           # runtime/render/factory dùng chung
  assets/
  locales/
  App.vue
  main.ts
e2e/                              # hành trình toàn ứng dụng
```

Tên/path output generated trong cây chỉ là minh hoạ, chưa được duyệt đổi; nếu đổi cần cập nhật generator, workflow contract và mọi consumer trong cùng slice.

## 6. Cây products theo workflow

**Đề xuất:** chia khi workflow có nhiều file cùng thay đổi; domain nhỏ giữ phẳng.
Không tạo `domain/application/infrastructure` rỗng trong mỗi workflow.

```text
features/products/
  products.routes.ts
  product.types.ts                # model chia sẻ trong products
  useProductOptions.ts            # chỉ public nếu consumer ngoài domain cần
  api/
    productMapper.ts              # DTO boundary dùng chung list/detail
    productKeys.ts                # key/invalidation chia sẻ nội bộ products
  product-list/
    ProductListView.vue
    ProductTable.vue
    useProductList.ts              # URL + query + actions điều phối
    productList.schema.ts
    api/
      useProductsQuery.ts
  product-editor/
    ProductEditView.vue
    ProductInfoForm.vue
    useProductEditor.ts            # form lifecycle/save/navigation
    product.schema.ts
    api/
      useProductQuery.ts
      useSaveProduct.ts
    images/
      ProductImagesPanel.vue
      useProductImages.ts
      imageUpload.ts               # hàm thuần/adapter nếu thật sự cần
      api/
        useProductImageMutations.ts
    variants/
      ProductVariantsPanel.vue
      variant.schema.ts
      variantDraft.ts              # pure rule về bản nháp CMS nếu có
      variantDraft.spec.ts
      api/
        useVariantMutations.ts
  sale-prices/                     # chỉ tách khi workflow thực tế đủ lớn
```

`images` và `variants` không tự động là domain độc lập chỉ vì có subfolder.
Đề xuất query dùng chung editor đặt ở owner chung gần nhất; không để sibling import private hook của nhau.
Một SFC nhỏ có thể vừa hiển thị vừa quản lý UI local; component dùng lại/presentational chỉ props/emits.
Nếu giữ rule components thuần hiện hành, phân loại container rõ và cập nhật lint cho đường dẫn lồng mới.
Nguồn hiện hành: [CONVENTIONS §T](../CONVENTIONS.md), [featureRows trong ESLint](../../eslint.config.ts).

## 7. API, query, mapper và dependency inversion

| Trách nhiệm                               | Owner đề xuất                | Không nên làm                        |
| ----------------------------------------- | ---------------------------- | ------------------------------------ |
| Base URL, headers, refresh, chuẩn hóa lỗi | shared transport/session     | Mỗi workflow tạo Axios client        |
| Generated DTO                             | Generated API chung     | Sửa tay để làm API tưởng như đã có   |
| Endpoint/body/response mapping            | `api/` trong domain/workflow | Component tự cast DTO                |
| Query key/invalidation                    | Domain sở hữu dữ liệu        | Button tự invalidate string rải rác  |
| Form schema                               | Workflow                     | Dùng DTO response làm form mutable   |
| Pure draft rule                           | Workflow/domain owner        | Import Vue/router/http vào hàm thuần |
| Runtime wiring/adapters global            | app/runtime                  | Feature import ngược app             |

**Hai phương án API:** (A) query composable gọi HTTP + mapper trong một module nhỏ;
(B) endpoint function riêng, query composable gọi endpoint khi có nhiều caller hoặc orchestration phức tạp.
Đề xuất bắt đầu A như [Products.api.ts](../../src/features/products/api/Products.api.ts);
chọn B khi có lý do cụ thể, không tạo service/repository 1:1 cho mọi endpoint.
Central `integrations/backend/endpoints` là lựa chọn khác nếu cần SDK dùng độc lập nhiều consumer;
đối với CMS hiện tại, đề xuất transport chung và endpoint/mapper theo domain để giữ ownership gần workflow.

Pure function nhận dữ liệu và trả kết quả; use case có I/O nhận dependency nhỏ do consumer định nghĩa.
Ví dụ đề xuất `saveProductDraft(input, { save, notify })` chỉ hữu ích nếu có policy/điều phối độc lập;
không bọc một lệnh `save(input)` chỉ để có tên use case.
Một seam thực tế đáng cân nhắc là upload ảnh: [ProductImages.api.ts](../../src/features/products/api/ProductImages.api.ts)
điều phối presign → POST trực tiếp lên storage → gắn metadata, còn
[UseProductImages.ts](../../src/features/products/composables/UseProductImages.ts) giữ progress/cancel/retry và UI state.
Nếu cần test/quản lý workflow độc lập Vue, có thể inject các hàm nhỏ cho ba bước;
không tạo service mới chỉ để chuyển tiếp. Giữ storage request tách Backend transport, không gắn token/credentials.
Đây là cơ hội thiết kế, không phải kết luận đã phát hiện hoặc sửa lỗi upload.

Port có thể là function/object structural type, không bắt buộc class/interface repository.
Nguyên tắc dependency inversion tham chiếu [Clean](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
và [Hexagonal](https://alistair.cockburn.us/hexagonal-architecture); ví dụ trên là đề xuất CMS.

Đề xuất public exports chọn lọc theo consumer; không bắt mọi domain có `index.ts`.
Rule hiện chỉ nhận `Use*.ts`/`types/`; đổi naming phải cập nhật whitelist và ca test boundary.
Đề xuất pure rule không import UI/DTO; shared không import features/app; liên domain chỉ public API, tránh vòng.
Nguồn hiện tại: [ESLint](../../eslint.config.ts), [CONVENTIONS](../CONVENTIONS.md).

## 8. State, reactivity, forms và lỗi

| State                             | Owner đề xuất                         |
| --------------------------------- | ------------------------------------- |
| Search/filter/page/sort deep link | URL + schema + useListState           |
| Server response/loading/refetch   | TanStack Vue Query                    |
| Draft/dirty/field errors          | Form/workflow local                   |
| Dialog/selection/expanded row     | Component hoặc workflow gần nhất      |
| User/permissions                  | Auth public capability/store hiện tại |
| Token/refresh/logout              | Session runtime hiện tại              |

Vue composable đóng gói stateful logic; dùng `useX`, dọn side effect và giữ lifecycle đúng context.
Nguồn: [Vue composables](https://vuejs.org/guide/reusability/composables.html).
Pinia store reactive; destructure state dùng `storeToRefs` khi cần giữ reactivity, actions có thể destructure.
Nguồn: [Pinia core concepts](https://pinia.vuejs.org/core-concepts/).
Đề xuất không copy query cache sang Pinia; chỉ dùng store khi có state dùng chung/lifecycle rõ.
Vue phân biệt state local với shared state; framework không bắt mọi state vào global store.
Nguồn: [Vue state management](https://vuejs.org/guide/scaling-up/state-management.html).

Query key chứa input ảnh hưởng response; giữ ref/getter trong key và `enabled`, tránh đọc primitive quá sớm.
Query result immutable; tạo draft mutable cho form và chốt policy khi refetch/đổi entity.
Nguồn: [Vue Query reactivity](https://tanstack.com/query/v5/docs/framework/vue/reactivity),
[query keys](https://tanstack.com/query/v5/docs/framework/vue/guides/query-keys).
Invalidation hỗ trợ match prefix; đề xuất key factory/invalidation do domain quản lý và await khi UX cần dữ liệu mới.
Nguồn: [query invalidation](https://tanstack.com/query/v5/docs/framework/vue/guides/query-invalidation).

Đề xuất form validate shape/input tại CMS; Backend vẫn có thẩm quyền business và concurrency.
Giữ dirty draft khi refresh; đổi id phải reset có chủ đích; khóa submit trùng và xử lý lỗi field/local rõ.
Không hứa multi-request editor atomic nếu contract Backend chỉ cung cấp mutation rời.
Nguồn baseline: [ProductEditor.api.ts](../../src/features/products/api/ProductEditor.api.ts),
[quy tắc Backend](../../../be-demo/docs/business/04-business-rules.md).
Đề xuất mỗi lỗi có một owner hiển thị: field/form hoặc global toast, không cả hai.
Giữ retry classification, local mutation meta và session handling hiện có.
Nguồn: [ErrorPolicy.ts](../../src/shared/lib/api/errors/ErrorPolicy.ts), [QueryClient.ts](../../src/shared/lib/query/QueryClient.ts).
Type narrowing xử lý union/unknown có kiểm tra; cast `as Dto` không phải runtime validation.
Nguồn: [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## 9. Routing, kiểm thử và migration

Route module khai báo URL/meta và lazy import view; view compose workflow, không chứa transport global.
Vue Router hỗ trợ dynamic import route component và navigation guards.
Nguồn: [lazy loading](https://router.vuejs.org/guide/advanced/lazy-loading.html),
[navigation guards](https://router.vuejs.org/guide/advanced/navigation-guards.html).
Đề xuất giữ route names/paths/redirect/permission baseline; guard UI không thay Backend authorization.
Riêng orders tiếp tục hiển thị `allowedActions[]`, không dựng lại state machine quyết định hành động ở CMS.
Nguồn: [plan C8](../plans/cms-restructure-plan.md), [actors control](../../../be-demo/docs/business/02-actors-permissions.md).

Vue phân biệt unit/component/E2E và khuyến khích kiểm hành vi observable thay vì chi tiết implementation.
Nguồn: [Vue testing](https://vuejs.org/guide/scaling-up/testing.html).
Đề xuất unit cho pure rule/mapper; component cho form/errors/permissions; integration cho query/invalidation/session;
E2E cho critical journeys qua route thật. Giữ `.spec.ts` cạnh owner, test infra trong `src/test`.
Tuân C11 nếu còn áp dụng trong plan hiện hành: không tự thêm test trước Phase 7 chỉ vì report khuyên có test.
Nguồn: [plan C11](../plans/cms-restructure-plan.md), [CONVENTIONS testing](../CONVENTIONS.md).

| Đợt đề xuất      | Việc làm                                               | Gate                                                           |
| ---------------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| Inventory        | File/import/consumer, URL, UI, API, state, test/config | Có baseline và scope từng slice                                |
| Policy/config    | Naming, nested boundary, DTO path, facade, docs        | ESLint tests/typecheck nhận cả target hợp lệ và import sai     |
| Pilot products   | List/editor/images/variants theo ownership             | Giữ endpoint, UI, validation, URL, upload/order                |
| Domain tiếp theo | Theo dependencies/contract readiness                   | Không guess API, không private import/vòng                     |
| Cleanup          | Xóa path cũ, cập nhật references/generated config      | Lint, typecheck, tests phù hợp, knip/build; E2E flow ảnh hưởng |

Các rủi ro rename cần inventory: case-only `git mv`, aliases/tsconfig/Vite, ESLint globs,
DTO allowlist, mocks/dynamic imports, test setup, generator output, knip, CI và tài liệu.
Nested `product-editor/**/api` hiện không được phép DTO theo glob `features/<domain>/api/**`;
component boundary hiện cũng không tự bao phủ mọi nested workflow. Phải cập nhật/test rule trước khi di chuyển.
Nguồn: [ESLint](../../eslint.config.ts), [generator](../../scripts/GenApi.ts), [Vite](../../vite.config.ts).
Đề xuất kiểm Generated API không lệch và theo [workspace contract flow](../../../shared/agents/workspace.md)
khi thay API xuyên repo; không bump contract chỉ vì rename client files.
Giữ một PR/slice review được; không tuyên bố bundle nhanh hơn nếu chỉ đổi naming/folder.
Báo cáo này chỉ tạo tài liệu; các gate implementation trên chưa được chạy.
