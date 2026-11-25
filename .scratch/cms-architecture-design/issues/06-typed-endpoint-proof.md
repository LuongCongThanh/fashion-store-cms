# Chứng minh endpoint typed theo API Contract

Type: task
Status: needs-triage
Blocked by: 05

## Mục tiêu và owner

Backend client typing, một endpoint thật để proof và toàn bộ operation auth/session đã chuyển ở issue 05, kể cả runtime refresh; compile-time contract cases.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Kiểm method/path/path params/query/body/response, success 200/201/204, signal/error semantics; giữ Axios. Không chỉ bật HasPaths. Chọn operation contract đã có; phần API chưa có tiếp tục bị chặn/ghi riêng.

Sau khi proof, áp dụng typed boundary cho **mọi operation auth/session đã phát hành** được issue 05 bàn giao: login, me, forgot/reset password, logout và refresh tại runtime, theo [checklist operation](../api-contract-checklist.md). Rà mọi direct HTTP/cast/wrapper của phạm vi này; không giới hạn kết quả vào endpoint pilot. Giữ contract thiếu ở trạng thái blocked có evidence, không giả định toàn bộ operation đã release.

## Tiêu chí hoàn tất

Ca typecheck reject request sai và accept request đúng; transport runtime tests giữ refresh/errors/cancellation; không as-cast để che contract gap, không tạo endpoint đoán. Mọi operation auth/session đã phát hành trong checklist phải typed, kể cả callRefresh; không còn unverified/legacy-untyped trong phạm vi hoàn tất. Ghi evidence signature/call sites/typecheck và handoff các slice 07–14; pilot xanh riêng lẻ không đủ đóng issue.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/cms-structure-migration.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
