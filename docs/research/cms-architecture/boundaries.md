# Bằng chứng và lựa chọn boundary

> Research bổ trợ ADR; không phải policy độc lập hoặc báo cáo refactor đã chạy.

## Quyết định đích và nguồn hiện hành

Người dùng đã duyệt **domain-first**, chia tiếp theo workflow khi cần; folder kebab-case,
`.vue` PascalCase, composable `useCamelCase.ts`, TypeScript khác camelCase,
role suffix như `.schema.ts`, `.types.ts`, `.store.ts`; test `.spec.ts` cạnh source.
Quyết định được ghi tại [ADR domain/workflow/naming](../../adr/0001-domain-workflows-and-vue-naming.md),
thay thế khuyến nghị giữ toàn bộ PascalCase của
[nghiên cứu trước](../../archive/architecture-research/README.md) **đối với đích migration**.

Source hiện tại vẫn chịu [CONVENTIONS](../../conventions/README.md), [FE_architecture](../../architecture/README.md)
và [ESLint](../../../eslint.config.ts) cho đến khi implementation cập nhật chúng cùng nhau.
Không áp naming mới lẻ tẻ vào code rồi coi lỗi lint là lý do tắt rule.
Đề xuất dùng domain-first như nguyên tắc ownership; tên root `features` hay `modules` là quyết định riêng,
không phải hệ quả bắt buộc của Vue hoặc domain-first.

Stack thực tế được khai báo trong [package.json](../../../package.json) và [vite.config.ts](../../../vite.config.ts):
Vue, Vue Router, Pinia, TanStack Vue Query, Nuxt UI tích hợp Vite, Zod, Vitest và Playwright.
Đây là dependency ranges, chưa xác nhận installed/resolved versions qua runtime.
Vite transpile TypeScript; giữ bước `vue-tsc` riêng như scripts hiện tại.
Nguồn: [Vite TypeScript](https://vite.dev/guide/features#typescript), [scripts CMS](../../../package.json).

## Clean/Hexagonal thực sự giúp gì

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

## Bằng chứng hiện tại cần bảo toàn

| Source owner                                                                    | Hiện trạng quan sát                                            | Giá trị cần giữ                           |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| [Runtime.ts](../../../src/app/Runtime.ts)                                       | Một composition root, overrides cho test                       | Không thêm singleton runtime thứ hai      |
| [Products.api.ts](../../../src/features/products/api/Products.api.ts)           | Query key reactive, request có AbortSignal, mapping phân trang | Hành vi list và cancellation              |
| [ProductEditor.api.ts](../../../src/features/products/api/ProductEditor.api.ts) | Detail/query, mutations, invalidation, payload typed           | Không đổi endpoint/payload khi đổi folder |
| [Product.mapper.ts](../../../src/features/products/api/Product.mapper.ts)       | DTO → model trong domain products                              | DTO không rò vào mọi view                 |
| [UseCategories.ts](../../../src/features/categories/UseCategories.ts)           | Public facade dùng qua domain                                  | Boundary theo consumer thật               |
| [UseListState.ts](../../../src/shared/composables/UseListState.ts)              | Query URL và debounce/reset pagination                         | Deep link, Back/Forward                   |
| [Session.ts](../../../src/shared/lib/session/Session.ts)                        | Refresh/logout và cache lifecycle                              | Session isolation và logout cleanup       |
| [QueryClient.ts](../../../src/shared/lib/query/QueryClient.ts)                  | Retry/staleTime/error routing tập trung                        | Một chính sách lỗi toàn app               |
| [Routes.ts](../../../src/app/router/Routes.ts)                                  | Composition routes/layout/fallback                             | URL và quyền truy cập                     |
| [vite.config.ts](../../../vite.config.ts)                                       | Explicit UI imports, PWA config                                | Giữ loading/privacy behavior              |

Không kết luận tính đúng đắn lúc chạy từ khảo sát tĩnh này.
Baseline giao diện thuộc [DESIGN.md](../../../DESIGN.md); thay tổ chức code không phải quyền redesign UI.

## Nghiệp vụ quyết định boundary

Tài liệu business là **yêu cầu đích**, không chứng minh endpoint đã release.
Nguồn scope: [01 vision/scope](../../../../be-demo/docs/business/01-vision-scope.md),
[02 actors/permissions](../../../../be-demo/docs/business/02-actors-permissions.md),
[03 user stories](../../../../be-demo/docs/business/03-user-stories.md),
[04 rules](../../../../be-demo/docs/business/04-business-rules.md),
[05 order lifecycle](../../../../be-demo/docs/business/05-order-lifecycle.md),
[06 compliance](../../../../be-demo/docs/business/06-compliance.md).

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
Nguồn: [plan CMS C17 và dependency](../../plan/initiatives/api-restructure/map.md).

Có drift tài liệu cần giữ rõ: scope còn dòng “back-office Next.js”, trong khi source CMS dùng Vue/Vite;
scope loại nội dung sản phẩm đa ngôn ngữ, nhưng rule category cụ thể có yêu cầu vi/en và bảo toàn bản dịch thủ công.
Không suy rộng category thành mọi product content. Nguồn: [scope](../../../../be-demo/docs/business/01-vision-scope.md),
[rules category](../../../../be-demo/docs/business/04-business-rules.md), [config CMS](../../../vite.config.ts).
Tài liệu actors mô tả STAFF/ADMIN; glossary/backend và CMS RBAC có mô hình role/permission riêng.
Không rút gọn quyền UI thành so sánh tên role trong migration.
Nguồn: [actors](../../../../be-demo/docs/business/02-actors-permissions.md),
[glossary Backend](../../../../be-demo/GLOSSARY.md), [UseAuth.ts](../../../src/features/auth/UseAuth.ts).
Compliance ở đây là yêu cầu thiết kế nội bộ; báo cáo này không xác minh hiệu lực pháp luật.
Nguồn: [nhãn cần xác minh của compliance](../../../../be-demo/docs/business/06-compliance.md).

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
