# 13 — Settings

Status: in-progress
Blocked by: 04
Nguồn: §4.11 trong [danh mục page & component](../../fashion-store-cms-pages-components.md) · Phase P10 · Spec: [spec.md](./spec.md)

Phần dùng chung (không chép lại): quy tắc đặt component (nguồn §1), [CONVENTIONS.md](../../../CONVENTIONS.md) §A, §B, §E, §Q; [FE_architecture.md](../../../FE_architecture.md) §5, §6, §9, §22, §23, §31; [GLOSSARY.md](../../../../GLOSSARY.md).

### Làm gì

- Routes: `settings` (`settings:read`) redirect đến `settings/store`; `settings/store` và `settings/localization` (`settings:write`).
- Store: name, logo (`ImageUploader`), description, contact email, phone, address.
- Localization: languages, default language, timezone, currency, date/number format.

Nguyên tắc chung:

- Component không gọi HTTP: View → composable của feature → props xuống component.
- Ẩn/hiện theo permission (`useAuth().can('<resource>:<action>')`), không theo tên role.
- Text qua i18n (vi + en); type API lấy từ `Api.generated.ts`.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33).

**Ghi chú:** —

**Output:** `features/settings/**`.

**Kiểm tra:**

- Redirect đúng; không có `settings:write` thì form read-only hoặc bị chặn theo route meta.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng redirect settings và lưu Store/localization pass.
