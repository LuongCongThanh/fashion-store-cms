# 07 — Phase 4.1: Product list làm reference cho archetype List

Status: needs-user-review
Blocked by: 05, 06

Áp archetype List lên `ProductListView`: page header, tab bộ lọc đã lưu (`<nav>` + `aria-current`, đếm qua badge `soft`), thanh lọc một dòng kèm chip, bảng compact có ảnh nhỏ (khi thiếu ảnh dùng ảnh giả theo `DESIGN.md`), phân trang.

Tham chiếu prototype A + tab của B (#42). Cần user duyệt trước khi rollout (#08).

Test: ProductListView spec cho tab đổi query, chip bỏ lọc, fixture xấu nhất không làm mất menu ⋯.

## Comments
- 2026-11-09: Tab bộ lọc đã lưu: cân nhắc `UDashboardToolbar` + `UNavigationMenu` ngang (như `settings.vue` của template). Ticket này quyết định thanh lọc nằm ở toolbar hay trong trang.
- 2026-11-09: Đã làm theo TDD trên branch `feat/product-list-reference`. Chọn `<nav>` + `RouterLink` thay cho `UDashboardToolbar`: tab là điều hướng URL thật và có `aria-current`; mỗi tab lấy số lượng từ list API với `pageSize=1`. Thanh lọc giữ trong trang, thêm chip bỏ từng lọc/xóa tất cả. Bảng thêm thumbnail 40px, placeholder khi thiếu ảnh, accessible name riêng cho menu từng dòng và ưu tiên cột mobile. `typecheck`, `lint`, 266 test đều xanh. Chờ user duyệt reference ở desktop + 375px, light/dark trước ticket 08.
- 2026-11-09: Sau code review, tách tab sang `ProductSavedViews` presentational; count có skeleton và retry khi lỗi. `FilterBar` giữ một dòng có overflow riêng, chip dùng `UBadge soft primary`, giá chip đi qua formatter. `PRODUCT_STATUSES` là nguồn enum-like dùng chung cho schema/filter/tab. Các tab trong ticket này là preset theo trạng thái; chức năng user tự lưu/đặt tên bộ lọc ở `UseListState` (§S.1) vẫn là P5 ngoài phạm vi reference này.
