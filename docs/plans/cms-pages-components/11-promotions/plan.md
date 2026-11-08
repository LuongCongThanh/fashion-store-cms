# 11 — Promotions

Status: ready-for-agent
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
