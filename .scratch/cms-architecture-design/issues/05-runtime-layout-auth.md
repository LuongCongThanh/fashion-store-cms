# Chuyển runtime, layout, session và auth

Type: task
Status: needs-triage
Blocked by: 04

## Mục tiêu và owner

app/runtime/providers/router, layouts, integrations/backend/session, modules/auth và auth endpoints/queries.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Giữ production/test chung factory. Tách auth endpoint/request từ Vue Query/workflow; auth user/permissions khác token session. Move QueryClient factory app/providers; truyền dependency tránh import ngược app.

## Bàn giao typing sang issue 06

Đối chiếu/cập nhật [checklist operation](../api-contract-checklist.md) cho mọi auth/session endpoint, bao gồm callRefresh trong runtime. Nếu giữ typing cũ ở slice path/runtime này, ghi legacy-untyped sau khi xác nhận contract và bàn giao trực tiếp cho issue 06; không xem auth/session đã đạt Q18 hoặc bỏ sót vì không nằm trong feature API.

## Tiêu chí hoàn tất

Áp dụng mục 2–3 của [gate chung cho slice](../spec.md#gate-chung-cho-slice) (owner docs/rules đồng bộ, public entry được ghi và lint) cho phần đã chuyển trong slice.

Auth guards/session/HttpClient/runtime tests, auth/layout E2E và build pass; concurrent 401 một refresh; mạng/5xx không logout oan; logout clear token/cache; URL/redirect/permissions giữ nguyên.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/cms-structure-migration.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
