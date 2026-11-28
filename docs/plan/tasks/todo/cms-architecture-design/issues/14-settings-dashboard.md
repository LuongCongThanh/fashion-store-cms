# Phân loại và chuyển settings/dashboard

Type: task
Status: needs-triage
Blocked by: 13

## Mục tiêu và owner

Settings forms và dashboard widgets, endpoints/query/types/tests hiện hữu.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Chỉ cấu hình vận hành API cung cấp; số liệu Backend authoritative. Không biến chính sách static/i18n UI thành chức năng CMS mới.

## Gate chung

Áp dụng đủ bốn mục của [gate chung cho slice](../spec.md#gate-chung-cho-slice): mọi dòng có Slice = 14 trong [checklist operation](../api-contract-checklist.md) đạt trạng thái đích, owner docs/rules đồng bộ, public entry được ghi và lint, refetch không ghi đè draft dirty.

## Tiêu chí hoàn tất

Pending gating đúng, UI/data baseline giữ; không hard-code revenue/stock policy; lint/typecheck/test/build và E2E affected pass.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../../initiatives/structure-migration/map.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
