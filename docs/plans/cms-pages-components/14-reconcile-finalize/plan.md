# 14 — Đối chiếu và chốt

Status: on-hold
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

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] PR gắn type `docs` nhưng có test và script — nên tách hoặc đổi type.
- [ ] `CodexUsage.ts` đọc mọi `*.jsonl` cùng thư mục session, `JSON.parse` không có guard, so sánh timestamp dạng chuỗi (`--since` có offset sẽ sai).
- [ ] `code-review.md` ghi 'không phát hiện scope creep' và thiếu bug của settings — xem kết quả review trong report từng plan.
- [ ] CONVENTIONS ghi model nằm trong `features/*/types` nhưng settings không có `types/`; `@vee-validate/zod` còn được liệt kê ở FE_architecture §2 và CONVENTIONS K.2 dù chưa cài.

**Chờ API / BE:**

- [ ] `test:e2e` toàn bộ; Definition of Done §31 cho từng feature.
- [ ] Chuyển folder sang `docs/archive/` sau khi chuỗi PR được duyệt.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
