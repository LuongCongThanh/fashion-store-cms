# Baseline, mockup và Design contract

> Acceptance của kế hoạch UI; đọc tracker để biết phần đã làm. Mockup/Design contract đã có, không dựng lại chỉ vì mô tả Phase gốc.

## Visual baseline

### Màn hình đại diện

1. Login.
2. Dashboard.
3. Product list.
4. Product create/edit.
5. Category tree.
6. Order detail.
7. Design system.
8. App shell trên mobile.

### Ma trận baseline

Không cần nhân mọi trường hợp thành toàn bộ tổ hợp. Chọn tổ hợp theo rủi ro, nhưng tối thiểu phải bao phủ:

- desktop, tablet và mobile;
- light và dark mode trên các màn hình đại diện phù hợp;
- default, loading, empty, error và populated state;
- keyboard focus và validation errors;
- text dài, nhiều column, nhiều action và dữ liệu biên;
- reduced motion.

Baseline phải được review và chấp thuận trước khi snapshot trở thành CI gate. Snapshot không được dùng để hợp thức hóa giao diện đang lỗi.

## Kế hoạch triển khai

### Phase 0 — Reconcile và đo baseline

**Mục tiêu:** xác định chính xác UI hiện có trước khi thay đổi.

**Công việc**

- Reconcile page/component inventory với source hiện tại.
- Chụp baseline cho bộ màn hình đại diện.
- Ghi nhận viewport, theme, data fixture và state của từng ảnh.
- Đo bundle/route chunks, render timing và các điểm layout shift hiện tại.
- Audit keyboard, focus, contrast, reduced motion và responsive overflow.
- Lập danh sách raw inputs/tables/local styles đang lệch shared pattern.

**Deliverable**

- Inventory đã cập nhật trạng thái.
- Baseline image set có fixture ổn định.
- Audit report phân loại theo severity và pattern, không chỉ theo page.
- Performance baseline theo route/chunk.

**Acceptance criteria**

- Mỗi màn hình đại diện có owner, fixture và viewport rõ ràng.
- Các vấn đề được nhóm thành design-system gap, shared-pattern gap hoặc feature-specific gap.
- Chưa có CI blocking từ snapshot/audit mới.

### Phase 0.5 — HTML mockup và duyệt hướng thiết kế

**Mục tiêu:** chốt hướng thiết kế bằng mắt trước khi viết thành luật.

**Công việc**

- Tạo mockup HTML cho Dashboard, Product list và Order detail, có light và dark mode.
- Dùng palette rose và font hiện tại (provisional), density `comfortable`.
- Critique mockup bằng `design-taste-frontend` và `refactoring-ui` trước khi trình duyệt.

**Acceptance criteria**

- User duyệt mockup; chưa duyệt thì không sang Phase 1.
- Mockup không phải code production: nếu nằm trong `src/` thì chỉ được nạp qua route dev (`import.meta.env.DEV`), không có trong bundle production.

### Phase 1 — Viết Design contract

**Mục tiêu:** biến visual direction thành nguồn chuẩn có thể kiểm tra.

**Công việc**

- Tạo `DESIGN.md` dựa trên Google DESIGN.md và nhu cầu thực tế của Vue/Nuxt UI project.
- Định nghĩa token cho color, typography, spacing, radius, elevation, density, motion, icon và image treatment.
- Định nghĩa semantic surfaces, borders, focus ring và status colors cho light/dark mode.
- Định nghĩa page anatomy, responsive layout, content hierarchy và action priority.
- Định nghĩa pattern cho forms, tables, filters, detail sections, feedback và charts.
- Ghi rõ provisional brand choices và điều kiện thay thế khi có brand guideline chính thức.
- Thu gọn `docs/guides/README.md` §L thành pointer sang `DESIGN.md`.
- Sau khi có contract, audit mockup và màn hình hiện tại bằng `hallmark` và `break-ui` (report-only).

**Deliverable**

- `DESIGN.md` được review.
- Audit report đối chiếu với contract.
- Mapping giữa design tokens và Tailwind/Nuxt UI config.
- Danh sách gap giữa contract và implementation hiện tại.

**Acceptance criteria**

- Không có token quan trọng chỉ được định nghĩa bằng ví dụ hình ảnh.
- Light/dark và comfortable/compact đều có contract rõ ràng.
- Agent có thể trả lời “component này nên trông và hoạt động thế nào” từ design contract mà không cần chọn ngẫu nhiên từ external skill.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
