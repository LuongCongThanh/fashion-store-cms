# 03 — Báo cáo: Nền tảng List & Table

Status: in-progress
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-03-list-table-foundation`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/26
Base hiện tại: `feat/cms-02-dashboard`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

URL là nguồn state list; bảng server-side, selection, pagination và pattern dùng lại.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 177 tests / 24 files PASS; +4 so với base PR |
| Coverage dòng                              | 84.8% (toàn nhánh tại checkpoint)            |
| Coverage statements / branches / functions | 83.11% / 83.5% / 78.44%                      |
| Production build                           | PASS                                         |
| E2E                                        | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/shared/composables/UseListState.spec.ts` — restores validated URL state and resets page when a filter changes (**passed**)
- `src/shared/composables/UseListState.spec.ts` — debounces search without dropping it when another filter changes (**passed**)
- `src/shared/components/table/TableFoundationView.spec.ts` — lets a list View sort, paginate, select and hide columns using controlled table state (**passed**)
- `src/shared/components/table/TableFoundationView.spec.ts` — shows a list error with retry, then renders an empty table and loading placeholder (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 447.33 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.
