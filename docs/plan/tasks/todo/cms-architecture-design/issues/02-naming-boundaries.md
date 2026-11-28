# Chuẩn bị naming, alias và import boundaries

Type: task
Status: needs-triage
Blocked by: 01

## Mục tiêu và owner

eslint.config.ts, eslint.config.spec.ts, tsconfig, glob/import sorting và owner docs.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Enforce PascalCase Vue, useCamelCase composable, camelCase TS, kebab-case folder, .spec.ts. Cho coexist paths cũ/mới có phạm vi. Enforce modules public entries, integration không import module/app, nested workflows, production không import testing.

## Tiêu chí hoàn tất

Có ca import hợp lệ/bị cấm, nested paths, DTO boundary và test exemption; lint/typecheck không nới rule toàn cục; cũ/mới cùng chạy trong giai đoạn migration.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../../initiatives/structure-migration/map.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
