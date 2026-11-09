# 14 — Báo cáo: Đối chiếu và chốt

Status: in-progress
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-14-reconcile-finalize`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/37
Base hiện tại: `feat/cms-13-settings`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

Đối chiếu toàn bộ, tài liệu, metrics, token usage và báo cáo review/tích hợp.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                       |
| ------------------------------------------ | --------------------------------------------- |
| Typecheck                                  | PASS                                          |
| Lint                                       | PASS                                          |
| Vitest                                     | 221 tests / 52 files PASS; +10 so với base PR |
| Coverage dòng                              | 85.67% (toàn nhánh tại checkpoint)            |
| Coverage statements / branches / functions | 83.54% / 81.04% / 74.35%                      |
| Production build                           | PASS                                          |
| E2E                                        | HOÃN theo lựa chọn của người phụ trách        |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận     |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/app/views/CmsRouting.spec.ts` — blocks write route /products/new for a user with only product:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /categories/new for a user with only category:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /promotions/new for a user with only promotion:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /users/new for a user with only user:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /roles/new for a user with only role:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /settings/store for a user with only settings:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — blocks write route /settings/localization for a user with only settings:read (**passed**)
- `src/app/views/CmsRouting.spec.ts` — redirects settings to the Store editor for an authorized user (**passed**)
- `src/app/views/CmsRouting.spec.ts` — shows the product ancestor in breadcrumbs for a create route (**passed**)
- `src/app/views/CmsRouting.spec.ts` — keeps an unsaved product form open when the user cancels leaving (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 692.01 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Kiểm toán cuối

- Knip và analyze: PASS. Các chart và Tiptap nằm trong chunk tải động; số đo bundle ở validation-metrics.json.
- Đã đối chiếu danh mục, cập nhật FE_architecture, CONVENTIONS, GLOSSARY, navigation flow, report của 14 plan và chuỗi PR.
- Token task tại snapshot `2026-11-09T00:01:40.894Z`: **40,618,102**, trong đó cached input là 40,133,760 (đã nằm trong input).
- Không có số token triển khai độc lập từng plan hoặc hóa đơn USD; không ước lượng thay dữ liệu thật.
- Backend chưa có, E2E hoãn, PR chưa merge: giữ in-progress và chưa archive.
