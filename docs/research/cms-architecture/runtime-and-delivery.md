# API, state và migration

> Research bổ trợ ADR; không phải policy độc lập hoặc báo cáo refactor đã chạy.

## API, query, mapper và dependency inversion

| Trách nhiệm                               | Owner đề xuất                | Không nên làm                        |
| ----------------------------------------- | ---------------------------- | ------------------------------------ |
| Base URL, headers, refresh, chuẩn hóa lỗi | shared transport/session     | Mỗi workflow tạo Axios client        |
| Generated DTO                             | Generated API chung          | Sửa tay để làm API tưởng như đã có   |
| Endpoint/body/response mapping            | `api/` trong domain/workflow | Component tự cast DTO                |
| Query key/invalidation                    | Domain sở hữu dữ liệu        | Button tự invalidate string rải rác  |
| Form schema                               | Workflow                     | Dùng DTO response làm form mutable   |
| Pure draft rule                           | Workflow/domain owner        | Import Vue/router/http vào hàm thuần |
| Runtime wiring/adapters global            | app/runtime                  | Feature import ngược app             |

**Hai phương án API:** (A) query composable gọi HTTP + mapper trong một module nhỏ;
(B) endpoint function riêng, query composable gọi endpoint khi có nhiều caller hoặc orchestration phức tạp.
Đề xuất bắt đầu A như [Products.api.ts](../../../src/features/products/api/Products.api.ts);
chọn B khi có lý do cụ thể, không tạo service/repository 1:1 cho mọi endpoint.
Central `integrations/backend/endpoints` là lựa chọn khác nếu cần SDK dùng độc lập nhiều consumer;
đối với CMS hiện tại, đề xuất transport chung và endpoint/mapper theo domain để giữ ownership gần workflow.

Pure function nhận dữ liệu và trả kết quả; use case có I/O nhận dependency nhỏ do consumer định nghĩa.
Ví dụ đề xuất `saveProductDraft(input, { save, notify })` chỉ hữu ích nếu có policy/điều phối độc lập;
không bọc một lệnh `save(input)` chỉ để có tên use case.
Một seam thực tế đáng cân nhắc là upload ảnh: [ProductImages.api.ts](../../../src/features/products/api/ProductImages.api.ts)
điều phối presign → POST trực tiếp lên storage → gắn metadata, còn
[UseProductImages.ts](../../../src/features/products/composables/UseProductImages.ts) giữ progress/cancel/retry và UI state.
Nếu cần test/quản lý workflow độc lập Vue, có thể inject các hàm nhỏ cho ba bước;
không tạo service mới chỉ để chuyển tiếp. Giữ storage request tách Backend transport, không gắn token/credentials.
Đây là cơ hội thiết kế, không phải kết luận đã phát hiện hoặc sửa lỗi upload.

Port có thể là function/object structural type, không bắt buộc class/interface repository.
Nguyên tắc dependency inversion tham chiếu [Clean](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
và [Hexagonal](https://alistair.cockburn.us/hexagonal-architecture); ví dụ trên là đề xuất CMS.

Đề xuất public exports chọn lọc theo consumer; không bắt mọi domain có `index.ts`.
Rule hiện chỉ nhận `Use*.ts`/`types/`; đổi naming phải cập nhật whitelist và ca test boundary.
Đề xuất pure rule không import UI/DTO; shared không import features/app; liên domain chỉ public API, tránh vòng.
Nguồn hiện tại: [ESLint](../../../eslint.config.ts), [CONVENTIONS](../../conventions/README.md).

## State, reactivity, forms và lỗi

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
Nguồn baseline: [ProductEditor.api.ts](../../../src/features/products/api/ProductEditor.api.ts),
[quy tắc Backend](../../../../be-demo/docs/business/04-business-rules.md).
Đề xuất mỗi lỗi có một owner hiển thị: field/form hoặc global toast, không cả hai.
Giữ retry classification, local mutation meta và session handling hiện có.
Nguồn: [ErrorPolicy.ts](../../../src/shared/lib/api/errors/ErrorPolicy.ts), [QueryClient.ts](../../../src/shared/lib/query/QueryClient.ts).
Type narrowing xử lý union/unknown có kiểm tra; cast `as Dto` không phải runtime validation.
Nguồn: [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Routing, kiểm thử và migration

Route module khai báo URL/meta và lazy import view; view compose workflow, không chứa transport global.
Vue Router hỗ trợ dynamic import route component và navigation guards.
Nguồn: [lazy loading](https://router.vuejs.org/guide/advanced/lazy-loading.html),
[navigation guards](https://router.vuejs.org/guide/advanced/navigation-guards.html).
Đề xuất giữ route names/paths/redirect/permission baseline; guard UI không thay Backend authorization.
Riêng orders tiếp tục hiển thị `allowedActions[]`, không dựng lại state machine quyết định hành động ở CMS.
Nguồn: [plan C8](../../plan/initiatives/api-restructure/map.md), [actors control](../../../../be-demo/docs/business/02-actors-permissions.md).

Vue phân biệt unit/component/E2E và khuyến khích kiểm hành vi observable thay vì chi tiết implementation.
Nguồn: [Vue testing](https://vuejs.org/guide/scaling-up/testing.html).
Đề xuất unit cho pure rule/mapper; component cho form/errors/permissions; integration cho query/invalidation/session;
E2E cho critical journeys qua route thật. Giữ `.spec.ts` cạnh owner, test infra trong `src/test`.
Tuân C11 nếu còn áp dụng trong plan hiện hành: không tự thêm test trước Phase 7 chỉ vì report khuyên có test.
Nguồn: [plan C11](../../plan/initiatives/api-restructure/map.md), [CONVENTIONS testing](../../conventions/README.md).

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
Nguồn: [ESLint](../../../eslint.config.ts), [generator](../../../scripts/GenApi.ts), [Vite](../../../vite.config.ts).
Đề xuất kiểm Generated API không lệch và theo [workspace contract flow](../../../../shared/agents/workspace.md)
khi thay API xuyên repo; không bump contract chỉ vì rename client files.
Giữ một PR/slice review được; không tuyên bố bundle nhanh hơn nếu chỉ đổi naming/folder.
Báo cáo này chỉ tạo tài liệu; các gate implementation trên chưa được chạy.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
