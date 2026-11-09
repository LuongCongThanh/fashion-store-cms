# 10 — Inventory

Status: on-hold
Blocked by: 08
Nguồn: §4.7 trong [danh mục page & component](../fashion-store-cms-pages-components.md) · Phase P9 · Spec: [spec.md](./spec.md)

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

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] **Ưu tiên cao:** form điều chỉnh không chặn tồn âm (vd. −100 khi tồn 5).
- [ ] **Ưu tiên cao:** ô 'Số lượng' không rõ là mức thay đổi hay tồn mới; dialog không hiện tồn hiện tại.
- [ ] `quantity = 0` báo 'Không được để trống'; 'SKU' hard-code; cột Variant thiếu tên; cột Type hiện enum thô.
- [ ] Key i18n `in-stock`, `low-stock`, `out-of-stock` chưa camelCase; sort `-createdAt` không có field tương ứng.

**Chờ API / BE:**

- [ ] 'Cập nhật list sau khi lưu' cần API thật.
- [ ] BE chặn tồn âm, idempotency/kiểm tồn hiện tại khi điều chỉnh.
- [ ] Lỗi 422 từ mutation đang bị nuốt (`catch {}`), người dùng không thấy gì — xử lý theo §O.4 khi có API.
- [ ] E2E tồn kho và lịch sử movement.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
