# Phase 0.5: kết luận duyệt hướng thiết kế

Chốt ngày 2026-11-09.

**Câu hỏi:** Các màn CMS đại diện nên có cấu trúc thế nào khi theo hướng "Fashion editorial + operational clarity"?

**Tư liệu gốc:** PR #42, merge vào `dev` dưới dạng route chỉ có khi DEV. Chạy `npm run dev` rồi mở `/prototype/dashboard`, `/prototype/products`, `/prototype/orders` với `?variant=A|B|C`.

| Màn          | Chọn                     | Giữ lại                                                                                         |
| ------------ | ------------------------ | ----------------------------------------------------------------------------------------------- |
| Dashboard    | A + câu tóm tắt của B    | Hàng "Cần xử lý" ở đầu, 1 KPI hero kèm chart, KPI phụ, bảng đơn gần đây, danh sách sắp hết hàng. Header có 1 câu tóm tắt kiểu tạp chí. |
| Product list | A + tab views của B      | Bảng dày có ảnh nhỏ, bộ lọc nằm trên một dòng kèm chip, thanh thao tác hàng loạt thay vào chỗ tiêu đề bảng khi chọn dòng. Có tab bộ lọc đã lưu kèm số lượng. |
| Order detail | A + stepper của B        | Hai cột: sản phẩm + tổng tiền / sidebar dính chứa khách, giao hàng, thanh toán, lịch sử. Phía trên có thanh tiến trình trạng thái và 1 nút hành động tiếp theo nổi bật. |

**Bị loại:**

- Editorial report (Dashboard B): khó quét.
- Ops console (Dashboard C): quá dày cho màn tổng quan.
- Faceted sidebar (Product list B): tốn chiều ngang.
- Gallery (Product list C): có thể làm chế độ xem phụ, không làm mặc định.
- Invoice (Order detail C): phù hợp làm bản in, không hợp làm màn thao tác.

**Hệ quả cho `DESIGN.md`:**

- Chất editorial chỉ nằm ở chữ trong header/tóm tắt và ở accent.
- Bảng nghiệp vụ mặc định dùng mật độ dày (row khoảng 36px).
- Chỉ một nút hành động chính cho mỗi màn.
- Có trạng thái hàng đợi (queue) làm pattern dùng chung.
