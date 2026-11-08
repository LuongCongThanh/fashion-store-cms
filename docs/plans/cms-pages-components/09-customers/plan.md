# 09 — Customers

Status: ready-for-agent
Blocked by: 08
Nguồn: §4.6, §3 (`PageTabs`) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P8 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Shared: `page/PageTabs` (đồng bộ `?tab=`).
- Routes `customers`, `customers/:id` (`customer:read`).
- Detail tabs: Profile · Addresses · Orders · Activity.
- Components: `CustomerTable`, `CustomerFilters`, `CustomerProfile`, `CustomerAddressList`, `CustomerOrderTable` (dùng `useOrdersQuery` của orders), `CustomerActivity`.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** `features/customers/**`, `shared/components/page/PageTabs.vue`.

**Kiểm tra:**

- Reload giữ đúng tab.
- Không import nội bộ của `features/orders` ngoài interface công khai.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng danh sách khách hàng, mở chi tiết và giữ tab trên URL pass.
