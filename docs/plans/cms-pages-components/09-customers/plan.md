# 09 — Customers

Status: on-hold
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

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] Tổng tiền hiện số thô, `createdAt` hiện chuỗi ISO (§H).
- [ ] Mượn key i18n của feature khác (`auth.login.email`, `nav.orders`, `dashboard.customers`).
- [ ] Thiếu cột trạng thái; số điện thoại rỗng render `<dd>` trống; `PageTabs` thiếu `aria-controls` và điều hướng bằng phím mũi tên.
- [ ] Chưa test ẩn tab Orders khi thiếu `order:read`.

**Chờ API / BE:**

- [ ] Tách type list/detail theo contract thật (list không trả `addresses`, `activity`).
- [ ] Quyết định sản phẩm về che email/số điện thoại (PII).
- [ ] E2E danh sách và chi tiết khách hàng.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
