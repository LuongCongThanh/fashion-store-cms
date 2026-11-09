# 06 — Báo cáo: Categories

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-06-categories`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/29
Base hiện tại: `feat/cms-05-products-list`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

Cây danh mục kéo thả/rollback, form bản dịch/SEO và chặn parent tạo vòng lặp.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 185 tests / 29 files PASS; +3 so với base PR |
| Coverage dòng                              | 85.23% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 83.08% / 80.55% / 76.87%                     |
| Production build                           | PASS                                         |
| Prettier format check                      | PASS                                         |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/features/categories/views/CategoryCreateView.spec.ts` — validates a localized category and maps API validation errors to the field (**passed**)
- `src/features/categories/views/CategoryEditView.spec.ts` — excludes descendants from parent choices and rejects a stale cyclic parent submission (**passed**)
- `src/features/categories/views/CategoryListView.spec.ts` — shows the category tree and rolls back a failed drag move (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 509.87 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #29.

### Đã làm (giữ nguyên)

- `CategoryTree` (kéo thả), `CategoryTreeToolbar`, `CategoryForm`, `CategorySelector`; logic cây thuần `CategoryTree.ts`; `Category.schema.ts`.

### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api/Categories.api.ts`, `api/CategoryEditor.api.ts`, `composables/UseCategoryEditor.ts`, `types/Category.types.ts`.
- 3 test view dùng HTTP giả.

### Chưa làm — chờ API / BE

- BE chưa xác nhận format dữ liệu đa ngôn ngữ, nhưng `translations.{vi,en}` đã được làm — cần đối chiếu lại khi có API.
- E2E kéo thả và lưu.

### Chưa làm — vấn đề review cần sửa (không cần API)

- Mọi lỗi validate đều hiện 'Không được để trống' (kể cả slug sai định dạng).
- `CategorySelector` gắn `:value` mảng vào `<select multiple>`, có thể không hiện giá trị đã chọn (cần kiểm); đang multi-select trong khi `Product.categoryId` là một giá trị.
- Merge `translations` nông; thả vào đúng chỗ cũ vẫn gửi PATCH; chưa có cách di chuyển bằng bàn phím.
- Query key `['categories', id]` có thể trùng key list; `UseCategories.ts` export component; view Create/Edit giống hệt nhau.
