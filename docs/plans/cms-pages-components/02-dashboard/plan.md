# 02 — Dashboard

Status: on-hold
Blocked by: 01
Nguồn: §4.2 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P4 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Cài `echarts`, `vue-echarts` (import theo module, lazy-load).
- `features/dashboard/`: `Dashboard.routes.ts`, `views/DashboardView.vue` (route ``, không cần perm).
- Components: `StatCard`, `RevenueChart`, `OrderChart`, `RecentOrders` (`order:read`), `TopProducts` (`product:read`), `LowStockList` (`inventory:read`).
- Composable query của feature (`useDashboardQuery`…); component không gọi HTTP.
- Loading / empty / error cho từng widget (`ErrorState`, `EmptyState`).

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** Package: `echarts`, `vue-echarts` (§K.2).

**Output:** `features/dashboard/**`.

**Kiểm tra:**

- Widget ẩn khi thiếu permission tương ứng.
- Lỗi một widget không làm hỏng các widget khác.
- Chart chỉ nằm trong chunk lazy (kiểm bằng `npm run analyze`).
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng dashboard chính, gồm widget bị ẩn theo permission, pass.

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] `StatCard.vue` dùng `toLocaleString()` theo locale trình duyệt, không có VND; giá trị trong list không format (§H).
- [ ] Chart chưa có theme `cms-light` / `cms-dark` theo `useColorMode` (§L.11).
- [ ] `DashboardView.vue` gọi `ensureUser()` để vá lỗi guard của plan 01 — sai tầng, cần sửa ở guard.
- [ ] Loading là `<p>` chữ, chưa phải skeleton (user story 49); link `/inventory?search=<label>` tìm theo tên thay vì id.
- [ ] Hai `it` nằm ngoài `describe`; các component chưa có test riêng.

**Chờ API / BE:**

- [ ] Thay DTO viết tay bằng type sinh từ Swagger.
- [ ] Kiểm chart chỉ nằm trong chunk lazy (`npm run analyze`).
- [ ] E2E dashboard.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
