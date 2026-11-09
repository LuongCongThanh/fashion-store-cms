# 08 — Phase 4.1: rollout archetype List

Status: done
Blocked by: 07

Áp pattern của #07 cho list Order, Customer, Inventory, Promotion, User, Role. Exception nào có tính tái dùng thì ghi vào `DESIGN.md` hoặc inventory.

Test: spec hiện có của từng list vẫn xanh.

## Comments

- 2026-11-10: Rollout nhịp `space-y-6` và `DataTableToolbar` với tổng kết quả đã
  format cho Order, Customer, Inventory, Stock movement, Promotion, User và Role.
  Các filter/table feature được giữ làm adapter nghiệp vụ; Product tiếp tục là
  reference đầy đủ cho preset, chip, selection và column visibility. Typecheck và
  9 view tests của toàn bộ list pass.
