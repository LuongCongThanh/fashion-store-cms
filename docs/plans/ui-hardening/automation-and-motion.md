# Automation và motion

> Acceptance của kế hoạch UI; đọc tracker để biết phần đã làm. Mockup/Design contract đã có, không dựng lại chỉ vì mô tả Phase gốc.

### Phase 6 — Automation và quality gates

**Mục tiêu:** biến chất lượng UI thành tiêu chí có thể lặp lại.

**Công việc**

- Thêm Playwright screenshot tests cho bộ baseline.
- Thêm accessibility checks cho landmark, name/role/value, contrast, focus và keyboard flow.
- Chạy responsive overflow, reduced motion và dark-mode checks.
- Pilot `hallmark`, `break-ui` và `anti-ui-slop` trên phạm vi nhỏ, đối chiếu false positive trước khi tự động hóa.
- Thiết lập performance budget từ baseline theo route/chunk và nguyên tắc không regression.

**Rollout gate**

1. **Reporting:** kết quả hiển thị trong CI nhưng chưa chặn merge; triage noise và ổn định fixture.
2. **Blocking:** chỉ các check ổn định, có owner và remediation rõ ràng mới được chặn CI.

**Acceptance criteria**

- Snapshot diff có quy trình review và update rõ ràng.
- Không dùng threshold rộng để che layout regression.
- Accessibility check tự động không thay thế keyboard/screen-reader review cho flow quan trọng.
- Performance budget không phải con số tùy ý: phải dựa trên baseline và theo dõi delta.

### Phase 7 — Motion và prototype chọn lọc

**Mục tiêu:** chỉ thêm chuyển động sau khi foundation đã ổn định.

**Quy trình phê duyệt**

Mỗi motion proposal phải trả lời:

1. Nó giải thích state change hoặc spatial relationship nào?
2. CSS/Vue transition có đáp ứng được không?
3. Reduced-motion behavior là gì?
4. Chi phí bundle, main-thread và maintenance là bao nhiêu?
5. Nó có làm chậm bulk workflow hoặc che feedback quan trọng không?

GSAP chỉ được pilot khi câu trả lời cho câu 2 là “không” và giá trị interaction đã được chứng minh.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
