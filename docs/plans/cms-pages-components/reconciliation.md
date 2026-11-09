# Đối chiếu danh mục và kết quả

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

Xem [metrics](./metrics.md), [review](./code-review.md), từng report và [hợp đồng API tạm](./api-contracts.md). Đã chạy typecheck/lint/Vitest/coverage/build trên từng nhánh; plan 14 thêm knip/analyze và test route thực tế. E2E/kiểm UI thủ công chưa được chạy; backend và Swagger chưa tồn tại.

Không chuyển sang archive khi chuỗi PR vẫn draft và DoD tích hợp còn hoãn. Plan 14 bàn giao tài liệu/metrics để review, không tuyên bố đã merge hoặc sẵn sàng production.
