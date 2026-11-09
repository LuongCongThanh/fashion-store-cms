# 06 — Phase 3: state dùng chung + dọn token

Status: done
Blocked by: —

- `rounded-xl` → `rounded-lg` (`FormSection`, card dashboard).
- `space-y-5` → `space-y-4`/`space-y-6`.
- Dashboard loading dùng `LoadingState`/skeleton.
- `OrderItems` rỗng hiện `EmptyState`.
- Email/mã ở Detail dùng `break-all`.
- Mở rộng `DesignSystemView` để có badge, bảng, các state, focus, light/dark.

Nguồn: hallmark #11, #12; break-ui #3, #7.

Test: view spec cho empty state; kiểm tay `/design-system`.

## Comments
- 2026-11-09: `FormSection` cân nhắc dựng trên `UPageCard` (như `settings/index.vue` của template) thay vì tự viết card.
- 2026-11-09: Xong trên `feat/shared-states-tokens` (xếp chồng trên #48). `FormSection` giữ markup riêng (chỉ đổi `rounded-lg`), không dựng trên `UPageCard` vì title của `UPageCard` không phải heading nên mất `<h2>` cho trình đọc màn hình. `space-y-5` → `space-y-6`. Mã vận đơn và mã thanh toán thêm `font-mono`. `/design-system` có thêm badge, thanh lọc, bảng compact (fixture xấu nhất), 3 state, focus. Còn kiểm tay `/design-system` light/dark.
