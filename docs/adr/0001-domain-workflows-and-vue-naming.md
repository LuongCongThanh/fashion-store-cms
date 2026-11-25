# Tổ chức CMS theo nghiệp vụ, workflow và tên phù hợp Vue

Status: accepted — các quyết định bắt đầu ngày 25/11/2026; thiết kế tổng hợp Q19 được duyệt ngày 26/11/2026. Chưa triển khai source.

CMS tiếp tục dùng Vue/Vite, tổ chức code theo nghiệp vụ; workflow đủ lớn được gom các file liên quan gần nhau, còn chức năng nhỏ giữ phẳng. Không bắt buộc đồng nhất cây với Storefront. Cách này ưu tiên tìm và phát triển trọn tính năng thay vì phân tán mọi file vào các nhóm kỹ thuật lớn.

Tên component, view và layout giữ PascalCase (`ProductTable.vue`, `ProductEditView.vue`); composable dùng `useProductEditor.ts`; module TypeScript thường dùng camelCase (`resolveVariant.ts`, `httpClient.ts`); schema/type/store có hậu tố vai trò (`product.schema.ts`, `product.types.ts`, `auth.store.ts`). Folder nhiều từ dùng kebab-case (`product-editor`, `sale-prices`); test giữ tên source rồi thêm `.spec.ts`.

Bổ sung ngày 26/11/2026: giữ tên `composables/` theo thuật ngữ Vue, diễn giải là “Xử lý trạng thái và tương tác Vue”. Không thay bằng `logic/` vì quá rộng; không bắt mỗi component có composable riêng.

## Đánh đổi

Giữ toàn bộ PascalCase sẽ ít churn hơn nhưng không phân biệt rõ file composable và module thường theo tên hàm. Đích mới chấp nhận sửa import, alias, mock và naming rules theo từng slice. Không đổi generated symbols hoặc field Backend để ép convention; output generated cần được quyết định riêng khi thiết kế API boundary.

## Hệ quả

- Cây cấp root đã được duyệt bổ sung ngày 26/11/2026: `app`, `layouts`, `modules`, `integrations/backend`, `shared/components`, `shared/composables`, `shared/form`, `shared/formatting`, `i18n`, `styles`, `assets`, `pwa`, `testing`; E2E ở root `e2e`. Chỉ tạo folder khi có nội dung.
- `app` sở hữu khởi tạo ứng dụng, plugin và router Vue; `modules` sở hữu nghiệp vụ; `integrations/backend` sở hữu kết nối Backend. Ranh giới API/query đã duyệt bổ sung ngày 26/11/2026: `integrations/backend` sở hữu transport, endpoints, generated contract và mapping dữ liệu API; `queries` trong module sở hữu Vue Query/cache/refetch/invalidation. Schema form thuộc chức năng; runtime schema API khi cần thuộc `integrations/backend/schemas`; generated contract thuộc `integrations/backend/generated`. Type đi theo owner, không khai báo trùng DTO chỉ để đủ tầng. Module chỉ dùng public entry được ghi nhận/lint; không import private internals hoặc tạo barrel toàn module. Các điểm này được duyệt ở Q10/Q11 ngày 26/11/2026, thay thế policy model độc lập bắt buộc trong CONVENTIONS §T.3 khi migration diễn ra.
- Khi triển khai phải cập nhật CONVENTIONS, cấu hình lint, boundary glob và test cùng source; không di chuyển folder làm mất enforcement.
- Đánh giá toàn repo; giữ UI và hành vi hiện tại làm mốc regression. Lỗi/thiếu chức năng ghi thành công việc có phạm vi riêng. Thư viện chỉ thay khi có lợi ích cụ thể.
- Theo dõi các câu hỏi còn mở tại [design map](../../.scratch/cms-architecture-design/map.md).

## State và khởi tạo ứng dụng

Đã duyệt Q12/Q13 ngày 26/11/2026: Vue Query sở hữu server state; URL sở hữu filter/search/page; form/composable sở hữu draft/dirty/errors; component hoặc màn hình sở hữu UI state cục bộ. Pinia chỉ giữ state chia sẻ có lý do, không sao chép query cache; refetch không ghi đè draft đang sửa.

Giữ một factory tại `app/runtime.ts` dùng cho cả production và test với overrides. Factory nối router, i18n, Pinia, Vue Query, HTTP và session; không tạo runtime/singleton thứ hai. Khi migrate phải giữ refresh single-flight, phân biệt hết phiên với lỗi mạng và xoá token/cache khi đăng xuất.

## Màn hình và migration

Đã duyệt Q14/Q15 ngày 26/11/2026: route khai báo URL/meta/lazy view, view ghép màn hình, component nhận props/phát emits và local UI state, composable điều phối form/actions. Chuyển từng slice có inventory, naming/boundary và pilot products; kiểm lint/typecheck/test/build/E2E theo ảnh hưởng rồi mở rộng/cleanup. Giữ UI/URL/hành vi làm baseline.

Cây tổng hợp và trách nhiệm từng file được trình bày tại [thiết kế migration CMS](../plans/cms-structure-migration.md); chi tiết ghi là đề xuất/còn mở chưa phải quyết định đã duyệt.

## Trách nhiệm file, config và code dùng chung

Đã duyệt Q16 ngày 26/11/2026: file có nhiệm vụ chính rõ; services/types/stores/constants/utils chỉ tạo khi có code cần owner riêng. Trạng thái CMS dùng union/as const theo policy hiện hành; giá trị API lấy từ generated contract. Layout và i18n có owner riêng.

Tool config ở root; cấu hình khởi động và UI ở app/config; QueryClient factory và global error wiring ở app/providers. Config Backend ở integration; config riêng chức năng ở module. Shared chỉ chứa code kỹ thuật/UI không biết nghiệp vụ, có consumer thật; nghiệp vụ dùng chéo đi qua public module API. Runtime truyền startup config/dependency, không để modules/shared/integrations import ngược app. Config vận hành Backend thuộc settings.

## Session và API Contract

Đã duyệt Q17/Q18 ngày 26/11/2026: integrations/backend/session sở hữu token/refresh/kết thúc phiên; modules/auth sở hữu thông tin tài khoản/quyền và interface đăng nhập. app/runtime nối session với HTTP/router/cache, giữ single-flight refresh và logout cleanup.

Endpoint kiểm kiểu method/path/params/body/response theo generated API Contract, giữ Axios/session hiện có và xác minh cách nối typing trong pilot. Runtime schema thêm theo nhu cầu thực tế; cast DTO không thay kiểm dữ liệu lúc chạy. Chức năng chưa có contract theo dõi riêng, không đoán API.

Q19 xác nhận hiểu biết chung và thiết kế tổng hợp ngày 26/11/2026. Delivery theo [spec và các issue](../../.scratch/cms-architecture-design/spec.md); việc thiết kế được duyệt không đồng nghĩa source đã migrate hoặc baseline đã chạy.
