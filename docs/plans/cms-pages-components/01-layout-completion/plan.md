# 01 — Hoàn thiện Layout

Status: on-hold
Blocked by: —
Nguồn: §2, §3 (`PageContainer`) trong [danh mục page & component](../fashion-store-cms-pages-components.md) · Phase P3 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- `layouts/components/AppBreadcrumb.vue`: dựng từ route meta `titleKey` qua `Navigation.ts`.
- `layouts/components/LanguageSwitcher.vue`: đổi locale vue-i18n, lưu lựa chọn (`useLocalStorage`), không đổi URL.
- `layouts/components/ThemeSwitcher.vue`: Light / Dark / System qua `UseTheme`.
- `shared/components/page/PageContainer.vue`: max-width + padding.
- Sidebar nhóm theo domain (Dashboard · STORE · CUSTOMERS · MARKETING · SYSTEM), item lọc theo permission từ route meta.
- Gắn các component vào `AppHeader` / `DashboardLayout`; thêm key i18n vi/en.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** Không cài package mới.

**Output:** Component layout mới + spec test.

**Kiểm tra:**

- Breadcrumb đúng với route lồng nhau, dịch theo locale.
- Đổi ngôn ngữ giữ nguyên URL, reload vẫn giữ locale.
- Theme System theo `prefers-color-scheme`.
- Sidebar ẩn item khi thiếu permission.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng breadcrumb, đổi locale/theme và sidebar theo permission pass.

### Tiếp tục khi có API

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

**Sửa được ngay, không cần API** (từ review 2026-11-09):

- [ ] `authGuard` chỉ gọi `ensureUser()` khi route có `meta.permission`; reload ở `/` hoặc `/403` làm sidebar ẩn hết mục. `Layout.spec.ts` tự gọi `ensureUser()` nên không bắt được lỗi.
- [ ] Breadcrumb chưa đúng với cây route thật: layout không có `titleKey`, `/` bị loại khỏi ancestors, `/403` render `<nav>` rỗng.
- [ ] `LanguageSwitcher.vue` hard-code nhãn `Tiếng Việt` / `English`; switcher trùng chức năng với `UserMenu` nhưng CONVENTIONS §L.11, §S.1 chưa cập nhật.
- [ ] Thiếu unit test cho `breadcrumbs`, `sidebarGroups` trong `Navigation.spec.ts`; test theme chưa kiểm `matchMedia` điều khiển class `dark`.
- [ ] `report.md` thay bảng kiểm từng tiêu chí bằng bảng chung typecheck/lint/coverage.

**Chờ API / BE:**

- [ ] E2E (Playwright) cho layout: hoãn.

**Khi có API:** thay type viết tay bằng type sinh từ Swagger, nối lại lớp dữ liệu tạm với endpoint thật, chạy E2E, rồi kiểm lại các tiêu chí hoàn thành trong [spec.md](./spec.md).
