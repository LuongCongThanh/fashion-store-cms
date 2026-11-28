# Thiết kế lại cấu trúc CMS cho Vue

Status: design-approved

## Notes

Phiên grill-with-docs ngày 25/11/2026. Đọc `docs/research/cms-structure-and-naming.md`, `docs/conventions/README.md`, `docs/architecture/README.md` và kiểm source/config. Các quyết định được ghi tuần tự bên dưới; Q1–Q18 đã chốt, chờ Q19 xác nhận bản tổng hợp. Chưa triển khai source.

## Current frontier

Q1–Q19 đã chốt, người dùng xác nhận thiết kế tổng hợp ngày 26/11/2026. Phiên grilling hoàn tất. Đã bắt đầu kiểm kê tĩnh và chia delivery issues; chưa triển khai source. Các dòng frontier/đang mở trong nhật ký là lịch sử, được quyết định mới thay thế.

- [Spec delivery](spec.md)
- [Inventory ban đầu](inventory.md)
- [Issue 01: mapping và baseline](issues/01-inventory-baseline.md)

## Decisions so far

- Q1: Ưu tiên phù hợp với Vue và thuận tiện phát triển tính năng; không bắt buộc giống Storefront. Người dùng: “cũng không nhất thiết miễn sao phù hợp với vue để phát triển các tính năng”. Kết luận giữ naming trong research trước đó là khuyến nghị, không phải quyết định đã duyệt.
- Q2: Người dùng muốn xét “tất cả”. Phạm vi đánh giá mở toàn repo; phạm vi thay đổi chức năng và công nghệ cần làm rõ ở vòng tiếp theo.

- Q3: Đồng ý đánh giá cấu trúc, API, state, routing, form, test, tooling và tài liệu; lỗi/thiếu chức năng ghi thành công việc riêng trong lộ trình, giữ hành vi và UI hiện tại làm mốc regression.
- Q4: Đồng ý tiếp tục Vue/Vite, đánh giá thư viện theo vấn đề cụ thể; không mặc định thay stack.

- Q5: Đã duyệt tổ chức theo nghiệp vụ, gom workflow lớn như product-editor, variants, images, sale-prices; chức năng nhỏ giữ phẳng, không tạo folder rỗng.
- Q6: Đã duyệt PascalCase cho component/view/layout Vue; useCamelCase cho composable; camelCase cho TS thường; suffix theo trách nhiệm; folder nhiều từ kebab-case; giữ .spec.ts cạnh source. Đây là đích migration, chưa đổi lint/source hiện hành.

## Design tree / frontier

- Mục tiêu: cấu trúc Vue dễ phát triển tính năng — đã chốt.
- Phạm vi đánh giá: toàn repo — đã ghi nhận.
- Phạm vi delivery: đánh giá toàn repo, cải tổ kỹ thuật cần thiết; giữ chức năng và giao diện đang chạy làm mốc kiểm chứng — đã chốt Q3.
- Stack: tiếp tục Vue/Vite; chỉ thay thư viện khi có vấn đề và lợi ích cụ thể — đã chốt Q4.
- Tổ chức nghiệp vụ/workflow và naming — đã chốt Q5/Q6; xem [ADR 0001](../../../../adr/0001-domain-workflows-and-vue-naming.md).
- Đang nghiên cứu Clean Architecture và best practices Vue từ nguồn sơ cấp; đối chiếu be-demo/docs/business trước khi mở vòng tiếp theo.
- Sau đó: owner cấp root → API/query/DTO → state/runtime → public boundary → migration/gates.

## Facts affecting the design

- CMS hiện là Vue/Vite SPA, Nuxt UI không đồng nghĩa Nuxt.
- `app/Runtime.ts` dựng runtime chung cho production/test; session/HTTP có injection seam.
- API feature hiện gộp HTTP, Vue Query và mapping; đã có nhiều file theo workflow, dù FE_architecture §6 nói một file.
- `HttpClient.ts` có `HasPaths = false`; generated types hiện không bảo đảm mọi URL/body/response tại HTTP boundary.
- PascalCase, suffix và public feature import được lint enforce; mọi thay đổi cần cập nhật config cùng source.
- CONVENTIONS §Q đã có ngoại lệ feature route lazy-import view; cần đồng bộ lời văn §B.3, không coi ngoại lệ là chưa tồn tại.

## Business evidence for the next decisions

Đây là ràng buộc/đầu vào thiết kế, chưa phải danh sách module đích đã duyệt hoặc xác nhận API đã phát hành.

