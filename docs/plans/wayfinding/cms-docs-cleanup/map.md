# Rà soát và tinh gọn tài liệu CMS

Labels: wayfinder:map

## Destination

Cập nhật `docs/` theo source hiện tại; gộp nội dung lặp, bỏ tài liệu đã được thay thế và giữ quyết định/bằng chứng lịch sử còn giá trị. Có bảng phân loại từng file và kiểm tra liên kết sau sửa. Mở rộng theo yêu cầu tiếp theo: chuẩn hóa theo chủ đề, mỗi file có nội dung vừa phải và dễ đọc; bỏ entrypoint cũ/file dư và thống nhất cây thư mục.

## Notes

- Người phụ trách xác nhận ngày 26/11/2026: sửa luôn, giữ lịch sử còn giá trị. Cho phép execution trong map này, ghi đè mặc định planning-only và dừng sau charting của Wayfinder.
- Dùng grilling/domain-modeling để phân biệt quy tắc hiện hành, thiết kế đã duyệt chưa triển khai và bằng chứng lịch sử. Cho phép cập nhật đường dẫn trong hướng dẫn repo khi tài liệu đổi chỗ. Không thay đổi source, UI hoặc API Contract; không commit/push/PR.
- Mỗi phiên xử lý một ticket; người dùng đã yêu cầu thực thi trực tiếp cả đợt chuẩn hóa. Tracker theo `docs/agents/issue-tracker.md`.

## Decisions so far

- [Đối chiếu, phân loại và tinh gọn docs CMS](issues/01-reconcile-docs.md): đã áp dụng cleanup; nguồn chuẩn và lịch sử được phân biệt, bảng đánh giá từng file và kiểm tra nằm trong ticket.

- [Chuẩn hóa bộ tài liệu CMS theo chủ đề và độ dài](issues/02-topic-documentation.md): đã chia owner thành file ngắn, tách archive và cập nhật liên kết; hồ sơ kiểm tra được link trong ticket.

- [Bỏ file dư và thống nhất cây tài liệu CMS](issues/03-prune-and-tree.md): giảm ròng 38 file, dùng README trong từng nhóm và cập nhật consumer; kết quả kiểm tra ở hồ sơ được link trong ticket.

- [Hợp nhất hồ sơ scaffold và prototype CMS](issues/04-unify-initial-build.md): người phụ trách chọn một archive nhiều file ngắn; đã gộp 28 cặp đặc tả/báo cáo, giữ giai đoạn và metrics, cập nhật consumer.

## Not yet specified

Không có quyết định sản phẩm chờ người dùng. Sai lệch chức năng phát hiện qua docs sẽ ghi thành giới hạn, không tự triển khai.

## Out of scope

Migration cấu trúc source, thay UI, bump contract, xác minh triển khai production và thay tài liệu của ứng dụng khác.
