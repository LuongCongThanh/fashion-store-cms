# 02 — Mock auth (tài khoản dummy DEV)

Status: superseded
Blocked by: —

Spec: Q9. Tạo `src/app/dev/MockAuth.ts`: adapter axios-mock-adapter giả lập `/auth/*` (login, me, refresh, forgot-password), truyền vào Runtime qua `transport`; tài khoản ở `features/auth/types/MockAccount.ts`. Chọn bản mock khi `import.meta.env.DEV && VITE_MOCK_AUTH === 'true'` (import động). Thêm `VITE_MOCK_AUTH` vào schema `Env.config.ts`, `.env.development`, `.env.example`. Nối `callRefresh` của Runtime với mock khi bật. Thêm `forgotPassword` vào `Auth.api.ts` (`POST /auth/forgot-password`, skipAuth).

Test: MockAuth.spec — đúng thông tin → tokens; sai → lỗi 401 giống HttpClient; me trả user có toàn bộ quyền. Build production không chứa `admin@cms.local`.

## Comments

- 2026-11-11: Superseded bởi PR #58 (auth backend integration) — Session dùng refresh cookie, bỏ Remember me và Mock auth. Xem `docs/plans/auth-backend-integration/decisions.md` D1.
