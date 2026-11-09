# 04 — Phase 3: thay control native bằng Nuxt UI

Status: ready-for-agent
Blocked by: 03

Đổi `<select>`/`<input>` trần sang `USelect`/`UInput` có label. Phạm vi: `LanguageSwitcher`, `ThemeSwitcher` (nằm trong User menu sau #03), `ProductFilters`, `OrderFilters` và các filter khác, `DataTablePagination`.

Focus ring theo `DESIGN.md`.

Nguồn: hallmark #5.

Test: spec hiện có vẫn xanh, chỉ cập nhật selector; mỗi control phải lấy được bằng role và tên.

## Comments
- 2026-11-09: Theo cách ghép của template dashboard (`pages/customers.vue`): `USelect`/`UInput` cho filter, `UPagination` cho phân trang. Xem bảng tái dùng trong spec.
