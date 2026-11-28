# Tổ chức CMS theo nghiệp vụ, workflow và tên phù hợp Vue

Status: accepted — các quyết định bắt đầu ngày 25/11/2026; thiết kế tổng hợp Q19 được duyệt ngày 26/11/2026. Chưa triển khai source.

CMS tiếp tục dùng Vue/Vite, tổ chức code theo nghiệp vụ; workflow đủ lớn được gom các file liên quan gần nhau, còn chức năng nhỏ giữ phẳng. Không bắt buộc đồng nhất cây với Storefront. Cách này ưu tiên tìm và phát triển trọn tính năng thay vì phân tán mọi file vào các nhóm kỹ thuật lớn.

Tên component, view và layout giữ PascalCase (`ProductTable.vue`, `ProductEditView.vue`); composable dùng `useProductEditor.ts`; module TypeScript thường dùng camelCase (`resolveVariant.ts`, `httpClient.ts`); schema/type/store có hậu tố vai trò (`product.schema.ts`, `product.types.ts`, `auth.store.ts`). Folder nhiều từ dùng kebab-case (`product-editor`, `sale-prices`); test giữ tên source rồi thêm `.spec.ts`.

Bổ sung ngày 26/11/2026: giữ tên `composables/` theo thuật ngữ Vue, diễn giải là “Xử lý trạng thái và tương tác Vue”. Không thay bằng `logic/` vì quá rộng; không bắt mỗi component có composable riêng.

Quyết định về state, runtime và session nằm ở [ADR 0002](0002-state-runtime-and-session.md); ranh giới Backend và kiểm kiểu API Contract nằm ở [ADR 0003](0003-backend-api-boundary.md).

## Các phương án đã cân nhắc

- **Giữ cây `features/<x>/{api,components,composables,...}` và toàn bộ PascalCase hiện hành**: ít churn nhất, nhưng workflow lớn (product editor, sale prices) bị rải qua nhiều thư mục kỹ thuật và tên file không phân biệt composable với module thường.
- **Tổ chức theo tầng kỹ thuật cấp repo (`services/`, `stores/`, `views/`...)**: quen thuộc với nhiều dự án Vue, nhưng một thay đổi nghiệp vụ phải sửa nhiều nhóm xa nhau.
- **Đồng nhất cây với Storefront (Next.js)**: dễ chuyển ngữ cảnh giữa hai app, nhưng ép quy ước của framework khác lên Vue.
- **Theo nghiệp vụ/workflow, tên theo quy ước Vue (chọn)**: file của một workflow nằm gần nhau, tên phản ánh vai trò; chấp nhận sửa import, alias, mock và naming rules theo từng slice.

## Đánh đổi

Giữ toàn bộ PascalCase sẽ ít churn hơn nhưng không phân biệt rõ file composable và module thường theo tên hàm. Đích mới chấp nhận sửa import, alias, mock và naming rules theo từng slice. Không đổi generated symbols hoặc field Backend để ép convention.

## Phần CONVENTIONS bị thay thế

