# Nghiên cứu cấu trúc ban đầu — mục lục

Nghiên cứu đã bị thay bởi ADR; chia nhỏ để tra nguồn và phương án từng được cân nhắc.

> **Status: superseded** — lịch sử nghiên cứu ngày 25/11/2026, không còn là khuyến nghị. Quyết định hiện hành ở [ADR 0001](../../adr/0001-domain-workflows-and-vue-naming.md), [0002](../../adr/0002-state-runtime-and-session.md), [0003](../../adr/0003-backend-api-boundary.md); đối chiếu nguồn và đánh đổi hiện hành ở [Vue CMS: clean code và kiến trúc theo nghiệp vụ](../../research/cms-architecture/README.md). Mọi kết luận bên dưới (giữ `features`, `lib/api`, PascalCase, query/HTTP/DTO trong feature) đã bị thay; chỉ đọc để tra lý do.

Ngày đối chiếu: **25/11/2026**. Trạng thái: **superseded**.
Phạm vi: Vue SPA, tổ chức nghiệp vụ, đặt tên, ownership state và boundary tích hợp Backend.

> Chỉ thêm tài liệu này; không di chuyển source, sửa convention/config, sinh contract, chạy migration, commit hoặc push.
> Khảo sát tĩnh ở checkout `dev`, đang chậm hơn remote-tracking `origin/dev` 3 commit tại lúc đọc; không pull.
> Không suy ra trạng thái remote/CI hoặc hành vi chạy thật từ khảo sát này.

## Theo chủ đề

- [Đầu vào, bằng chứng và phương án cũ](evidence.md)
- [Cây đích, naming và state đã bị thay](structure-and-state.md)
- [API boundary và lộ trình đề xuất cũ](delivery.md)

Các chương giữ nội dung lịch sử theo chủ đề; không sửa kết quả cũ thành hiện trạng mới. Policy hiện hành ở mục lục docs.
