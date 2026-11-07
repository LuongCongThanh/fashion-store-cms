# Spec 08 — i18n

Status: in-progress
Blocked by: 05
Nguồn: Step 3c · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Có i18n vi/en, plugin sở hữu locale, đổi ngôn ngữ đồng bộ UI, <html lang>, Accept-Language.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 3c; mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- `I18n.ts` theo §H: `createAppI18n()` (plugin sở hữu locale), `useLocale()`; không singleton; `vi.json`/`en.json` có nhóm `common`.
- `App.vue` dùng `uiLocale` từ `useLocale()`.
- Spec (qua `renderWithPlugins()`): `useLocale().setLocale('en')` → text UI đổi sang tiếng Anh, `<html lang>`, `localStorage`, và `runtime.http` gửi `Accept-Language: en`.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

chuyển vi/en đổi cả text và component Nuxt UI, F5 vẫn giữ ngôn ngữ; `t('sai.key')` báo lỗi typecheck; không còn `app/stores/`; không còn export singleton `i18n` (§V.2).

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 05

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
