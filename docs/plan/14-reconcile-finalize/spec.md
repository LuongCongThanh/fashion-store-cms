# Spec 14 — Đối chiếu và chốt

Status: ready-for-agent
Blocked by: 10, 11, 12, 13
Nguồn: Step 7 · Spec tổng: [../spec.md](../spec.md) · Chi tiết: [plan.md](./plan.md)

> **Chú thích:** spec trả lời câu hỏi _làm gì và thế nào là xong_. Cách làm và phần tham chiếu kỹ thuật nằm trong `plan.md`, các bước thực hiện nằm trong [Quy trình](../spec.md#quy-trình-thực-hiện-mỗi-plan) của spec tổng.

## Lưu ý bắt buộc

Xem [Lưu ý bắt buộc](../spec.md#lưu-ý-bắt-buộc) trong spec tổng.

## Mục tiêu

> **Chú thích:** kết quả mà người dùng/dev nhận được sau khi plan xong.

Cây thư mục khớp §A, convention chuyển sang CONVENTIONS.md, plan được archive.

## Phạm vi (Làm gì)

> **Chú thích:** chép từ mục "Làm gì" của Step 7; mã § và D trỏ vào [scaffold-plan.md](../scaffold-plan.md) hoặc phần tham chiếu trong `plan.md`.

- So cây thư mục thực tế với §A, sửa chỗ lệch; `npm run lint` toàn repo pass.
- Tách tài liệu (§ nguyên tắc): §B–§U → `docs/CONVENTIONS.md` (bỏ phần lịch sử/lý do dài); bảng quyết định D + lý do (§V) giữ nguyên trong plan đã archive; plan → `docs/archive/scaffold-plan.md`. `FE_architecture.md` link sang `CONVENTIONS.md` thay vì lặp lại.
- Sửa link: `grep -n 'scaffold-plan' docs/FE_architecture.md README.md` phải về 0 kết quả — mỗi link (D-số, §B–§U) đổi sang mục tương ứng trong `CONVENTIONS.md`; link tới lý do quyết định (§V) đổi sang `docs/archive/scaffold-plan.md`.

## Tiêu chí hoàn thành

> **Chú thích:** mỗi tiêu chí phải được kiểm và ghi vào `report.md` trước khi đổi `Status: done`.

- Cây thư mục thực tế khớp §A; `npm run lint` toàn repo pass.
- `docs/CONVENTIONS.md` có §B–§U; plan đã chuyển sang `docs/archive/`.
- `grep -n 'scaffold-plan' docs/FE_architecture.md README.md` trả về 0 kết quả.

## Phụ thuộc

> **Chú thích:** chỉ bắt đầu khi mọi plan trong `Blocked by` đã `done`.

- Blocked by: 10, 11, 12, 13

## Ngoài phạm vi

> **Chú thích:** việc thuộc plan khác hoặc Phase nghiệp vụ sau; không làm ở đây.

- Những việc của các plan con khác trong [spec tổng](../spec.md#danh-sách-plan-con).
- Feature nghiệp vụ, gọi API thật (xem "Ngoài phạm vi" trong scaffold-plan.md).

## Ghi nhận

> **Chú thích:** sau khi làm xong, điền kết quả vào [report.md](./report.md) và số token vào [token-usage.md](../token-usage.md).
