# Chuyển HTTP, generated contract và error policy

Type: task
Status: needs-triage
Blocked by: 02

## Mục tiêu và owner

shared/lib/api → integrations/backend; generator, CI contract diff, contract-bump workflow/script (cả generated path khi git add và PR body), coverage/ignore/alias và tất cả direct consumers.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Di chuyển transport/generated/error modules theo mapping; đổi imports tất cả consumer trong cùng slice. Giữ Axios/error/refresh adapter behavior. Chưa tách toàn bộ feature API hoặc củng cố typing trong PR path-only này.

## Tiêu chí hoàn tất

Generator cho nội dung contract tương đương, không bump Contract Version; CI diff trỏ đúng target; HttpClient/error tests và build/typecheck pass; không sửa generated thủ công.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/cms-structure-migration.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
