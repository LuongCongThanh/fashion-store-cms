# API boundary và lộ trình đề xuất cũ

> Lịch sử research đã superseded; chỉ giữ nguồn và đánh đổi, không dùng làm policy hiện hành.

## 8. API, public interface và dependency

Chiều phụ thuộc chủ đạo hiện tại là `main → app → layouts/features → shared`.
Đây là partial order: app có thể import feature route; layout có thể dùng public auth;
feature cũng có thể dùng **public** feature khác khi dependency có chủ đích, không tạo vòng.
[CONVENTIONS §A/§B.3](../../guides/README.md), [ESLint BOUNDARIES](../../../eslint.config.ts).

`UseCategories.ts` được phép làm facade export chọn lọc; tránh `index.ts` và re-export toàn bộ nội bộ.
Pattern hiện cho phép `Use[^/]*` và `types/[^/]+`: đây là whitelist theo đường dẫn khá rộng,
không kiểm symbol nào đã được phê duyệt hay ngăn dependency cycle.
Đề xuất ghi consumer/public symbol theo feature và bổ sung ca lint khi mở dependency;
chỉ chuyển sang explicit allowlist/cycle tooling khi inventory cho thấy cần, không thêm công cụ trước bằng chứng.

Có độ lệch nhỏ giữa lời văn và thực thi: CONVENTIONS nói views chỉ được import từ
`app/router/Routes.ts`, trong khi `Products.routes.ts` thực tế lazy-import view của chính nó,
và lint cho phép nội bộ feature. Nên làm rõ ngoại lệ **route module sở hữu feature** trong đợt docs/rules riêng;
không từ đó dời mọi view vào `app` hoặc đổi URL. Vue Router chính thức hỗ trợ route component bằng dynamic import.
Nguồn: [Products.routes.ts](../../../src/features/products/Products.routes.ts),
[Vue Router lazy loading](https://router.vuejs.org/guide/advanced/lazy-loading.html).

Giữ HTTP dùng chung ở `shared/lib/api/client`, endpoint/query/mapper tại feature hiện hành.
Tách thành central `integrations/backend/endpoints` có thể hữu ích khi nhiều application dùng cùng SDK,
nhưng hiện sẽ đưa nghiệp vụ feature ra một global layer, đổi DTO/lint/test seam và làm tăng dependency surface.
Không có consumer SDK thứ hai được xác minh trong nghiên cứu này.

`Runtime.ts` inject `callRefresh: () => http.post(...)` cho Session trước khi khởi tạo `http`.
Closure chỉ chạy khi refresh xảy ra: đây là wiring trì hoãn có chủ đích,
không phải bằng chứng circular import cần xử lý bằng global singleton.
Phải giữ single-flight refresh, phân biệt 401 với lỗi mạng/5xx, cache cleanup và test isolation khi refactor.
Nguồn: [Runtime](../../../src/app/Runtime.ts), [Session](../../../src/shared/lib/session/Session.ts),
[HttpClient](../../../src/shared/lib/api/client/HttpClient.ts).

TypeScript generated chỉ cung cấp type tĩnh, không tự kiểm JSON runtime.
Runtime validation mới cần thiết kế theo boundary/contract thực tế, không sao chép mọi DTO thành schema form.
Vite chỉ transpile TypeScript; vẫn giữ `vue-tsc`/typecheck riêng.
Nguồn: [Vite TypeScript](https://vite.dev/guide/features#typescript), [scripts CMS](../../../package.json).
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
Nguồn: [plan CMS C8/C11/C17](../../plans/api-restructure/README.md).

Các gate trên là đề xuất cho **implementation sau khi duyệt**, chưa được chạy trong nghiên cứu này.
Không báo hiệu năng tốt hơn từ rename; chỉ đo bundle/request nếu thực sự đổi loading hoặc query behavior.
Giá trị cần đạt là ít dependency mơ hồ hơn, ownership dễ tìm hơn và bảo toàn hành vi đang có.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
