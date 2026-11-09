# 04 — Phase 3: thay control native bằng Nuxt UI

Status: done
Blocked by: 03

Đổi `<select>`/`<input>` trần sang `USelect`/`UInput` có label. Phạm vi: `LanguageSwitcher`, `ThemeSwitcher` (nằm trong User menu sau #03), `ProductFilters`, `OrderFilters` và các filter khác, `DataTablePagination`.

Focus ring theo `DESIGN.md`.

Nguồn: hallmark #5.

Test: spec hiện có vẫn xanh, chỉ cập nhật selector; mỗi control phải lấy được bằng role và tên.

## Comments
- 2026-11-09: Theo cách ghép của template dashboard (`pages/customers.vue`): `USelect`/`UInput` cho filter, `UPagination` cho phân trang. Xem bảng tái dùng trong spec.
- 2026-11-09: Xong trên branch `feat/nuxt-ui-controls` (xếp chồng trên #47). Thêm `FilterSelect` (reka-ui không cho option value rỗng nên "Tất cả" cần ánh xạ) và helper test `@test/Select` (`findCombobox`, `findField`, `chooseOption` bằng bàn phím). `DataTableColumnVisibility` chuyển sang ticket 05 (`UDropdownMenu` checkbox như template).
