# 04 — Báo cáo: Nền tảng Form & Media

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-04-form-media-foundation`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/27
Base hiện tại: `feat/cms-03-list-table-foundation`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

Form actions, bảo vệ draft và upload presign → storage PUT → complete có progress/hủy/retry.

Storage PUT dùng XHR riêng để có byte progress/hủy, không gắn Session headers. Zod 4 không tương thích peer dependency Zod 3 của @vee-validate/zod; giữ safeParse và vee-validate.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 179 tests / 25 files PASS; +2 so với base PR |
| Coverage dòng                              | 80.19% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 78.44% / 76.7% / 73.21%                      |
| Production build                           | PASS                                         |
| E2E                                        | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/features/media/views/MediaUpload.spec.ts` — rejects invalid images before HTTP and shows a successfully uploaded preview (**passed**)
- `src/features/media/views/MediaUpload.spec.ts` — cancels a storage upload without completing it and retries the original image (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 447.69 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #27.

### Đã làm (giữ nguyên)

- Component: `FormSection`, `FormActions`, `ImageUploader`, `ImageGallery`; composable `UseUnsavedGuard`.

### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- Luồng upload thật: `api/Media.api.ts`, `MediaUpload.ts` (presign → PUT → complete), `UseMedia.ts`, `types/Media.types.ts`.
- `shared/lib/form/ApplyApiErrorToForm.ts`, `shared/composables/UseHydrateForm.ts`.
- `src/test/RenderFeature.ts` (mock `/auth/me`), `views/MediaUpload.spec.ts` (HTTP + XHR giả).

### Chưa làm — chờ API / BE

- Kiểm upload với storage thật; test lỗi 422 hiện đúng field; E2E upload.
- Retry sau khi `complete` lỗi đang upload lại cả file, có thể để lại object mồ côi — cần BE xác nhận cách xử lý.

### Chưa làm — vấn đề review cần sửa (không cần API)

- Coverage dòng giảm từ 84.8% xuống 80.19% (vi phạm 'coverage không giảm so với dev').
- `@vee-validate/zod` chưa cài; `vee-validate` đã thêm nhưng chưa import ở đâu.
- `ImageUploader` chỉ nhận 1 file; chọn rỗng báo 'Tối đa 10 ảnh'; preview ảnh lỗi vẫn còn.
- `retry()` làm mất id của các file đã upload thành công trước đó.
- `UseMediaComponents.ts` re-export component (barrel, §B.3); MIME và giới hạn 5 MB lặp ở nhiều nơi; `ImageGallery` thiếu tên truy cập riêng cho từng ảnh.
- `UseUnsavedGuard` cho qua khi chỉ đổi query dù form đang dirty.
