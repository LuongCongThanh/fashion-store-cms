# 04 — Nền tảng Form & Media

Status: on-hold
Blocked by: 01
Nguồn: §3 (`form/`), §4.10 trong [danh mục page & component](../fashion-store-cms-pages-components.md) · Phase P5 · Spec: [spec.md](./spec.md)

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
- E2E (Playwright) cho luồng upload ảnh: chọn, validate, preview và báo lỗi pass.

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] Coverage dòng giảm từ 84.8% xuống 80.19% (vi phạm 'coverage không giảm so với dev').
- [ ] `@vee-validate/zod` chưa cài; `vee-validate` đã thêm nhưng chưa import ở đâu.
- [ ] `ImageUploader` chỉ nhận 1 file; chọn rỗng báo 'Tối đa 10 ảnh'; preview ảnh lỗi vẫn còn.
- [ ] `retry()` làm mất id của các file đã upload thành công trước đó.
- [ ] `UseMediaComponents.ts` re-export component (barrel, §B.3); MIME và giới hạn 5 MB lặp ở nhiều nơi; `ImageGallery` thiếu tên truy cập riêng cho từng ảnh.
- [ ] `UseUnsavedGuard` cho qua khi chỉ đổi query dù form đang dirty.

**Chờ API / BE:**

- [ ] Kiểm upload với storage thật; test lỗi 422 hiện đúng field; E2E upload.
- [ ] Retry sau khi `complete` lỗi đang upload lại cả file, có thể để lại object mồ côi — cần BE xác nhận cách xử lý.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
