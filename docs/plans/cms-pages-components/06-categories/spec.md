# Spec 06 — Categories

Status: on-hold
Blocked by: 03, 04
Nguồn: §4.4 trong [danh mục page & component](../fashion-store-cms-pages-components.md) · Phase: P6 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Quản lý cây danh mục và cung cấp `CategorySelector` cho Product form.

## Phạm vi (Làm gì)

> **Chú thích:** tóm tắt; chi tiết từng bước trong `plan.md`.

- Routes: `categories` (`category:read`); `categories/new` và `categories/:id/edit` (`category:write`).
- Views: `CategoryListView`, `CategoryCreateView`, `CategoryEditView`.
- Components: `CategoryTree` (kéo thả để move), `CategoryTreeToolbar`, `CategoryForm` (SEO, localization theo FE_architecture), `CategorySelector` (interface công khai cho products).

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`. Áp dụng thêm Definition of Done (FE_architecture §31).

- Move bằng kéo thả gọi API và cập nhật cây; lỗi thì rollback.
- `CategorySelector` import được từ feature khác qua interface công khai.
- Route read/write bị chặn đúng theo `category:read` / `category:write`.
- `typecheck`, `lint`, `test` pass.
- E2E (Playwright) cho luồng category tree: tạo hoặc sửa, kéo thả và lưu pass.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 03, 04

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc backlog; không làm ở đây.

- Format localized data chưa được BE xác nhận → chặn phần localization nếu chưa có.
- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số liệu vào [metrics.md](../metrics.md).

## Trạng thái 2026-11-09

> Tạm dừng chờ API backend. Quyết định của người phụ trách ngày 2026-11-09: giữ nguyên phần đã làm, không làm thêm lớp dữ liệu hay dummy data; làm tiếp khi có API.

| Hạng mục                                        | Tình trạng                    |
| ----------------------------------------------- | ----------------------------- |
| UI component và logic thuần                     | Đã làm, giữ nguyên            |
| Lớp dữ liệu tạm (API/model/HTTP giả trong test) | Có, giữ nguyên đến khi có API |
| Việc chờ API / BE                               | 2 mục                         |
| Vấn đề review cần sửa (không cần API)           | 4 mục                         |

Chi tiết: [report.md](./report.md#review-2026-11-09--đã-làm-và-chưa-làm). Việc còn lại: [plan.md](./plan.md#tiếp-tục-khi-có-api).
