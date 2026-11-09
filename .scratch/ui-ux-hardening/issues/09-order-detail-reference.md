# 09 — Phase 4.3: Order detail làm reference cho archetype Detail

Status: done
Blocked by: 02, 06

Áp archetype Detail lên `OrderDetailView`:

- Header gồm link quay lại, mã, badge và **một** nút hành động tiếp theo. Huỷ để trong menu, có xác nhận.
- Thanh tiến trình trạng thái (`aria-current=step`).
- `lg:grid-cols-[1fr_22rem]`: sản phẩm + tổng tiền / sidebar dính chứa khách, giao hàng, thanh toán, lịch sử.
- `OrderItems` dùng `tabular-nums`, căn phải, SKU mono.

Sau khi duyệt thì rollout sang Product detail và Customer detail.

Nguồn: hallmark #6.

Test: OrderDetailView spec cho đúng nút tiếp theo theo `nextOrderStatuses`, huỷ có xác nhận, bước hiện tại.

## Comments

- 2026-11-10: Đã áp detail archetype hai cột với sidebar sticky, progress có
  `aria-current="step"`, action kế tiếp ở header và huỷ dạng error ghost có xác
  nhận. Order items có overflow riêng, SKU mono và cột số căn phải. 4 view tests pass.
