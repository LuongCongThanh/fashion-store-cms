# Chốt vòng đời slug và URL category

Part of: [Hoàn thiện category xuyên suốt BE, CMS và store](../map.md)
Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: Codex
Blocked by:

## Question

Đổi tên category nên giữ slug, đổi slug như hiện tại hay giữ lịch sử để redirect? Khi di chuyển category, link và breadcrumb phải ra sao?

Đề xuất để thảo luận: slug ổn định sau tạo; kiểm tra uniqueness, dữ liệu/link hiện có và xử lý URL không tồn tại. Nếu chọn redirect phải xác định lưu lịch sử, mã redirect và tương thích locale. Code hiện sinh lại slug khi đổi name; chưa được phép tự thay quy tắc.

## Comments

2026-11-19 — Người dùng chọn “Giữ slug ổn định (đề xuất)”. Đổi tên không đổi slug sau khi tạo. Ticket vẫn mở; cần cụ thể hóa slug khi có vi/en, đổi cha và xử lý dữ liệu hiện có. Chưa resolve ticket thứ hai trong phiên này theo Wayfinder.

## Answer

2026-11-19 — Triển khai BE theo lựa chọn giữ slug ổn định của người dùng. Một slug chung cho vi/en, sinh từ tên Việt khi tạo; đổi tên/cha/locale không đổi slug. Giữ mọi slug hiện có, không có rename migration, lịch sử redirect hay API sửa slug. Tên hiển thị sau rename không phải unique identity; tạo mới va chạm slug đang được giữ trả 409 như hiện tại. URL category không tồn tại hoặc nhánh ẩn trả 404. Hợp đồng và acceptance BE: [Hoàn thiện hợp đồng category cho CMS và store](../../../../be-demo/docs/plan/tasks/21-category-content/spec.md).
