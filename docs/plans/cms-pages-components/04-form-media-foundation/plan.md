# 04 — Nền tảng Form & Media

Status: ready-for-agent
Blocked by: 01
Nguồn: §3 (`form/`), §4.10 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P5 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Cài `vee-validate`, `@vee-validate/zod`.
- `shared/components/form/FormSection`, `form/FormActions` (sticky footer: Cancel / Save draft / Save).
- `ApplyApiErrorToForm` khi có form thứ hai (D33).
- `features/media/`: `UseMedia.ts` (interface công khai), `ImageUploader` (chọn → validate → preview → upload → progress → kết quả), `ImageGallery` (xoá, sắp xếp, đặt ảnh chính).
- Cảnh báo rời trang khi form dirty.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** Package: `vee-validate`, `@vee-validate/zod` (§K.2).

**Output:** `shared/components/form/**`, `features/media/**`.

**Kiểm tra:**

- Upload báo lỗi đúng khi file sai định dạng/quá dung lượng.
- Lỗi 422 từ API hiển thị đúng field.
- `typecheck`, `lint`, `test` pass.
