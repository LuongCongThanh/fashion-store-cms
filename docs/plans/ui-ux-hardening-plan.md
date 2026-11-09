# Fashion Store CMS — UI/UX Hardening Plan

## 1. Mục tiêu

Nâng chất lượng giao diện Fashion Store CMS theo hướng **Fashion editorial + operational clarity**: có bản sắc thời trang và nhịp điệu thị giác có chủ đích, nhưng vẫn ưu tiên khả năng đọc, quét dữ liệu và thao tác nhanh của một CMS nghiệp vụ.

Plan này không thay thế inventory page/component hiện tại. Nó xác định cách xây dựng design contract, đo baseline, cải thiện các pattern giao diện và thiết lập quality gate để chất lượng không suy giảm khi thêm feature.

### Kết quả mong muốn

- Một `DESIGN.md` riêng trở thành **Design contract** của project.
- App shell, page anatomy, form, table và detail view nhất quán trên desktop, tablet và mobile.
- Light/dark mode, keyboard/focus, reduced motion và các trạng thái loading/empty/error/offline có tiêu chuẩn nghiệm thu rõ ràng.
- Có visual regression, accessibility checks và performance budget dựa trên baseline thực tế.
- External design skill chỉ là công cụ khám phá hoặc audit; không trở thành nguồn luật ngang hàng với design contract của project.

## 2. Phạm vi

### Trong phạm vi

- CMS nghiệp vụ hiện tại: authentication, dashboard, catalog, order, customer, inventory, promotion, User/Role và settings.
- Design direction, token, responsive behavior, component state và interaction pattern.
- Tính nhất quán của Nuxt UI primitives và shared/feature components.
- Accessibility, visual testing và performance của UI.
- Microinteraction phục vụ phản hồi trạng thái hoặc làm rõ quan hệ không gian.

### Ngoài phạm vi

- Storefront, landing page và brand campaign.
- 3D scroll experience, WebGL/WebGPU decoration hoặc video scroll-scrubbing trong CMS core.
- Sao chép theme, brand asset hoặc hình ảnh từ các repo tham khảo.
- Thay đổi business flow, API contract hoặc kiến trúc feature không cần thiết cho UI hardening.
- Cài ngay cả 12 repo, viết ngay `DESIGN.md` hoặc sửa UI trong phase planning này.

## 3. Hiện trạng và vấn đề cần giải quyết

Stack và shared pattern hiện có: xem [FE_architecture.md](../FE_architecture.md) và [CONVENTIONS.md](../CONVENTIONS.md).

Các khoảng trống chính:

1. Palette brand trong `src/assets/styles/main.css` vẫn được ghi là tạm thời; token hiện chưa bao phủ đầy đủ spacing, elevation, density, motion, icon và image treatment.
2. `DesignSystemView` chưa đại diện đầy đủ cho forms, tables, charts, interaction states, responsive behavior và accessibility.
3. Một số form/detail/table vẫn dùng markup hoặc style cục bộ, làm giảm tính nhất quán với Nuxt UI và shared components.
4. Mobile navigation chưa hoàn chỉnh; header, page actions và các layout mật độ cao chưa có responsive contract rõ ràng.
5. Dashboard thiếu phân cấp thị giác giữa KPI chính, chart, recent activity và operational alerts.
6. Playwright mới thiên về smoke test; chưa có screenshot baseline, multi-viewport visual regression hoặc accessibility automation.
7. Bundle hiện đã đáng kể, nên animation hoặc visual dependency mới phải chứng minh giá trị và không gây regression.

## 4. Quan hệ với tài liệu hiện tại

### `DESIGN.md` — nguồn chuẩn cần tạo

`DESIGN.md` sẽ là design contract, chịu trách nhiệm cho:

- design principles và visual direction;
- color, typography, spacing, radius, elevation và density tokens;
- responsive breakpoints và page anatomy;
- component/state/interaction rules;
- motion và reduced-motion policy;
- accessibility và content guidance;
- data visualization và image treatment.

Schema hoặc CLI của Google DESIGN.md có thể được dùng làm nền tảng, nhưng không được trở thành runtime dependency. Do format còn alpha, phải pin version và review migration trước khi nâng cấp.

**Ranh giới với `docs/CONVENTIONS.md` §L:** hiện §L ghi nguồn chuẩn token là `main.css` `@theme` + Nuxt UI color map trong `src/app/config/Ui.config.ts`. Khi `DESIGN.md` được merge, §L thu gọn thành pointer sang `DESIGN.md`; `main.css` và `Ui.config.ts` là _implementation_ của token, không phải nguồn luật thứ hai. Thay đổi token đi theo thứ tự `DESIGN.md` → `main.css`/`Ui.config.ts`, trong cùng một PR.

### `fashion-store-cms-pages-components.md` — inventory cần reconciliation

