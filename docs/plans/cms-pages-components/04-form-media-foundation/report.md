# 04 — Báo cáo: Nền tảng Form & Media

Status: in-progress
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
