# Chốt vận hành tự dịch tên category

Part of: [Hoàn thiện category xuyên suốt BE, CMS và store](../map.md)
Type: grilling
Labels: wayfinder:grilling
Status: open
Assignee:
Blocked by:

## Question

Với hướng nhập tên Việt và tự dịch sang Anh đã được người dùng xác nhận trong [Chốt trải nghiệm category trên store và nội dung CMS](02-store-content-scope.md), dịch có chặn thao tác lưu không? Khi dịch lỗi, chưa có bản dịch, hoặc đổi tên Việt sau khi bản Anh đã sửa tay thì xử lý thế nào? Nhà cung cấp và cấu hình dịch nào phù hợp; category hiện có được backfill bằng cách nào?

Đề xuất để người dùng phản hồi: lưu tên Việt trước, dịch nền, store fallback tên Việt khi thiếu bản Anh; có trạng thái và thao tác thử lại trong CMS. Với bản Anh đã chỉnh tay, giữ lại và báo cần rà soát khi tên Việt đổi, cho phép chủ động dịch lại. Hành vi này đã được người dùng xác nhận trong Comments; nhà cung cấp và backfill vẫn mở.

Chỉ nghiên cứu nhà cung cấp bên ngoài sau khi chốt các ràng buộc chi phí, quyền truy cập và vận hành; chưa chọn vendor hoặc tự tạo credential.

## Comments

2026-11-19 — Người dùng chọn “Đồng ý hướng đề xuất”: lưu tên Việt trước rồi dịch nền; thiếu bản Anh hoặc dịch lỗi thì store fallback về tên Việt; CMS có trạng thái và thử lại. Nếu tên Anh đã sửa tay, khi đổi tên Việt phải giữ bản Anh và báo cần rà soát; cho chủ động dịch lại.

Ticket còn mở cho nhà cung cấp, cấu hình vận hành và cách backfill dữ liệu hiện có. Khi cụ thể hóa triển khai cần tránh kết quả dịch của tên cũ ghi đè tên mới hoặc bản sửa tay; đây là yêu cầu nhất quán suy ra từ hành vi đã chốt, chưa chọn cơ chế job/schema.

## Implementation handoff

2026-11-19 — Người dùng chọn “Tự dịch rồi cho sửa (Google, cần key khi bật)”. BE tích hợp Google Cloud Translation Basic v2; không cấu hình key thì worker tắt, giữ PENDING và fallback Việt. Category cũ backfill từ PENDING theo batch khi bật key; lỗi FAILED, ADMIN retry. Ví dụ đã giải thích: name=Áo thun, nameEn=T-shirt; locale chọn tên trả về, slug không đổi. Bản Anh nhập tay được giữ khi đổi Việt và chuyển REVIEW. Cơ chế version/lease chống ghi đè kết quả cũ được ghi ở delivery spec BE; không gọi vendor thật trong phiên.
