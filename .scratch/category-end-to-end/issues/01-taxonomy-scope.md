# Chốt mô hình category và phạm vi bản hoàn thiện

Part of: [Hoàn thiện category xuyên suốt BE, CMS và store](../map.md)
Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: maintainer (phiên tương tác hiện tại)
Blocked by:

## Question

Giữ cây category loại sản phẩm, Gender là filter riêng, mỗi sản phẩm một category theo domain hiện tại hay thay mô hình? Taxonomy thực tế cần những nhánh nào và có cần giới hạn độ sâu không?

Đề xuất để thảo luận: giữ mô hình, quyền ADMIN ghi/STAFF đọc và RESTRICT khi xóa; xác nhận bằng ví dụ Áo → Áo thun. Phân biệt thay taxonomy dữ liệu với thay model. Đầu ra là phạm vi được người dùng xác nhận và các quy tắc kế thừa; không xem tài liệu cũ mô tả “Nam > Áo” là quyết định mới vì có thể lệch glossary Gender.

## Answer

2026-11-19 — Người dùng xác nhận: “Đồng ý giữ quy tắc hiện tại”. Giữ category là cây loại sản phẩm, Gender là filter riêng, mỗi sản phẩm một category; giữ quyền và RESTRICT khi xóa. Không bổ sung taxonomy dữ liệu mới hay giới hạn độ sâu mới trong bản hoàn thiện này; dùng cây dữ liệu hiện có và cơ chế quản trị hiện tại.

Đây là chốt mô hình và quy tắc kế thừa; nội dung song ngữ, media và URL được ghi ở các ticket riêng.
