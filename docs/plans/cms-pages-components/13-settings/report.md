# 13 — Báo cáo: Settings

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-13-settings`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/36
Base hiện tại: `feat/cms-12-users-roles`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

Thông tin Store/logo và localization tách khỏi locale giao diện CMS.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 211 tests / 51 files PASS; +2 so với base PR |
| Coverage dòng                              | 84.55% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 82.42% / 80.73% / 73.61%                     |
| Production build                           | PASS                                         |
| Prettier format check                      | PASS                                         |
| E2E nghiệp vụ mới                          | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/features/settings/views/LocalizationSettingsView.spec.ts` — saves localization preferences without changing the CMS interface language (**passed**)
- `src/features/settings/views/StoreSettingsView.spec.ts` — loads Store settings and saves the edited contact information (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 692.01 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #36.

### Đã làm (giữ nguyên)

- `StoreSettingsForm`, `LocalizationSettingsForm` (dùng `ImageUploader`).

### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- `api/Settings.api.ts`, `UseStoreSettingsEditor.ts`, `UseLocalizationEditor.ts` (có giá trị mặc định cứng Ho_Chi_Minh / VND / vi, en).
- 2 test view dùng HTTP giả.

### Chưa làm — chờ API / BE

- Lưu cấu hình thật; thêm `types/` theo contract.
- E2E redirect settings và lưu Store/localization.

### Chưa làm — vấn đề review cần sửa (không cần API)

- **Bug:** ô ngôn ngữ nuốt dấu phẩy, không thêm được ngôn ngữ thứ hai (`LocalizationSettingsForm.vue:28,33`).
- Lỗi validate bị thay bằng 'required' / 'invalid' chung, hiện dạng key thô; lỗi `logo.*` không hiện; không xóa được logo.
- Sidebar hiện mục Settings với `settings:read` nhưng dẫn tới route cần `settings:write` → 403.
- Plan làm khi plan 04 (Blocked by) chưa done.
