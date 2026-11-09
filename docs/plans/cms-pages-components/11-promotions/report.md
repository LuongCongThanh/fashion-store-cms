# 11 — Báo cáo: Promotions

Status: in-progress
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-11-promotions`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/34
Base hiện tại: `feat/cms-10-inventory`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

List và form coupon/auto; kiểm code, phần trăm và khoảng thời gian.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 203 tests / 43 files PASS; +4 so với base PR |
| Coverage dòng                              | 85.36% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 83.13% / 81.48% / 74.02%                     |
| Production build                           | PASS                                         |
| E2E                                        | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/features/promotions/schemas/Promotion.schema.spec.ts` — rejects percentage discounts over 100, missing coupon codes and reversed dates (**passed**)
- `src/features/promotions/views/PromotionCreateView.spec.ts` — creates an automatic promotion without a coupon code (**passed**)
- `src/features/promotions/views/PromotionEditView.spec.ts` — edits an automatic promotion into a fixed-value coupon with a new usage window (**passed**)
- `src/features/promotions/views/PromotionListView.spec.ts` — lists promotions with localized status and an edit link only for writers (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 676.05 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.
