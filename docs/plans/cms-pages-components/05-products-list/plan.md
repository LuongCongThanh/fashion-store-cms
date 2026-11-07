# 05 — Products — List

Status: ready-for-agent
Blocked by: 03
Nguồn: §4.3 (List) trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P5 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- `features/products/Products.routes.ts` route `products` (`product:read`).
- `api/`, `useProductsQuery`, schema list params.
- `ProductListView`: search, filter (category, status, price), sort, pagination, column visibility, bulk publish/unpublish/delete (`product:write`).
- Components: `ProductTable` (`ColumnDef<T>`), `ProductFilters`, `ProductStatusBadge` (map status → màu ở feature).
- Delete dùng `useConfirm()` preset danger.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** `features/products/**` (phần list).

**Kiểm tra:**

- Filter/sort/page nằm trên URL, chia sẻ link mở đúng trạng thái.
- Bulk action ẩn khi thiếu `product:write`.
- `typecheck`, `lint`, `test` pass.
