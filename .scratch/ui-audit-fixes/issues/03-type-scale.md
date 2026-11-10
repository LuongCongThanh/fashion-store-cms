# 03 — Thang chữ KPI và tiêu đề section

Status: completed
Blocked by: —

Xem `../spec.md`, lát 3 (story 29–31).

- `StatCard` thêm `size: 'hero' | 'secondary'` (mặc định `secondary`).
- `FormSection`: tiêu đề `text-base font-semibold`, nền `bg-default`.
- Card dashboard: `space-y-4`.
- Ví dụ KPI ở trang design system theo đúng hai cỡ.

Test: StatCard spec cho hai cỡ; spec hiện có vẫn xanh.

Ghi chú: nên merge trước `ui-ux-hardening/issues/12` để dashboard mới dùng được `size="hero"`.

## Comments

### 2026-11-10 — Implementation

Đã thêm StatCard size hero/secondary (mặc định secondary), chuẩn hoá FormSection, spacing/heading card dashboard và ví dụ KPI trong design system.

TDD: test KPI đỏ với text-3xl cũ, xanh sau khi thêm hai cỡ theo contract. Không đổi token hay DESIGN.md.

Validation: 58 file / 277 unit test qua; build (gồm vue-tsc), ESLint và Prettier qua; 4 cấu hình Chromium qua.
