# 11 — Promotions

Status: on-hold
Blocked by: 03, 04
Nguồn: §4.8 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P10 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Routes: `promotions` (`promotion:read`); `promotions/new` và `promotions/:id/edit` (`promotion:write`).
- Form: Type (coupon / auto) · Code · Discount type & value · Minimum order · Usage limit · Start/End · Status.
- Components: `PromotionTable`, `PromotionFilters`, `PromotionForm`, `PromotionStatusBadge`.
- Cài `@internationalized/date` nếu DatePicker cần import trực tiếp.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** `features/promotions/**`.

**Kiểm tra:**

- Code bắt buộc khi type = coupon; End > Start; % ≤ 100.
- Route read/write bị chặn đúng theo `promotion:read` / `promotion:write`.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng tạo coupon/automatic promotion và validate input pass.

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] **Ưu tiên cao:** `UsePromotionEditor.ts:46` cắt `...Z` thành giờ địa phương và gửi lại không offset — lệch 7 giờ ở UTC+7. Test sửa không kiểm `startAt`/`endAt`.
- [ ] Đổi coupon → auto vẫn gửi `code` cũ.
- [ ] Mọi lỗi gom thành một câu chung ở cuối form, không hiện cạnh field (user story 23).
- [ ] Giá trị giảm không format %/VND; `usageLimit` không cho 'không giới hạn'; `Promotion` kế thừa type form input (§T.1).
- [ ] View Create/Edit giống hệt nhau; trạng thái/loại lặp nhiều nơi.

**Chờ API / BE:**

- [ ] BE xác nhận format datetime (UTC / có offset).
- [ ] Test route guard; E2E tạo/sửa khuyến mãi.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
