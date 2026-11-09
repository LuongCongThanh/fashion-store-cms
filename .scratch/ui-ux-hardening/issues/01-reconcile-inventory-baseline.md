# 01 — Phase 0: reconcile inventory + baseline

Status: ready-for-agent
Blocked by: —

Đối chiếu `docs/plans/cms-pages-components/fashion-store-cms-pages-components.md` với code. Mỗi mục được đánh dấu `implemented` / `partial` / `missing` / `backlog`; visual rule thì trỏ sang `DESIGN.md` thay vì chép lại.

Đo baseline:

- Kích thước route chunk (`npm run analyze`).
- Danh sách control tự viết và style cục bộ đang lệch `DESIGN.md`.

Chưa thêm CI gate.

Kết quả: inventory cập nhật + `baseline.md` (route → chunk KB; danh sách lệch, phân loại design-system gap / shared-pattern gap / feature gap).
