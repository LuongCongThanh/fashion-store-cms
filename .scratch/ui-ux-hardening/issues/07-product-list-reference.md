# 07 — Phase 4.1: Product list làm reference cho archetype List

Status: ready-for-agent
Blocked by: 05, 06

Áp archetype List lên `ProductListView`: page header, tab bộ lọc đã lưu (`<nav>` + `aria-current`, đếm qua badge `soft`), thanh lọc một dòng kèm chip, bảng compact có ảnh nhỏ (khi thiếu ảnh dùng ảnh giả theo `DESIGN.md`), phân trang.

Tham chiếu prototype A + tab của B (#42). Cần user duyệt trước khi rollout (#08).

Test: ProductListView spec cho tab đổi query, chip bỏ lọc, fixture xấu nhất không làm mất menu ⋯.
