# Dọn compatibility và đối chiếu kiến trúc thực tế

Type: task
Status: needs-triage
Blocked by: 14

## Mục tiêu và owner

Toàn repo paths/docs/config/rules/tests/generator references.

Không hoàn tác sửa đổi ngoài scope. Source migration chỉ bắt đầu sau mapping/baseline của issue 01; không commit/push/PR nếu chưa có yêu cầu riêng.

## Công việc

Xoá alias/path/rule tạm; rà private import/cycle/dead exports; CONVENTIONS/FE_architecture/README khớp source; không sửa glossary nghiệp vụ thành spec kỹ thuật.

## Đối chiếu coverage API toàn repo

Rà source cuối (direct HTTP, endpoint wrappers, runtime refresh và callers) đối chiếu ngược [checklist operation](../api-contract-checklist.md), không chỉ dùng generated diff. Mọi Backend operation đã phát hành và còn sử dụng phải typed theo method/path/params/query/body/response; không còn unverified/legacy-untyped, kể cả auth đã chuyển trước pilot. Pending chỉ hợp lệ khi có bằng chứng gating/ticket nhu cầu Backend; external storage có adapter contract riêng. Báo denominator và số operation từng trạng thái, evidence typechecking tương ứng; không tính pending/external thành typed.

## Tiêu chí hoàn tất

Không source cũ/mới trùng owner; full lint/format/typecheck/tests/build + critical E2E và contract check; knip theo policy nonblocking hiện hành; report rõ mọi giới hạn. Coverage typed của mọi Backend operation đã phát hành/còn sử dụng phải 100%; không đóng issue nếu chỉ endpoint pilot đạt. Contract-generated diff và typecheck toàn repo xanh không thay kiểm coverage này.

Cập nhật report với file đổi, lý do, lệnh thực sự chạy và kết quả. Đánh giá C11 của plan cũ đúng phase trước khi thêm test; không dùng nó để bỏ regression proof hoặc tự cho quyền vượt phase. Nếu vướng quy trình, ghi vào inventory và giải quyết trước edit.

## Tham chiếu

- [Thiết kế đã duyệt](../../../docs/plans/structure-migration/README.md)
- [Inventory ban đầu](../inventory.md)
- [Spec điều phối](../spec.md)

## Comments
