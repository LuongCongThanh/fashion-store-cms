# Chuẩn hóa bộ tài liệu CMS theo chủ đề và độ dài

Type: task
Labels: wayfinder:task
Status: resolved
Assignee: current-session
Parent: ../map.md
Blocked by: 01

## Question

Tách và chuẩn hóa trực tiếp bộ tài liệu theo yêu cầu mới: mỗi file một chủ đề, nội dung vừa phải dễ đọc; không mất policy, quyết định hoặc bằng chứng lịch sử. Tổ chức owner, mục lục và liên kết thế nào để người đọc tìm đúng phần mà không đọc tài liệu lớn?

Yêu cầu thực thi đã xác nhận; giữ phần lịch sử còn giá trị, không sửa application code hoặc commit/push/PR. Nhắm 50–150 dòng/file, trần 180 dòng Markdown (kể cả archive); file mục lục/ADR/report ngắn được phép ít hơn.

## Answer

Đã chuẩn hóa trực tiếp theo nhóm architecture/guides/ADR/plans/research/archive, giữ các entrypoint repo đang dùng làm mục lục. Tách các file lớn theo chủ đề, tách lịch sử khỏi plans, cập nhật liên kết và bỏ mô tả/code mẫu đã cũ. File Markdown dài nhất trong docs còn 167 dòng; không có file vượt 180.

Hồ sơ thay đổi, phạm vi chỉnh sửa và kết quả kiểm tra: [Chuẩn hóa tài liệu theo chủ đề](../normalization.md). Người đọc bắt đầu từ [mục lục docs](../../../../README.md). Không có thay đổi source/config, commit/push/PR hoặc gate runtime được báo như đã chạy.
