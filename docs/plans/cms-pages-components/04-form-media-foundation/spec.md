# Spec 04 — Nền tảng Form & Media

Status: in-progress
Blocked by: 01
Nguồn: §3 (`form/`), §4.10 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase: P5 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Có khung form thống nhất (validate, map lỗi API) và upload ảnh dùng lại được.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- Cài `vee-validate`, `@vee-validate/zod`.
- `shared/components/form/FormSection`, `form/FormActions` (sticky footer: Cancel / Save draft / Save).
- `ApplyApiErrorToForm` khi có form thứ hai (D33).
- `features/media/`: `UseMedia.ts` (interface công khai), `ImageUploader` (chọn → validate → preview → upload → progress → kết quả), `ImageGallery` (xoá, sắp xếp, đặt ảnh chính).
- Cảnh báo rời trang khi form dirty.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Upload báo lỗi đúng khi file sai định dạng/quá dung lượng.
- Lỗi 422 từ API hiển thị đúng field.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng upload ảnh: chọn, validate, preview và báo lỗi pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 01

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Media library, route media (backlog).
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).
