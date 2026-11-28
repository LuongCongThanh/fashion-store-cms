# Archetype nghiệp vụ và Dashboard

> Acceptance của kế hoạch UI; đọc tracker để biết phần đã làm. Mockup/Design contract đã có, không dựng lại chỉ vì mô tả Phase gốc.

### Phase 4 — Feature polish theo archetype

**Mục tiêu:** áp dụng pattern theo loại màn hình thay vì redesign rời rạc từng route.

#### 4.1 List/table archetype

- Product list làm reference implementation.
- Chuẩn hóa filter hierarchy, active filter visibility, bulk actions và compact density.
- Sau khi đạt chuẩn, rollout sang order, customer, inventory, Voucher, Tài khoản nội bộ và Vai trò lists.

#### 4.2 Form/editor archetype

- Product editor làm reference cho form dài, section navigation, validation summary và sticky actions.
- Category/Voucher/settings forms kế thừa contract, không tự tạo styling riêng.

#### 4.3 Detail archetype

- Order detail làm reference cho information hierarchy, monetary alignment, timeline, responsive table và action placement.
- Product/customer detail kế thừa pattern phù hợp.

#### 4.4 Tree/matrix archetype

- Category tree có keyboard/mobile alternative cho drag-and-drop.
- Permission matrix xử lý overflow, sticky headers/labels và focus navigation.

**Acceptance criteria**

- Mỗi archetype có một reference implementation được duyệt trước khi rollout.
- Feature-specific exception phải được ghi trong component inventory hoặc design contract nếu có tính tái sử dụng.
- Worst-case fixture không làm mất action, che data hoặc phá layout.

### Phase 5 — Dashboard và data visualization

**Mục tiêu:** tạo hierarchy rõ ràng thay vì một grid card có visual weight ngang nhau.

**Công việc**

- Phân cấp KPI chính, trend, recent orders, top products và low-stock alerts.
- Chuẩn hóa chart palette, tooltip, legend, empty/loading/error và keyboard-accessible summary.
- Giảm decorative chrome; dùng typography, scale và spacing để tạo hierarchy.
- Kiểm tra chart trong dark mode, locale dài và dữ liệu biên.

**Acceptance criteria**

- Người dùng nhận biết được tình trạng cần hành động mà không phải quét mọi widget.
- Không dùng màu làm tín hiệu duy nhất.
- Chart có textual fallback hoặc summary đủ để hiểu insight chính.

Tra cứu: [Mục lục chủ đề](map.md) · [Toàn bộ tài liệu](../../../README.md).