| Nhu cầu                                          | Nguồn sở hữu                                                          | Hệ quả cần đánh giá                                                                                                         |
| ------------------------------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Sản phẩm, Biến thể size × màu, SKU, ảnh theo màu | `be-demo/docs/business/04-business-rules.md` BR-CAT-01–11; US-802/805 | Workflow variants/images thuộc Sản phẩm; không tạo media library chung khi chưa có nhu cầu/contract                         |
| Giá khuyến mãi và Voucher khác phạm vi           | BR-PRC-01–06, BR-VCH-01–11; US-804/901                                | Không gom thành module promotions chung chung; cân nhắc sale-prices trong products và vouchers riêng                        |
| Danh mục cây, bản dịch, slug ổn định, ẩn nhánh   | BR-CAT-10/15 và bổ sung category 19/11; US-801                        | Workflow category có cây/biên tập/bản dịch; không suy từ ngôn ngữ UI thành nội dung Product đa ngôn ngữ                     |
| Đơn hàng, Đổi trả, Hoàn hàng và Hoàn tiền        | `05-order-lifecycle.md` §4; BR-RET/REF; US-601–609                    | Phân biệt lifecycle; vị trí màn hình không đồng nghĩa cùng state machine; không tự suy action thay Backend                  |
| Tồn kho, Giữ hàng, Hàng chờ xuất, Kiểm kê        | BR-INV-01–12; US-701–703                                              | CMS nhập draft/hiện preview; Backend chốt số liệu và concurrency khi xác nhận                                               |
| Tài khoản nội bộ, Vai trò và Quyền               | `be-demo/GLOSSARY.md`; `02-actors-permissions.md`; US-1001            | Auth/session và quản trị accounts/roles có trách nhiệm khác nhau; quyền lấy theo contract, không hard-code theo tên Vai trò |
| Cấu hình vận hành, báo cáo, ánh xạ GHN           | US-1002–1004; BR-REV                                                  | Chỉ thiết lập API hỗ trợ; không mở cấu hình TTL cố định; báo cáo tiền lấy số authoritative từ Backend                       |
| Yêu cầu xoá dữ liệu và lịch sử truy cập          | US-1101/1102; CMP-05/07                                               | Workflow processing/completed và audit cần contract; không báo hoàn tất chỉ vì một request được nhận                        |

Các độ lệch cần ghi nhận: `01-vision-scope` còn ghi back-office Next.js và loại nội dung đa ngôn ngữ rộng hơn BR-CAT-10; `02-actors-permissions` nói một role STAFF/ADMIN trong khi glossary mô tả nhiều Vai trò cấu hình. Không đổi stack hoặc đơn giản hoá RBAC theo các dòng cũ này. Cần kiểm owner/contract cụ thể cho implementation. Tài liệu compliance được đọc như yêu cầu sản phẩm của repo; phiên này không kiểm chứng pháp luật.

## Research 26/11/2026

Kết quả: [Vue CMS clean architecture](../../../../research/cms-architecture/README.md). Đề xuất nền modular theo nghiệp vụ/workflow, áp dụng hàm thuần/use case và dependency inversion tại seam có giá trị; không bắt đủ domain/application/infrastructure/repository cho CRUD. Đã đối chiếu nguồn gốc Clean/Hexagonal và tài liệu chính thức Vue, Router, Pinia, Vue Query, Vite, TypeScript. Đây là đề xuất để mở frontier tiếp, chưa là lựa chọn kiến trúc đã duyệt.

Frontier: Q7 chọn modular Vue + Clean chọn lọc hay full Clean; sau đó chốt root tree, API/query/DTO, public boundary và migration. Giữ naming/workflow Q5/Q6 đã chốt.

## Clarification 26/11/2026: readable responsibility names

Người dùng chưa chấp nhận Q7 dưới nhãn Clean/use case/port/adapter; yêu cầu tên dễ hiểu và chỉ định `fe-ecommerce-nike-style/docs/research/nextjs-storefront-structure.md` làm tham chiếu. Trình bày thiết kế bằng cây/trách nhiệm cụ thể: app, modules/features nghiệp vụ, layouts, integrations/backend, shared/components, testing; bên trong dùng components/composables/queries/services/schemas/stores/types theo nhu cầu. Không xem yêu cầu tên dễ hiểu là đã duyệt mọi root hoặc boundary API của Storefront. `composables` là tên phù hợp Vue thay cho hooks React; `app` vẫn có thể sở hữu khởi tạo/plugin/router Vue.

Q7 được diễn đạt lại thành cây tên cấp root cụ thể để người dùng chọn; API/query ownership sẽ hỏi sau khi chốt cây, không gộp ngầm vào rename.

## Q7 accepted 26/11/2026

