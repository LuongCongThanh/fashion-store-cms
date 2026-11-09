# 10 — Inventory

Status: in-progress
Blocked by: 08
Nguồn: §4.7 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P9 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Routes `inventory`, `inventory/movements` (`inventory:read`).
- Cột inventory: Variant/SKU · Current · Reserved · Available · Stock status.
- Cột movement: SKU · Type · Quantity · Reason · Reference · Created at/by.
- Components: `InventoryTable`, `InventoryFilters`, `StockStatusBadge`, `StockAdjustDialog` (`inventory:write`), `StockMovementTable`, `StockMovementFilters` (dùng `FilterDateRange`).

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** `features/inventory/**`.

**Kiểm tra:**

- Adjust bắt buộc có reason, cập nhật list sau khi lưu.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng xem tồn kho, điều chỉnh có reason và kiểm tra lịch sử movement pass.