[File inventory hiện tại](./cms-pages-components/fashion-store-cms-pages-components.md) tiếp tục chịu trách nhiệm cho route, view, component ownership và build order. Không chuyển nó thành design contract.

Khi triển khai plan cần:

- đối chiếu lại từng mục với code và đánh dấu `implemented`, `partial`, `missing` hoặc `backlog`;
- sửa các tuyên bố lỗi thời về layout/shared components và feature views;
- liên kết sang `DESIGN.md` thay vì lặp lại visual rules;
- bổ sung cho từng pattern quan trọng: responsive behavior, keyboard/focus, loading/empty/error/offline, worst-case content và visual acceptance;
- giữ terminology nhất quán với `GLOSSARY.md`.

Không tạo ADR chỉ để ghi lại lựa chọn thẩm mỹ có thể đảo ngược. Chỉ cân nhắc ADR nếu sau này project chọn một toolchain/design format có lock-in đáng kể hoặc áp dụng boundary khó thay đổi.

## 5. Công cụ và skill cho CMS

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

## 6. Visual direction ban đầu

Các quyết định dưới đây là input cho phase viết `DESIGN.md`, chưa phải token specification hoàn chỉnh:

- Dùng hướng **Fashion editorial + operational clarity**, trong đó **operational clarity luôn thắng** khi xung đột: màn hình list, form, detail ưu tiên mật độ thông tin, khả năng quét và tốc độ thao tác; chất editorial chỉ thể hiện qua typography, khoảng trắng và accent ở login, empty state, page header và dashboard.
- Giữ palette rose hiện tại làm brand direction tạm thời, dùng có kiểm soát trên accent và primary action; neutral/slate đảm nhiệm phần lớn surface và data-dense UI.
- Giữ font hiện tại làm baseline để đánh giá trước khi cân nhắc thay đổi.
- Dùng density `comfortable` mặc định; table/list nghiệp vụ có thể hỗ trợ `compact`.
- Mobile không thu nhỏ nguyên desktop UI: sidebar chuyển thành drawer, action được ưu tiên lại và content được reflow theo task.
- Motion chỉ dùng cho feedback, state transition và spatial relationship; không dùng để trang trí hoặc làm chậm bulk workflow.
- Mọi motion phải hỗ trợ `prefers-reduced-motion`.

## 7. Visual baseline

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

## 8. Kế hoạch triển khai

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
- Thu gọn `docs/CONVENTIONS.md` §L thành pointer sang `DESIGN.md`.
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

### Phase 2 — App shell và responsive foundation

**Mục tiêu:** ổn định navigation, page frame và responsive behavior trước khi polish từng feature.

**Công việc**

- Thiết kế mobile navigation drawer và hành vi đóng/mở/focus trap.
- Rework header để breadcrumb, Store switcher, locale, theme và User menu reflow có thứ tự ưu tiên.
- Chuẩn hóa `PageContainer`, `PageHeader`, page actions và responsive spacing.
- Xử lý overflow, sticky region và safe-area trên mobile.
- Bổ sung app-shell states vào Design System view.

**Acceptance criteria**

- Toàn bộ route chính truy cập được bằng keyboard và mobile navigation.
- Không có horizontal page overflow ngoài vùng table được chỉ định.
- Focus được trả về trigger sau khi drawer/dialog đóng.
- Primary action vẫn rõ ràng ở viewport nhỏ.

### Phase 3 — Shared component và state coverage

**Mục tiêu:** giảm style cục bộ và làm shared patterns phản ánh design contract.

**Công việc**

- Chuẩn hóa input/select/textarea/date/upload thông qua Nuxt UI hoặc wrapper thực sự cần dùng lại.
- Hoàn thiện form section, validation summary, help/error text và sticky actions.
- Chuẩn hóa table density, alignment, overflow, numeric formatting, row action và pagination.
- Hoàn thiện loading, skeleton, empty, error, offline và disabled states.
- Mở rộng Design System view thành catalog cho state và pattern, không chỉ là color/type demo.

**Acceptance criteria**

- Không tạo primitive thay thế Nuxt UI nếu không có gap được chứng minh.
- Form và table representative chạy được với keyboard, zoom và text dài.
- Shared component không chứa business status mapping hoặc feature knowledge.
- Mỗi shared pattern có demo cho light/dark và state quan trọng.

### Phase 4 — Feature polish theo archetype

**Mục tiêu:** áp dụng pattern theo loại màn hình thay vì redesign rời rạc từng route.

#### 4.1 List/table archetype

- Product list làm reference implementation.
- Chuẩn hóa filter hierarchy, active filter visibility, bulk actions và compact density.
- Sau khi đạt chuẩn, rollout sang order, customer, inventory, promotion, User và Role lists.

#### 4.2 Form/editor archetype

- Product editor làm reference cho form dài, section navigation, validation summary và sticky actions.
- Category/promotion/settings forms kế thừa contract, không tự tạo styling riêng.

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

