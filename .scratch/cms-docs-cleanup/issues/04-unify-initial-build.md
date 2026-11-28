# Hợp nhất hồ sơ scaffold và prototype CMS

Type: task
Labels: wayfinder:task
Status: resolved
Assignee: current-session
Parent: ../map.md
Blocked by: 03

## Question

Hai bộ hồ sơ có thể gộp thành một bộ archive chuẩn hóa như thế nào, giữ rõ giai đoạn nền tảng và màn hình, nội dung độc nhất và metrics? Thực thi theo phạm vi đã được yêu cầu: gộp cặp spec/report theo bước, bỏ chú thích mẫu lặp và cập nhật consumer. Giữ trần 180 dòng từ yêu cầu trước; không gom 7.500 dòng thành một file lớn khi chưa có yêu cầu ghi đè rõ. Không sửa application code/config, commit/push/PR.

## Answer

Người phụ trách đã xác nhận một bộ archive, nhiều file ngắn. Đã hợp nhất thành [Dựng CMS ban đầu](../../../docs/archive/cms-initial-build/README.md), phân biệt Foundation và Pages. Mỗi bước có một hồ sơ chứa đặc tả/kế hoạch và kết quả/review; không trộn trạng thái, ID hoặc số đo.

Hai bộ từ 100 còn 72 file; file dài nhất 174 dòng. [Hồ sơ hợp nhất](../archive-unification.md) ghi cây cuối, cách chuẩn hóa và bằng chứng kiểm tra. Không còn việc trong scope ticket đang chờ. Không commit/push/PR.
