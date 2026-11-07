# Spec 05 — Session, HttpClient, Runtime

Status: ready-for-agent
Blocked by: 04
Nguồn: Step 3a (phần 2) · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Có Session, HttpClient một file và composition root createAppRuntime(), refresh token an toàn khi gọi đồng thời.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 3a (phần 2); mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- Tạo `shared/lib/api/`.
- `shared/lib/session/Session.ts` theo §M.2 (tạo **trước** HttpClient vì HttpClient phụ thuộc Session) + `Session.spec.ts`: N lời gọi `refresh()` đồng thời → 1 lần `callRefresh`; refresh thất bại → xoá token + phát `authFailure`; `logout()`/`switchStore()` gọi `queryClient.clear()`.
- `HttpClient.ts` (một file) theo §M.1 (interface hẹp, có kiểu theo `paths`, deps không có kiểu axios) + `HttpClient.spec.ts`: N request 401 → 1 lần `session.refresh()`; request `skipAuth` không có `Authorization`; refresh thất bại → Session phát `authFailure`; mọi request có `X-Store-Id`, `Accept-Language`; lỗi luôn là `ApiError`.
- `app/Runtime.ts` theo §M.2 (`createAppRuntime()`) + `Runtime.spec.ts`; `main.ts` chỉ một dòng `createApp(App).use(createAppRuntime().plugin).mount('#app')`. Chưa có `features/auth` nên Session bắt đầu ở trạng thái chưa đăng nhập.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

`npm test` pass; `shared/lib/` không import `features/` (ESLint); `client/` chỉ có `HttpClient.ts` + spec, refresh dùng `skipAuth` (§V.5); `Session.spec.ts` pass; `Runtime.spec.ts` pass: request có token + `X-Store-Id` + `Accept-Language`, `authFailure` điều hướng về `auth.login` (§V.1); `queryClient.clear()` chỉ xuất hiện trong `Session.ts`.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 04

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
