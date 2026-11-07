# 02 — Mock auth (tài khoản dummy DEV)

Status: resolved
Blocked by: —

Spec: Q9. Tạo `src/features/auth/api/Auth.mock.ts` cùng interface với `useAuthApi` (login, me, refresh, forgotPassword). Chọn bản mock khi `import.meta.env.DEV && VITE_MOCK_AUTH === 'true'` (import động). Thêm `VITE_MOCK_AUTH` vào schema `Env.config.ts`, `.env.development`, `.env.example`. Nối `callRefresh` của Runtime với mock khi bật. Thêm `forgotPassword` vào `Auth.api.ts` (`POST /auth/forgot-password`, skipAuth).

Test: Auth.mock.spec — đúng thông tin → tokens; sai → lỗi 401 giống HttpClient; me trả user có toàn bộ quyền. Build production không chứa `admin@cms.local`.
