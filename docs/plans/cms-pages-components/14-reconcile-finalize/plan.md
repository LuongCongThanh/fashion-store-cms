# 14 — Đối chiếu và chốt

Status: in-progress
Blocked by: 01–13
Nguồn: §6 trong [danh mục page & component](../fashion-store-cms-pages-components.md) · Phase — · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Đối chiếu từng mục trong file nguồn với code; ghi lệch vào report.
- Chạy `knip` bỏ code thừa; `npm run analyze` ghi bundle size.
- Cập nhật `FE_architecture.md`, `CONVENTIONS.md`, `GLOSSARY.md`, `navigation-flow.md` nếu lệch.
- Điền đủ `metrics.md`; chuyển folder sang `docs/archive/`.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** Tài liệu cập nhật, metrics đầy đủ.

**Kiểm tra:**

- Definition of Done (FE_architecture §31) đạt cho từng feature.
- `test:e2e` pass toàn bộ.