## 9. Quality checklist bắt buộc

### Responsive

- Không có hành động thiết yếu chỉ xuất hiện khi hover.
- Table có chiến lược overflow/column priority rõ ràng.
- Dialog, drawer và sticky actions không vượt viewport.
- Mobile layout ưu tiên task, không chỉ thu nhỏ desktop.

### Accessibility

- Keyboard order hợp lý và focus indicator rõ.
- Focus trap/restore hoạt động cho modal và drawer.
- Color contrast đạt yêu cầu và màu không phải tín hiệu duy nhất.
- Form error có label, message và summary phù hợp.
- Drag-and-drop có alternative không phụ thuộc pointer.
- Motion tôn trọng `prefers-reduced-motion`.

### Data và content

- Kiểm tra chuỗi tiếng Việt/Anh dài, giá trị tiền lớn, nhiều tag và missing image.
- Loading, empty, error, offline và partial-data states có thiết kế riêng.
- Numeric/currency/date alignment và formatting nhất quán.
- Destructive và bulk actions có confirmation/undo policy rõ.

### Performance

- Không thêm animation/WebGL dependency nếu chưa có đo lường.
- Theo dõi route chunk, initial load và main-thread cost trước/sau thay đổi.
- Không regression so với baseline đã duyệt; mục tiêu giảm bundle được đặt sau khi xác định nguồn chi phí.

## 10. Guardrail cho external tools

- Pin tag hoặc commit SHA; không chạy trực tiếp từ `main` trong workflow ổn định.
- Review `SKILL.md`, install script, binary, network access và file diff trước khi chạy.
- Ghi lại nguồn, version và license của technique/asset được sử dụng.
- Không cho external agent/tool tự ý thay design contract.
- Không cấp credential hoặc inherited environment nếu không thật sự cần.
- Không chạy audit tool ở chế độ vô hiệu hóa approvals/sandbox.
- Không biến output của audit tool thành CI blocking trước khi triage false positive.
- Asset hoặc source có license hạn chế phải legal review trước khi copy/distribute.

## 11. Rủi ro và cách giảm thiểu

| Rủi ro                                     | Hệ quả                               | Giảm thiểu                                                            |
| ------------------------------------------ | ------------------------------------ | --------------------------------------------------------------------- |
| Nhiều skill đưa ra style mâu thuẫn         | UI thiếu nhất quán                   | `DESIGN.md` là nguồn chuẩn duy nhất; external tools chỉ audit/advice. |
| Redesign toàn bộ cùng lúc                  | Diff lớn, khó review, regression cao | Làm theo archetype và reference implementation.                       |
| Snapshot test nhiều noise                  | CI bị bỏ qua hoặc update mù quáng    | Fixture ổn định, reporting trước, blocking sau.                       |
| Fashion aesthetic làm giảm usability       | CMS đẹp nhưng thao tác chậm          | Operational clarity và task completion là acceptance gate.            |
| Animation làm tăng bundle/main-thread cost | UI chậm, khó bảo trì                 | CSS/Vue first; đo baseline; GSAP on demand.                           |
| Schema DESIGN.md alpha thay đổi            | Tooling churn                        | Pin version, giữ runtime độc lập, review migration.                   |
| Asset/reference không rõ license           | Rủi ro pháp lý                       | Không sao chép mặc định; provenance và license review bắt buộc.       |

## 12. Definition of Done

Effort UI/UX hardening được xem là hoàn tất khi:

- `DESIGN.md` được review và phản ánh trong Nuxt UI/Tailwind tokens.
- Page/component inventory khớp với code và liên kết đúng tới design contract.
- Các reference archetype cho list, form, detail, tree/matrix và dashboard đạt acceptance criteria.
- Mobile navigation và responsive page anatomy hoạt động trên route chính.
- Baseline representative screens có visual regression ổn định.
- Accessibility và performance gates đã qua giai đoạn reporting; các check đáng tin cậy được chuyển sang blocking.
- Không có external tool hoặc visual dependency nào trở thành nguồn luật không được kiểm soát.
- Motion production đáp ứng policy về mục đích, reduced motion và performance.

## 13. Bước tiếp theo sau khi duyệt plan

1. Merge plan này (PR riêng, chỉ tài liệu).
2. Tạo branch mới từ `dev` cho Phase 0.5: mockup HTML Dashboard, Product list, Order detail (light/dark).
3. User duyệt mockup.
4. Viết `DESIGN.md` bằng `write-design-md`, thu gọn CONVENTIONS §L thành pointer.
5. Audit bằng `hallmark` + `break-ui` (report-only); mockup và `DESIGN.md` nằm trong PR đó, tách khỏi PR plan.
6. Phase 0 reconcile inventory có thể chạy song song; phân rã các phase sau thành issue trong `.scratch/<feature>/`.
