# Công cụ và hướng thiết kế

> Kế hoạch UI còn hiệu lực; DESIGN đã có, tracker giữ tiến độ. Không coi các Phase dưới đây là báo cáo hoàn thành.

## Công cụ và skill cho CMS

Tiêu chí chọn: giúp màn hình nghiệp vụ dễ đọc, dễ quét, thao tác nhanh. Công cụ thiên về landing page/marketing chỉ dùng ở phạm vi hẹp hoặc loại bỏ. Chỉ nạp skill cần cho bước đang làm.

| Bước                                 | Skill                                                                        | Nguồn                               |
| ------------------------------------ | ---------------------------------------------------------------------------- | ----------------------------------- |
| Phase 0 — reconcile, baseline        | `ux-heuristics`, `break-ui`                                                  | Emil Kowalski, bổ sung              |
| Phase 0.5 — HTML mockup              | `ui-ux-pro-max`, `design-taste-frontend`, `refactoring-ui`, `web-typography` | UI/UX Pro Max, Taste Skill, bổ sung |
| Phase 1 — viết `DESIGN.md`           | `design-md`, `write-design-md`                                               | Google DESIGN.md                    |
| Phase 1 — audit sau khi có contract  | `hallmark`, `break-ui`, `anti-ui-slop` / `unslop-ui` (report-only)           | Hallmark, Emil, thay cho Impeccable |
| Phase 2–4 — shell, shared, archetype | `refactoring-ui`, `ux-heuristics`, `emil-design-eng`, `break-ui`             | Emil Kowalski, bổ sung              |
| Phase 5 — dashboard, chart           | `refactoring-ui`, `web-typography`                                           | bổ sung                             |
| Phase 6 — quality gates              | `hallmark`, `anti-ui-slop` / `unslop-ui`, `animation-performance`            | Hallmark, Emil                      |
| Phase 7 — motion                     | `emil-design-eng`, `improve-animations`, `animation-performance`             | Emil Kowalski                       |

Lưu ý khi dùng:

- **Google DESIGN.md**: format còn alpha — pin version, không thành runtime dependency.
- **UI/UX Pro Max, Taste Skill**: chỉ cho discovery/critique; kết quả được chọn phải chuyển vào `DESIGN.md` mới có hiệu lực. Taste Skill thiên marketing nên chỉ dùng cho mockup, login, empty state.
- **Hallmark**: không lấy theme catalog làm design system.
- **Awesome DESIGN.md, Open Design**: chỉ tham khảo cấu trúc / sandbox prototype, không sao chép theme.
- **GSAP Skills**: chỉ khi CSS/Vue transition không đủ (xem Phase 7).
- **Không dùng trong CMS**: React Bits, Canvas UI (React/WebGL, license Commons Clause), Scroll World (3D landing) — xem §2 Ngoài phạm vi.

### Công cụ thiết kế

Không dùng Figma (tài khoản free, Figma AI/MCP có giới hạn). Hướng thiết kế được chốt bằng **mockup HTML** do agent tạo; nếu cần đưa vào Figma, import mockup qua plugin html.to.design. Penpot là phương án vẽ tay miễn phí nếu cần.

### Thứ tự quyền lực

```text
DESIGN.md của project
  → Nuxt UI theme và project tokens
    → page/component inventory
      → implementation
        → external audit tools
```

External skill không được tự đổi palette, typography, density hoặc component contract nếu chưa cập nhật design contract và được review.

## Visual direction ban đầu

Các quyết định dưới đây là input cho phase viết `DESIGN.md`, chưa phải token specification hoàn chỉnh:

- Dùng hướng **Fashion editorial + operational clarity**, trong đó **operational clarity luôn thắng** khi xung đột: màn hình list, form, detail ưu tiên mật độ thông tin, khả năng quét và tốc độ thao tác; chất editorial chỉ thể hiện qua typography, khoảng trắng và accent ở login, empty state, page header và dashboard.
- Giữ palette rose hiện tại làm brand direction tạm thời, dùng có kiểm soát trên accent và primary action; neutral/slate đảm nhiệm phần lớn surface và data-dense UI.
- Giữ font hiện tại làm baseline để đánh giá trước khi cân nhắc thay đổi.
- Dùng density `comfortable` mặc định; table/list nghiệp vụ có thể hỗ trợ `compact`.
- Mobile không thu nhỏ nguyên desktop UI: sidebar chuyển thành drawer, action được ưu tiên lại và content được reflow theo task.
- Motion chỉ dùng cho feedback, state transition và spatial relationship; không dùng để trang trí hoặc làm chậm bulk workflow.
- Mọi motion phải hỗ trợ `prefers-reduced-motion`.

Tra cứu: [Mục lục chủ đề](map.md) · [Toàn bộ tài liệu](../../../README.md).
