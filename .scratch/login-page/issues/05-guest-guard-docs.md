# 05 — Guest guard + cập nhật docs

Status: resolved
Blocked by: 03, 04

Spec: Q5. `meta.guestOnly` cho `/login`, `/forgot-password`; đã đăng nhập thì chuyển về `/admin`. Cập nhật `RouteMeta.d.ts`, `Guards.ts`, `docs/navigation-flow.md` (đóng câu hỏi mở số 1, thêm route mới).

Test: Guards.spec — đã đăng nhập vào `/login` → `/admin`; chưa đăng nhập → vào được.
