# 01 — Báo cáo: Hoàn thiện Layout

Status: on-hold
Triển khai frontend: hoàn thành, đã kiểm trên nhánh riêng.
Nhánh: `feat/cms-01-layout-completion`
PR: https://github.com/LuongCongThanh/fashion-store-cms/pull/24
Base hiện tại: `dev`; đổi về `dev` khi PR phụ thuộc đã squash merge.
Ngày kiểm: 2026-11-09. Chưa merge; không đánh dấu done thay cho reviewer.

## Đã làm

Breadcrumb theo route, đổi locale/theme và sidebar theo quyền.

## Kết quả kiểm tra

| Kiểm tra                                   | Kết quả                                      |
| ------------------------------------------ | -------------------------------------------- |
| Typecheck                                  | PASS                                         |
| Lint                                       | PASS                                         |
| Vitest                                     | 169 tests / 21 files PASS; +4 so với base PR |
| Coverage dòng                              | 85.25% (toàn nhánh tại checkpoint)           |
| Coverage statements / branches / functions | 83.84% / 81.9% / 80.63%                      |
| Production build                           | PASS                                         |
| E2E                                        | HOÃN theo lựa chọn của người phụ trách       |
| Backend / Swagger                          | CHƯA CÓ, đã được người phụ trách xác nhận    |

Test chạy trên đúng nhánh này, không lấy số test của nhánh tổng thay cho PR con. Log kiểm tra được dùng để điền [metrics.md](../metrics.md).

## Hành vi đã kiểm qua seam được duyệt

- `src/app/views/Layout.spec.ts` — Layout navigation shows translated ancestor breadcrumbs and switches language without changing the URL (**passed**)
- `src/app/views/Layout.spec.ts` — Layout navigation keeps system as a selectable persisted theme (**passed**)
- `src/app/views/Layout.spec.ts` — Layout navigation groups permitted links under their domain (**passed**)
- `src/app/views/Layout.spec.ts` — Layout navigation hides sidebar links when the current user lacks permission (**passed**)

## Bundle

Tổng JavaScript gzip của toàn bộ nhánh (gồm các chunk tải động): 259.8 kB. Đây không phải kích thước tải ban đầu của riêng feature.

## Token

Phần triển khai ban đầu bị làm chung trong một phiên, nên không có bộ đếm độc lập chính xác cho plan này. Không chia đều hoặc bịa số token theo PR. Tổng task và các phiên review con được ghi từ event token_count trong Codex ở metrics/token artifact của plan 14.

## Việc còn tồn / giới hạn

- API/model hiện là hợp đồng tạm; chưa có tích hợp backend thật hoặc type Swagger generated.
- E2E và kiểm giao diện thủ công chưa được thực hiện trong phạm vi kiểm thử đã chốt.
- Reviewer duyệt, squash merge theo thứ tự phụ thuộc; sau đó đổi base PR kế tiếp về dev.

## Review 2026-11-09 — đã làm và chưa làm

Status: on-hold. Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API. Review chuỗi PR theo hai trục: tuân thủ CONVENTIONS/FE_architecture và đúng spec. PR: #24.

### Đã làm (giữ nguyên)

- Breadcrumb theo route, `LanguageSwitcher`, `ThemeSwitcher`, `AppSidebar` nhóm theo permission, `PageContainer`.
- Không có lớp dữ liệu mới; component chỉ dùng router, i18n, theme và `useAuth().can()` sẵn có.

### Lớp dữ liệu tạm (giữ nguyên, thay khi có API)

- Không có.

### Chưa làm — chờ API / BE

- E2E (Playwright) cho layout: hoãn.

### Chưa làm — vấn đề review cần sửa (không cần API)

- `authGuard` chỉ gọi `ensureUser()` khi route có `meta.permission`; reload ở `/` hoặc `/403` làm sidebar ẩn hết mục. `Layout.spec.ts` tự gọi `ensureUser()` nên không bắt được lỗi.
- Breadcrumb chưa đúng với cây route thật: layout không có `titleKey`, `/` bị loại khỏi ancestors, `/403` render `<nav>` rỗng.
- `LanguageSwitcher.vue` hard-code nhãn `Tiếng Việt` / `English`; switcher trùng chức năng với `UserMenu` nhưng CONVENTIONS §L.11, §S.1 chưa cập nhật.
- Thiếu unit test cho `breadcrumbs`, `sidebarGroups` trong `Navigation.spec.ts`; test theme chưa kiểm `matchMedia` điều khiển class `dark`.
- `report.md` thay bảng kiểm từng tiêu chí bằng bảng chung typecheck/lint/coverage.
