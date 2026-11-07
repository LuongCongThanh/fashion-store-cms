# Spec 09 — Khung features/auth và StoreScope

Status: in-progress
Blocked by: 06, 07, 08
Nguồn: Step 4 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Có khung features/auth (stub) và StoreScope, guard chặn route cần đăng nhập.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 4; mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- Tạo `features/auth/` theo §A với interface `useAuth()` (§8.1) trong `UseAuth.ts` — stub, chưa gọi API thật; bọc Session (§M.2), không có adapter riêng cho HttpClient.
- `LoginView.vue` rỗng.
- `Guards.ts` kiểm tra `meta.requiresAuth`, chỉ dùng `useAuth()` (không import store).
- `features/StoreScope/` stub: `useStoreScope()` bọc Session, `stores` cố định; `layouts/components/StoreSwitcher.vue` hiện tên Store.
- `useAuth()` bọc Session theo §M.2 (`login()` gọi API rồi `session.signIn()`, `logout()` = `session.logout()`); `Session.spec.ts` + `Runtime.spec.ts` (từ Step 3a) vẫn pass.
- `Guards.spec.ts` viết cùng step này (mock `@features/auth/UseAuth` theo §I).

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

truy cập `/admin` khi chưa đăng nhập → chuyển về `/login`; `Guards.spec.ts` pass; `main.ts` chỉ một dòng; không còn `queryClient.clear()` ngoài `Session.ts` — kể cả trong `UseAuth.ts`, `UseStoreScope.ts` (§V.1).

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 06, 07, 08

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