ADR này và ADR 0002/0003 thay thế các mục sau của [CONVENTIONS](../conventions/README.md) **cho source đã chuyển**. Source chưa chuyển vẫn theo CONVENTIONS hiện hành; mỗi slice cập nhật guide sở hữu policy tương ứng trong cùng thay đổi (gate chung mục 2 trong [spec delivery](../plan/tasks/todo/cms-architecture-design/spec.md#gate-chung-cho-slice)).

| Mục CONVENTIONS                            | Quy định hiện hành                                               | Thay bằng                                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| §A cây thư mục, §Q cấu trúc module         | `features/<x>/` với thư mục kỹ thuật cố định                     | `app`, `layouts`, `modules`, `integrations/backend`, `shared/*`... (mục Hệ quả)           |
| §B.1 tên file và thư mục                   | Không kebab-case, composable `Use*.ts`, module thường PascalCase | Folder kebab-case, `useXxx.ts`, module thường camelCase, hậu tố vai trò viết thường       |
| §B.3 ranh giới feature                     | Whitelist `@features/<x>/Use*` và `types/*`                      | Public entry của module được ghi và lint (ADR 0003)                                       |
| §N import alias                            | 7 alias gồm `@features`                                          | Alias theo cây mới, chốt ở issue 02                                                       |
| §T.3 DTO không ra khỏi `api/`              | Model độc lập bắt buộc                                           | Type đi theo owner, mapping ở `integrations/backend` (ADR 0003)                           |
| Cây `docs/`: `decisions.md` "thay cho ADR" | Quyết định khó đảo ngược ghi trong thư mục plan của feature      | Quyết định cấp feature vẫn dùng `decisions.md`; quyết định xuyên module ghi ở `docs/adr/` |

## Hệ quả

- Cây cấp root đã được duyệt bổ sung ngày 26/11/2026: `app`, `layouts`, `modules`, `integrations/backend`, `shared/components`, `shared/composables`, `shared/form`, `shared/formatting`, `i18n`, `styles`, `assets`, `pwa`, `testing`; E2E ở root `e2e`. Chỉ tạo folder khi có nội dung.
- `app` sở hữu khởi tạo ứng dụng, plugin và router Vue; `modules` sở hữu nghiệp vụ; `integrations/backend` sở hữu kết nối Backend (chi tiết ở ADR 0003).
- Khi triển khai phải cập nhật CONVENTIONS, cấu hình lint, boundary glob và test cùng source; không di chuyển folder làm mất enforcement.
- Đánh giá toàn repo; giữ UI và hành vi hiện tại làm mốc regression. Lỗi/thiếu chức năng ghi thành công việc có phạm vi riêng. Thư viện chỉ thay khi có lợi ích cụ thể.

## Màn hình và migration

Đã duyệt Q14/Q15 ngày 26/11/2026: route khai báo URL/meta/lazy view, view ghép màn hình, component nhận props/phát emits và local UI state, composable điều phối form/actions. Chuyển từng slice có inventory, naming/boundary và pilot products; kiểm lint/typecheck/test/build/E2E theo ảnh hưởng rồi mở rộng/cleanup. Giữ UI/URL/hành vi làm baseline.

Cây tổng hợp và trách nhiệm từng file được trình bày tại [thiết kế migration CMS](../plan/initiatives/structure-migration/map.md); chi tiết ghi là đề xuất/còn mở chưa phải quyết định đã duyệt.

## Trách nhiệm file, config và code dùng chung

Đã duyệt Q16 ngày 26/11/2026: file có nhiệm vụ chính rõ; services/types/stores/constants/utils chỉ tạo khi có code cần owner riêng. Trạng thái CMS dùng union/as const theo policy hiện hành; giá trị API lấy từ Generated API. Layout và i18n có owner riêng.

Tool config ở root; cấu hình khởi động và UI ở app/config; QueryClient factory và global error wiring ở app/providers. Config Backend ở integration; config riêng chức năng ở module. Shared chỉ chứa code kỹ thuật/UI không biết nghiệp vụ, có consumer thật; nghiệp vụ dùng chéo đi qua public module API. Runtime truyền startup config/dependency, không để modules/shared/integrations import ngược app. Config vận hành Backend thuộc settings.

## Theo dõi

Q19 xác nhận hiểu biết chung và thiết kế tổng hợp ngày 26/11/2026. Delivery theo [spec và các issue](../plan/tasks/todo/cms-architecture-design/spec.md); việc thiết kế được duyệt không đồng nghĩa source đã migrate hoặc baseline đã chạy. Nhật ký câu hỏi Q1–Q19 nằm ở [design map](../plan/tasks/todo/cms-architecture-design/map.md); ADR này tự chứa quyết định, link chỉ để tra lịch sử.
