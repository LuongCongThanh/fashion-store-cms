# Kiến trúc CMS

Tổng quan source đối chiếu ngày 26/11/2026. [Guide](../conventions/README.md) giữ policy chi tiết; ADR/migration là thiết kế được duyệt, chưa triển khai source. [Navigation](navigation.md) giữ route và permission.

## Tổng quan kiến trúc CMS

### Technology Stack

Stack và phiên bản thực tế nằm ở [package.json](../../package.json), lockfile và cấu hình tương ứng; không dùng bảng dependency dự kiến để cài lại dự án. Các lựa chọn còn giá trị:

- Vue 3 + Vite + TypeScript; CMS là ứng dụng vận hành, không cần SEO/SSR.
- Nuxt UI + Tailwind dùng chung token; [DESIGN.md](../../DESIGN.md) sở hữu thiết kế. Không thêm bộ UI song song.
- Vue Query giữ server state; Pinia giữ state chia sẻ có lifecycle riêng. Không sao chép response thành cache thứ hai.
- Axios giữ transport/refresh seam và `axios-mock-adapter` dùng trong test; không chuyển sang MSW chỉ để đồng nhất Storefront.
- ECharts/vue-echarts phục vụ biểu đồ; Tiptap phục vụ rich text. Chỉ thêm thư viện khi có consumer thực tế.
- Form hiện dùng vee-validate + Zod 4 `safeParse`, không cài adapter `@vee-validate/zod` dành cho Zod 3. Xem [form](#form-validation).
- Format ngày/tiền/số qua `Intl` và helper của repo; không thêm dayjs chỉ để format.

Các phương án scaffold và lý do D1–D41 được giữ ở [scaffold plan](../archive/cms-initial-build/README.md).

### Recommended Project Structure

Source hiện hành: `app/Runtime.ts` dựng runtime; `app/router` ghép route; `layouts` dựng shell; `features` sở hữu nghiệp vụ; `shared` chứa kỹ thuật/UI dùng chung. Naming, alias và boundary được định nghĩa ở [CONVENTIONS §A, §B, §N, §Q](../conventions/README.md), thực thi bởi [ESLint](../../eslint.config.ts).

Đích migration được duyệt nhưng **chưa triển khai**: `modules`, `integrations/backend`, `i18n`, `styles`, `testing` và workflow colocated. Xem [thiết kế migration](../plan/initiatives/structure-migration/map.md) cùng [ADR 0001](../adr/0001-domain-workflows-and-vue-naming.md). Không áp tên/path đích lên source chưa chuyển.

### API Layer

Feature hiện sở hữu request, mapping, query keys và Vue Query trong các file `api/*.api.ts`; feature lớn như products đã có nhiều file theo workflow, không ép về một file duy nhất. View/composable điều phối; component dùng props/emits. Quy tắc chi tiết: [CONVENTIONS §T](../conventions/README.md).

Sau migration, endpoint/mapping thuộc integration và query thuộc module theo [ADR 0003](../adr/0003-backend-api-boundary.md). Chỉ áp dụng khi slice tương ứng chuyển source.

### Shared Modules

Shared không biết nghiệp vụ, chỉ tách khi có consumer dùng lại thật. Interface và consumer: [CONVENTIONS §Q.3](../conventions/README.md). Upload ảnh hiện thuộc products (xem [upload ảnh](#media-upload)); không còn feature `media` dùng chung.

### HTTP Client

HTTP client và refresh seam có một nguồn chuẩn tại [CONVENTIONS §M, §O](../conventions/README.md), cùng [HttpClient.ts](../../src/shared/lib/api/client/HttpClient.ts). Client nhận Session/locale qua dependency do runtime nối; không singleton hoặc import ngược feature.

### API Contract — Swagger

[`npm run gen:api`](../../scripts/GenApi.ts) đọc `OPENAPI_URL` và sinh [`src/shared/lib/api/Api.generated.ts`](../../src/shared/lib/api/Api.generated.ts). Không sửa tay; không dùng path cũ `src/types/api.generated.ts` hoặc biến `API_SWAGGER_URL`.

Contract Version pin trong [cấu hình development](../../.env.development). CI sinh lại và kiểm diff theo [workflow](../../.github/workflows/ci.yml). Flow bump/Breaking Change/merge order theo [workspace](../../../shared/agents/workspace.md). Generated types chỉ kiểm tĩnh, không kiểm JSON runtime; caller typing đang là công việc delivery của ADR 0003.

### Architecture Principle

Ưu tiên trách nhiệm rõ, dependency có hướng và ít state trùng. Không thêm BaseCrudService, GenericRepository hoặc abstraction chỉ để đủ tầng. Chỉ tạo folder/file khi có nội dung và owner thực tế.

### Final Architecture

CMS dùng Vue/Vite; Backend và Storefront có repo, tài liệu và vòng đời riêng. Tên ứng dụng và API Contract theo [glossary workspace](../../../GLOSSARY.md). Tài liệu CMS không quyết định ORM, kiến trúc hoặc stack của ứng dụng khác.

## Auth, permission và state

### Authentication

[`useAuth`](../../src/features/auth/UseAuth.ts) điều phối đăng nhập, tài khoản/quyền, restore và logout. [`Session`](../../src/shared/lib/session/Session.ts) giữ access token trong memory, refresh qua cookie do Backend sở hữu; không lưu token vào Web Storage. Runtime nối HTTP, Session, router và QueryClient.

Refresh single-flight; 401 khi refresh là Hết phiên, lỗi mạng/5xx là Mất kết nối và giữ phiên. Chi tiết: [CONVENTIONS §M, §O](../conventions/README.md); [quyết định auth](../archive/auth-integration/decisions.md) giữ bối cảnh lịch sử. Cấu hình cookie/CSRF thực tế thuộc Backend, không được suy ra từ ví dụ CMS.

### RBAC

`useAuth().can()` đọc quyền Backend trả; CMS không hard-code quyền theo tên role. Permission hiện có cả mã Generated API và quyền tạm cho feature chưa nối contract; xem [`Permission.ts`](../../src/shared/lib/api/Permission.ts). Quyền tạm không tự được cấp.

Hệ thống chỉ có một Store; không có StoreScope, switchStore hoặc header `X-Store-Id`. Kiểm quyền phía CMS phục vụ UI; Backend sở hữu authorization. Không coi UI ẩn nút là bằng chứng Backend đã kiểm quyền.

### State Management

Owner state hiện hành ở [CONVENTIONS §T.2](../conventions/README.md); đích được duyệt ở [ADR 0002](../adr/0002-state-runtime-and-session.md). Query key chứa input ảnh hưởng response, không chứa Store ID. Mutation invalidation thuộc query/API owner; UI state cục bộ không cần global store.

## Form và ảnh Sản phẩm

### Media Upload

Ảnh thuộc products. [`ProductImages.api.ts`](../../src/features/products/api/ProductImages.api.ts) xin presign qua `/admin/products/:id/images/presign`, POST `fields` + file trực tiếp lên storage, rồi gắn `storageKey` bằng POST `/admin/products/:id/images`. Đây không còn là PUT + `/media/:id/complete` của scaffold.

Storage dùng XHR riêng để có byte progress và hủy, không gắn token/credentials của API. [`UseProductImages.ts`](../../src/features/products/composables/UseProductImages.ts) sở hữu ảnh theo màu, validate JPEG/PNG/WebP và tối đa 5 MB, retry và điều phối mutation. Backend vẫn phải kiểm file. Media library/picker không tự trở thành tính năng đã triển khai.

### Form Validation

Form dùng vee-validate quản lý values/errors/dirty; Zod 4 `safeParse` kiểm input. Quyết định tương thích lịch sử: adapter `@vee-validate/zod@4.15.1` yêu cầu Zod 3 nên repo không cài; không thêm adapter/hạ Zod chỉ theo ví dụ cũ.

[`useHydrateForm`](../../src/shared/composables/UseHydrateForm.ts) chỉ hydrate khi pristine hoặc đổi route context/entity, không ghi đè dirty draft khi refetch. [`useUnsavedGuard`](../../src/shared/composables/UseUnsavedGuard.ts) xử lý rời route/đổi record. Lỗi field từ API qua helper theo [CONVENTIONS §O, §T](../conventions/README.md). Không đưa Store switching trở lại hydration.

HTML rich text cần được xử lý an toàn ở boundary render; việc package Tiptap tồn tại không chứng minh mọi HTML đã sanitize. Không coi DOMPurify là dependency đã cài khi package.json không khai báo.

## Môi trường, scripts và xác minh

### Testing

Test seam, render/runtime overrides và mock boundary ở [CONVENTIONS §I](../conventions/README.md). [`ci.yml`](../../.github/workflows/ci.yml) hiện có lint/format, typecheck, coverage, OpenAPI diff, build, Playwright E2E và knip report-only. Báo cáo cũ “hoãn E2E” chỉ mô tả phiên đó, không mô tả CI hiện tại. Đọc script/test thực tế trước khi chọn gate.

### Environment

[`.env.example`](../../.env.example) là nguồn mẫu: `VITE_API_BASE_URL=/api/v1` đi qua proxy; `OPENAPI_URL` chỉ dành cho generator. Chỉ biến `VITE_` được expose ra browser; không đặt secret Backend vào frontend env. Không sao chép tag hoặc địa chỉ môi trường từ tài liệu lịch sử.

### Development Commands

Dùng scripts của [package.json](../../package.json): `npm run dev`, `build`, `preview`, `lint`, `format:check`, `typecheck`, `test`, `test:coverage`, `test:e2e`, `gen:api`, `knip`, `analyze`. Toolchain theo `.nvmrc` và lockfile; không scaffold lại repo đã có source.

## Trạng thái tài liệu và tích hợp

### Trạng thái tài liệu và tích hợp — 2026-11-26

Route/permission hiện tại ở [navigation-flow](navigation.md). Phạm vi nghiệp vụ và API readiness ở [restructure plan](../plan/initiatives/api-restructure/map.md). Thiết kế cấu trúc đã duyệt ở [migration](../plan/initiatives/structure-migration/map.md), chưa triển khai source.

- `useListState` sở hữu URL state; Session xoá cache khi logout. Không có StoreScope hoặc Store ID trong query key.
- Backend và Generated API đã tồn tại; mức độ nối API phải kiểm từng feature. Không dùng hợp đồng tạm từ prototype thay Contract Version đã pin.
- Form/hydration và upload hiện hành được giải thích tại [Form và ảnh Sản phẩm](README.md), không dùng `/media` scaffold.
- [CI](../../.github/workflows/ci.yml) hiện có E2E. Báo cáo hoãn E2E trong lịch sử chỉ mô tả lần thực hiện đó; HTTP mock không chứng minh tích hợp Backend.
