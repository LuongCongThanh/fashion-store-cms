# 05 — Products — List

Status: on-hold
Blocked by: 03
Nguồn: §4.3 (List) trong [danh mục page & component](../fashion-store-cms-pages-components.md) · Phase P5 · Spec: [spec.md](./spec.md)

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
- E2E (Playwright) cho luồng danh sách sản phẩm: tìm, lọc, sort, phân trang và bulk action pass.

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] Test 'ẩn bulk action khi thiếu `product:write`' luôn pass dù bỏ kiểm quyền; chưa test row action khi thiếu quyền.
- [ ] Lọc giá chưa kiểm `minPrice ≤ maxPrice`; lọc danh mục là danh sách phẳng.
- [ ] Xóa hết dòng ở trang cuối để lại trang rỗng; không có toast thành công.
- [ ] Danh sách trạng thái khai báo ở 4 nơi; `ProductTable` dùng `<a href>` cứng; `titleKey: 'dashboard.products'`.

**Chờ API / BE:**

- [ ] E2E danh sách sản phẩm; `Products.api.spec.ts` khi có contract thật.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
