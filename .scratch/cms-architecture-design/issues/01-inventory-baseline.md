# Chốt mapping file, consumer và baseline

Type: task
Status: ready-for-agent
Blocked by: none

## Mục tiêu và owner

Toàn bộ src, e2e, config; chỉ khảo sát và hoàn thiện inventory/spec, không đổi behavior.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Cập nhật checkout/source facts; lập mapping source→target cho mọi file/symbol, public consumer, endpoint readiness và test owner. Ghi baseline từng lệnh và lỗi có trước; chia lại ticket nếu một slice không build độc lập.

## Inventory API bắt buộc

Hoàn thiện [checklist operation](../api-contract-checklist.md) cho mọi Backend call site và external request, gồm auth/session refresh ở runtime. Đối chiếu Contract Version/generated paths, owner/caller, gating và slice phụ trách; không để bảng chỉ có sáu dòng auth khởi tạo. Mỗi operation phải có normalized method+contract path và trạng thái ban đầu, không suy release từ việc source có import DTO.

## Tiêu chí hoàn tất

Bảng inventory 295 file được refresh; mọi mapping chưa rõ được giải quyết; kết quả lint/typecheck/test/build/E2E phân biệt chưa chạy/đạt/lỗi có trước. Không đánh dấu xanh từ static inspection. Checklist phủ mọi operation/call site và nêu phần pending/external rõ ràng; semantic mapping không được xem xong nếu còn endpoint chưa phân loại.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/cms-structure-migration.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
