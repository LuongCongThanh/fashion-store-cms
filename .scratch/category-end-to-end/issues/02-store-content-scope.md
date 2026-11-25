# Chốt trải nghiệm category trên store và nội dung CMS

Part of: [Hoàn thiện category xuyên suốt BE, CMS và store](../map.md)
Type: grilling
Labels: wayfinder:grilling
Status: resolved
Assignee: maintainer (phiên tương tác hiện tại)
Blocked by:

## Question

Bản đầu cần category tại menu desktop/mobile, trang danh mục, danh mục con, breadcrumb và URL filter ở mức nào? Có cần ảnh/banner, SEO riêng hoặc tên category Việt/Anh ngay không?

Phạm vi đã xác nhận: CRUD CMS, điều hướng/lọc/breadcrumb store, ảnh/banner và bản dịch tên category đều làm trong bản này. Nhãn danh mục là nội dung DB, cần thiết kế dữ liệu bản dịch; không dùng bản dịch tĩnh của UI để thay thế. BR-CAT-10 hiện chỉ cho tên tiếng Việt: yêu cầu mới của người dùng thay phạm vi phần tên Category; không tự mở rộng sang Product. Chưa sửa business rule gốc trước khi chốt contract. Không mặc định mọi màn hình hiện tại còn thiếu.

## Comments

2026-11-19 — Người dùng: “danh mục tiếng việt thì đó chỉ là text được trả về từ DB thôi. Làm luôn ảnh/banner và dịch tên category luôn”. Ticket vẫn mở để chốt ngôn ngữ, fallback, trường media và vị trí hiển thị.

2026-11-19 — Người dùng xác nhận hướng tự dịch: CMS nhập tên Việt; khi tạo hoặc đổi tên, dịch vụ dịch tạo tên Anh; lưu bản dịch vào DB; CMS cho phép sửa bản dịch. Store đọc dữ liệu theo locale. Không yêu cầu quản trị viên nhập đủ hai ngôn ngữ và không dùng file i18n tĩnh để lưu tên category động. Slug vẫn ổn định theo xác nhận trong ticket URL.

Chưa chốt: nhà cung cấp dịch, sync/async, lỗi dịch và retry, xử lý bản Anh đã sửa tay khi đổi tên Việt, backfill category cũ; ảnh/banner và vị trí hiển thị vẫn mở. Các lựa chọn này không được suy ra từ việc đồng ý tự dịch.

## Answer

2026-11-19 — Chốt phạm vi với người dùng qua các lượt trao đổi:

- Hoàn thiện CRUD CMS và điều hướng, lọc, breadcrumb store dựa trên luồng hiện có.
- Làm ngay bản dịch tên category Việt/Anh: nhập tên Việt, tự dịch tên Anh và lưu DB; cho sửa bản Anh tại CMS. Chi tiết vận hành và nhà cung cấp nằm duy nhất trong [Chốt vận hành tự dịch tên category](07-translation-lifecycle.md).
- Mỗi category có hai ảnh độc lập, đều tùy chọn: thumbnail cho danh mục con và banner đầu trang category; CMS chọn/upload ảnh. Người dùng chọn “Hai ảnh tùy chọn (đề xuất)”.
- Không mở rộng phạm vi dịch sang Product hoặc tự bổ sung hệ thống SEO riêng. Kích thước ảnh và fallback hình ảnh là chi tiết còn cần chốt khi chuẩn bị contract/thiết kế, không coi hai ảnh là bắt buộc để hiển thị category.
