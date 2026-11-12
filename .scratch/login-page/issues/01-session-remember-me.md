# 01 — Session hỗ trợ Remember me

Status: superseded
Blocked by: —

Spec: Q7. Sửa `src/shared/lib/session/Session.store.ts` + `Session.ts`: `signIn(tokens, { remember })`. Token lưu ở `localStorage` hoặc `sessionStorage`; khởi động đọc từ cả hai; logout/authFailure xoá cả hai; refresh ghi vào đúng nơi đang lưu. `useAuth().login(payload, { remember })`.

Test (viết trước): Session.spec — remember true/false, logout xoá cả hai, refresh giữ nguyên nơi lưu.

## Comments

- 2026-11-11: Superseded bởi PR #58 (auth backend integration) — Session dùng refresh cookie, bỏ Remember me và Mock auth. Xem `docs/plans/auth-backend-integration/decisions.md` D1.
