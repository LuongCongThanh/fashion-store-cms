# Danh mục prototype CMS — mục lục

Các nhóm màn hình được chia để tra acceptance ban đầu; readiness hiện tại theo kế hoạch API-first.

> **Bản ghi lịch sử:** nội dung, trạng thái PR, API tạm và kết quả kiểm tra dưới đây mô tả đợt triển khai ban đầu, không phải trạng thái hiện tại. Nguồn hiện hành: [mục lục docs](../../../README.md). Không dùng endpoint/quyền mẫu để triển khai mới.

File gợi ý: **page (view) nào và component nào cần tạo**, đặt ở đâu, làm ở Phase nào.

Không lặp lại kiến trúc. Nguồn chuẩn:

- Cấu trúc thư mục, tên file, chiều import: [CONVENTIONS.md](../../../guides/README.md) §A, §B, §E, §Q
- API layer, `useListState`, RBAC, Store scope, Table, URL state: [FE_architecture.md](../../../architecture/README.md) §5, §6, §9, §22, §23
- Thứ tự Phase: [FE_architecture.md](../../../architecture/README.md) §30
- Thuật ngữ: [GLOSSARY.md](../../../../GLOSSARY.md)

Stack: Vite + Vue 3 + vue-router + `@nuxt/ui` (chỉ thư viện component, **không phải Nuxt** — không có `pages/` file-based routing, không auto-import component).

---

## Theo chủ đề

- [1. Quy tắc đặt component](catalog-01.md)
- [4. Feature: page & component](catalog-02.md)
- [5. Backlog — ngoài phạm vi hiện tại](catalog-03.md)

Các chương giữ nội dung lịch sử theo chủ đề; không sửa kết quả cũ thành hiện trạng mới. Policy hiện hành ở mục lục docs.
