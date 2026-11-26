# Nghiên cứu Vue CMS — mục lục

Nguồn và đánh đổi được chia thành ba chủ đề. Quyết định đã duyệt nằm trong ADR; không áp riêng ví dụ research lên source.

> Tài liệu research hiện hành. Quyết định nằm ở [ADR 0001](../../adr/0001-domain-workflows-and-vue-naming.md), [0002](../../adr/0002-state-runtime-and-session.md), [0003](../../adr/0003-backend-api-boundary.md); tài liệu này giữ nguồn và đánh đổi. [Nghiên cứu ngày 25/11](../../archive/architecture-research/README.md) đã superseded. Các phương án bị loại bên dưới được ghi để tra lý do; source/lint chưa migrate.

Ngày đối chiếu: **26/11/2026**. Phạm vi: toàn repository CMS, giữ Vue SPA + Vite và baseline UI/hành vi.
Đây là nghiên cứu và đề xuất migration; không phải báo cáo đã refactor, kiểm API thật hoặc đo hiệu năng.
Các dòng ghi **Đề xuất** là nhận định thiết kế cho CMS; nguồn framework không ban hành cây thư mục này.

## Theo chủ đề

- [Bằng chứng và lựa chọn boundary](boundaries.md)
- [Cấu trúc root và workflow Sản phẩm](structure.md)
- [API, state và migration](runtime-and-delivery.md)

Mỗi chủ đề có một nơi giữ nội dung chuẩn. Khi sửa policy, cập nhật file chủ đề và source/config thực thi trong cùng thay đổi.
