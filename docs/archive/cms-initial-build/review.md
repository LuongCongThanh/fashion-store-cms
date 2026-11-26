# Review và bàn giao prototype CMS

## Review theo Standards và Spec

Base: `97875842ec6cd774a5c1439929a31842a3680746`. Dùng skill `code-review`, hai reviewer độc lập, không chỉnh file. Sau sửa đã được kiểm lại.

## Standards

- **Đã sửa:** upload chuyển sang presign → storage PUT → complete; có byte progress, hủy và retry. XHR riêng thay fetch được ghi rõ tại FE_architecture §17.1, không mang Session headers.
- **Đã sửa:** query key không lặp Store ID; Session vẫn sở hữu việc xoá cache khi đổi Store (§18).
- **Đã sửa/ghi quyết định:** Variants dùng useFieldArray; adapter @vee-validate/zod hiện yêu cầu Zod 3, còn repo dùng Zod 4 nên safeParse + vee-validate được ghi tại §19.
- **Heuristic:** các editor có chung hình dạng; phần hydration đã gom vào useHydrateForm, không tạo generic CRUD engine.

## Spec

- **Đã sửa:** lịch sử đơn khách hàng có phân trang theo URL, không dừng ở 20 đơn.
- **Đã sửa:** refetch nền không ghi đè draft dirty; đổi record trên cùng route cũng có xác nhận rồi hydrate entity mới.
- **Đã sửa:** parent choices loại cả subtree con và submit từ chối parent tạo vòng lặp.
- Không phát hiện scope creep đáng kể trong lượt review.

Kết quả reviewer kiểm lại: không còn finding đáng kể trong các bản sửa nêu trên. Backend/Swagger chưa có và E2E hoãn là giới hạn đã được người phụ trách xác nhận, không phải kiểm tra đã pass.

## Đối chiếu danh mục và kết quả

## Phạm vi

- Layout: breadcrumb, locale/theme, PageContainer, sidebar nhóm theo quyền.
- Dashboard: 4 stat cards, 2 chart tải động, RecentOrders, TopProducts, LowStockList; lỗi/retry theo widget và link đến chi tiết.
- Shared: ListSearch/FilterBar/FilterDateRange/ActiveFilterTags; DataTable/Pagination/ColumnVisibility/BulkActions/RowActions; FormSection/FormActions; StatusBadge/LoadingState; PageTabs; useListState/useUnsavedGuard/useHydrateForm.
- Feature: 25 View nghiệp vụ mới ở dashboard/products/categories/orders/customers/inventory/promotions/users/roles/settings; media là interface nghiệp vụ với uploader/gallery, không tạo route media library.
- Cross-feature: CategorySelector/useCategoriesQuery, useOrdersQuery, useRolesQuery, useMedia và component exports qua Use*.ts; shared không import feature.
- Presign/PUT/complete, validation ảnh 5 MB/10 ảnh, progress, cancel/retry; Tiptap và DOMPurify; variant SKU thuộc Variant.

## Backlog giữ nguyên

AppNotifications, Content Page/Banners/Blog, media library/picker, payment/shipping/email settings, audit log và bulk import/export không nằm trong 14 plan hiện tại.

## Kiểm tra và giới hạn

Xem [metrics](metrics/screens.md), [review](review.md), từng report và [hợp đồng API tạm](api-contracts.md). Đã chạy typecheck/lint/Vitest/coverage/build trên từng nhánh; plan 14 thêm knip/analyze và test route thực tế. E2E/kiểm UI thủ công chưa được chạy; backend và Swagger chưa tồn tại.

Không chuyển sang archive khi chuỗi PR vẫn draft và DoD tích hợp còn hoãn. Plan 14 bàn giao tài liệu/metrics để review, không tuyên bố đã merge hoặc sẵn sàng production.

## Quyết định thực hiện — 2026-11-09

- Người phụ trách yêu cầu 14 PR riêng. Việc triển khai ban đầu trên một nhánh là sai quy trình; đã sửa bằng 14 nhánh/PR nối tiếp trong worktree riêng, giữ nguyên workspace của người phụ trách.
- Người phụ trách đã chọn base PR sau là nhánh PR trước; khi đến lượt merge thì restack và đổi base về `dev`. Không tự merge.
- Ranh giới kiểm thử được xác nhận: View qua runtime/router/Pinia/Vue Query thật với HTTP giả, cộng logic thuần. E2E được hoãn.
- Người phụ trách xác nhận backend chưa tồn tại. Giữ `Api.generated.ts` placeholder và công khai hợp đồng tạm; không giả số liệu API integration.
- Token đo từ Codex session counters thật, gồm hai phiên review con. Không có phân bổ chính xác riêng từng plan cho phần làm chung; không bịa số hoặc chi phí USD.
- Mỗi report có kết quả kiểm trên nhánh riêng. `Status: in-progress` giữ nguyên khi PR còn draft/chưa merge; không archive folder như một nỗ lực đã đóng.

Các thay đổi cấu hình/format không thuộc task trong workspace ban đầu không được đưa vào các nhánh này.