Người dùng đồng ý cây tên cấp root: app (khởi tạo/plugin/router), layouts, modules theo nghiệp vụ, integrations/backend, shared/components/composables/form/formatting, i18n, styles, assets, pwa, testing; App.vue/main.ts và root e2e. Không tạo folder rỗng. Tên/trách nhiệm đã duyệt; boundary chi tiết API/query/DTO chưa chốt. Đã cập nhật ADR 0001.

Người dùng hỏi “composables là gì?”: cần giải thích bằng ví dụ hàm useProductEditor giữ form/state/actions cho component Vue trước khi tiếp tục Q8. Không coi câu hỏi này là yêu cầu đổi tên composables.

## Q8 accepted 26/11/2026

Giữ tên `composables/` theo thuật ngữ Vue, chú thích “Xử lý trạng thái và tương tác Vue”. Hàm `useX` đóng gói logic có trạng thái dùng cơ chế Vue. Không đổi thành `logic/`; hàm tính toán thuần và quy trình độc lập Vue được phân loại theo trách nhiệm riêng. Chỉ tách composable khi phần xử lý đủ lớn hoặc cần dùng lại.

Frontier tiếp: Q9 chốt `integrations/backend` sở hữu transport/endpoint/generated/DTO mapping, còn `modules/*/queries` sở hữu Vue Query/cache/invalidation; sau đó form schema/model, public dependencies, runtime/session và migration.

## Q9 accepted 26/11/2026

`integrations/backend` sở hữu HTTP transport, request endpoint, generated API Contract và mapping response. `modules/<domain>/<workflow>/queries` sở hữu Vue Query/cache/loading/refetch/invalidation. Composable màn hình phối hợp URL/filter/form/actions. Ví dụ `endpoints/products.api.ts` và `modules/products/product-list/queries/useProductsQuery.ts`. Không tự thêm service chuyển tiếp endpoint. Ranh giới này thay thế đề xuất giữ endpoint/query gộp ở feature trong research cũ; source/lint chưa được migrate.

Frontier: Q10 form schema/API schema/types ownership và Q11 public imports giữa module; sau đó runtime/session, domain boundaries chi tiết và delivery gates.

## Q10–Q11 accepted 26/11/2026

- Q10: Schema form thuộc chức năng; schema request/response API thuộc integrations/backend/schemas khi cần runtime validation; generated types thuộc integrations/backend/generated. Type đi theo owner, type một consumer giữ tại file đó; kiểu endpoint công khai từ integration khi cần, không khai báo lặp cùng cấu trúc chỉ để đủ tầng. Đích này thay policy cũ CONVENTIONS §T.3 bắt model khai báo độc lập cho mọi DTO; implementation phải cập nhật owner/rule cùng source.
- Q11: Module chỉ sử dụng public component/hàm/type đã công bố cho consumer hợp lệ; không import private internals hoặc mặc định mọi export là public. Ghi và lint public entry/dependency; không thêm barrel index.ts toàn module.

Frontier tiếp: Q12 ownership state/form/URL và Q13 một runtime factory dùng chung production/test; sau đó quy tắc route/component, domain bổ sung và lộ trình/gates. Chưa triển khai source.

## Q12–Q13 accepted 26/11/2026

- Q12: Server state ở Vue Query; filter/search/page deep-link ở URL qua composable; form draft/dirty/errors ở form/composable; dialog/selection ở owner gần nhất; Pinia chỉ cho state chia sẻ có nhu cầu. Refetch không ghi đè draft đang dirty; không nhân bản danh sách query vào Pinia.
- Q13: Giữ một runtime factory dùng chung production/test tại app/runtime.ts; app/config, providers và router giữ trách nhiệm khởi tạo. Runtime nối plugin, HTTP, session và các dependency, test thay bằng overrides; bảo toàn single-flight refresh, phân biệt hết phiên với lỗi mạng và logout cache cleanup.

Frontier tiếp: Q14 route/view/component ownership, Q15 migration từng slice + gates. Sau đó làm rõ các nhánh còn mở (module tương lai, vị trí session/query config, contract typing) và tổng hợp cây đích để xác nhận shared understanding; chưa triển khai source.

## Q14–Q15 accepted 26/11/2026

- Q14: Route khai báo URL/meta/quyền/lazy view; view ghép UI và gọi composable; component presentational props/emits và local UI state; composable sở hữu form/actions. Component dùng chung không gọi Backend/router.
- Q15: Inventory → naming/boundary → pilot products → lint/typecheck/test/build/E2E theo ảnh hưởng → mở rộng và cleanup; giữ behavior/UI/URL, lỗi/feature mới có scope riêng.
- Người dùng yêu cầu làm rõ clean code và chia file theo nhiệm vụ, kèm cây thư mục. Đã tổng hợp [thiết kế đích](../../../initiatives/structure-migration/map.md) với root tree, file-level products tree, sơ đồ lưu sản phẩm và các quyết định còn mở. Q16 cần xác nhận quy tắc trách nhiệm file minh hoạ; cây không thay inventory.

