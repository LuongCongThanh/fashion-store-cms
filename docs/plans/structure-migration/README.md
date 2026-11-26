# Thiết kế migration CMS — mục lục

Thiết kế được chia theo chủ đề. Ví dụ file là minh họa trách nhiệm; không coi đó là inventory đã migrate.

Ngày cập nhật: 26/11/2026. Trạng thái: **thiết kế đã duyệt**; Q1–Q19 được xác nhận ngày 26/11/2026 theo [design map](../../../.scratch/cms-architecture-design/map.md). Chưa triển khai source hoặc cập nhật rule hiện hành. Quyết định đã duyệt nằm ở [ADR 0001](../../adr/0001-domain-workflows-and-vue-naming.md) (tổ chức, naming, phần CONVENTIONS bị thay), [ADR 0002](../../adr/0002-state-runtime-and-session.md) (state, runtime, session) và [ADR 0003](../../adr/0003-backend-api-boundary.md) (ranh giới Backend, typing). Cây dưới thể hiện trách nhiệm; tên file minh hoạ và các nhánh ghi “đề xuất” chưa phải inventory/mapping đã kiểm đủ.

## Theo chủ đề

- [Nguyên tắc và cây tổng thể](overview.md)
- [Workflow Sản phẩm và vai trò file](product-workflows.md)
- [Config, shared và luồng Lưu](configuration.md)
- [Gate, Session, API typing và delivery](delivery.md)

Mỗi chủ đề có một nơi giữ nội dung chuẩn. Khi sửa policy, cập nhật file chủ đề và source/config thực thi trong cùng thay đổi.
