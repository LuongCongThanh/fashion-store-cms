# 06 — Phase 3: state dùng chung + dọn token

Status: ready-for-agent
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