## Q16 clarification: all file roles, layouts and i18n

Người dùng hỏi thêm services/types/enum/utils/layout/i18n vì cây rút gọn chưa thể hiện đầy đủ. Chưa coi Q16 là đã được duyệt. Đã mở rộng thiết kế với service upload, types/store/constants, pure utility, layout components/navigation và i18n/locales. Enum hiện dùng union/as const theo rule repo; giá trị API lấy từ Generated API, không nhân bản. Shared/utils và các nhánh minh hoạ là đề xuất có điều kiện theo consumer, chưa tự chốt mọi file/path. Không cần hỏi lại layout/i18n root vì Q7 đã duyệt; cần chốt cách phân loại bổ sung ở Q16.

## Q16 clarification: config and shared ownership

Người dùng hỏi config/code dùng chung. Đã bổ sung bảng owner và cây minh hoạ: tool config root; startup env/UI app/config; global factories app/providers; Backend config integration; domain config trong module; shared chỉ generic UI/form/format/helper/type/constant có consumer thật. Runtime truyền config/dependency thay vì feature/shared import ngược app. Business dùng chéo vẫn qua public API owner, không chuyển shared. Config vận hành từ Backend thuộc settings. Factory QueryClient ở app/providers và cấu trúc shared/types/constants là đề xuất, chưa xem là đã duyệt. Q16 vẫn đang mở, sẽ hỏi cách phân loại tổng hợp thay vì coi câu hỏi làm rõ là câu đồng ý.

## Q16 accepted 26/11/2026

Đồng ý quy tắc file có nhiệm vụ chính rõ, service/types/store/constants/union-as-const/utils/layout/i18n đặt theo owner và nhu cầu; không bắt mọi folder/file phải có. Tool config giữ root; env/UI app/config; QueryClient factory/global error wiring app/providers; Backend config trong integration; config riêng chức năng giữ tại module. Shared chỉ generic code có consumer thật; nghiệp vụ dùng chéo vẫn public API module sở hữu. Config vận hành lấy Backend thuộc settings. Runtime truyền startup config/dependencies; không import ngược app từ modules/shared/integrations.

Frontier: Q17 session lifecycle ở integrations/backend/session và user/permissions ở modules/auth; Q18 typed endpoint theo generated Contract Version, schema runtime khi có nhu cầu. Module tương lai không tạo sẵn; sau đó tổng hợp xác nhận thiết kế, không tự triển khai source.

## Q17–Q18 accepted 26/11/2026

- Q17: Session/token/refresh ở integrations/backend/session; auth user/permissions ở modules/auth. Runtime nối lifecycle/HTTP/router/cache; token chỉ trong bộ nhớ, logout cleanup và single-flight refresh giữ nguyên.
- Q18: Endpoint kiểm kiểu method/path/params/body/response từ generated Contract Version; giữ Axios/session, verify typing trong pilot; schema runtime theo nhu cầu, không coi cast là validation và không đoán API chưa phát hành.
- Đã cập nhật cây/session/API trong thiết kế tổng hợp và ADR. Q19 là xác nhận shared understanding cuối phiên; không tự chuyển trạng thái sang implemented hoặc chạy refactor.

## Q19 accepted 26/11/2026

Người dùng xác nhận toàn bộ thiết kế, đồng ý chuyển sang inventory và chia công việc triển khai. Đã ghi spec delivery và 15 issue riêng tại issues/. Inventory static bao phủ 295 file src và dependency alias/config seams; chưa hoàn tất semantic mapping hoặc baseline runtime. Issue 01 là bước thực thi tiếp theo, không tự coi các issue còn lại ready. Không di chuyển source hoặc commit/push.

## Review fix 26/11/2026: Q18 coverage end-to-end

Người dùng yêu cầu sửa finding review P2: issue 06 trước đó chỉ proof một endpoint, chưa có gate toàn bộ operation. Đã thêm checklist operation (ban đầu sáu call sites auth/session từ source, issue 01 phải hoàn thiện toàn repo); issue 05 bàn giao typing auth/session, issue 06 retrofit sau proof; mỗi issue 07–14 có coverage gate; issue 15 yêu cầu 100% Backend operations đã phát hành/còn dùng typed và đối chiếu ngược source. Pending/external không tính là typed. Đây là làm rõ delivery cho Q18 đã duyệt, không đổi scope hay triển khai source.
