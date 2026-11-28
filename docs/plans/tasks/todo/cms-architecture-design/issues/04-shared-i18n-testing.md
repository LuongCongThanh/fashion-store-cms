# Chuyển shared helpers, i18n, styles, PWA và testing

Type: task
Status: needs-triage
Blocked by: 03

## Mục tiêu và owner

shared helpers, I18n/locales, test setup/render/stub/factories, styles/assets/PWA và config consumers.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Phân loại từng helper theo owner, không thay shared/lib bằng kho khác. Cập nhật config CSS/logo/PWA/theme key/index.html và test alias cùng consumers. Nếu mapping cho thấy quá rộng, chia sub-ticket riêng trước khi source edit.

## Tiêu chí hoàn tất

Áp dụng mục 2–3 của [gate chung cho slice](../spec.md#gate-chung-cho-slice) (owner docs/rules đồng bộ, public entry được ghi và lint) cho phần đã chuyển trong slice.

Giữ locale/format/theme/notification/form semantics; test setup và PWA stub hoạt động; build/assets và E2E liên quan pass; không cache API sau logout.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../../structure-migration/README.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
