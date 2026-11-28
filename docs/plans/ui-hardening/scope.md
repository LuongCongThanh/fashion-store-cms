# Mục tiêu, phạm vi và nguồn chuẩn

> Kế hoạch UI còn hiệu lực; DESIGN đã có, tracker giữ tiến độ. Không coi các Phase dưới đây là báo cáo hoàn thành.

## Mục tiêu

Nâng chất lượng giao diện Fashion Store CMS theo hướng **Fashion editorial + operational clarity**: có bản sắc thời trang và nhịp điệu thị giác có chủ đích, nhưng vẫn ưu tiên khả năng đọc, quét dữ liệu và thao tác nhanh của một CMS nghiệp vụ.

Plan này không thay thế inventory page/component hiện tại. Nó xác định cách xây dựng design contract, đo baseline, cải thiện các pattern giao diện và thiết lập quality gate để chất lượng không suy giảm khi thêm feature.

### Kết quả mong muốn

- Duy trì `DESIGN.md` là **Design contract** hiện có của project.
- App shell, page anatomy, form, table và detail view nhất quán trên desktop, tablet và mobile.
- Light/dark mode, keyboard/focus, reduced motion và các trạng thái loading/empty/error/offline có tiêu chuẩn nghiệm thu rõ ràng.
- Có visual regression, accessibility checks và performance budget dựa trên baseline thực tế.
- External design skill chỉ là công cụ khám phá hoặc audit; không trở thành nguồn luật ngang hàng với design contract của project.

## Phạm vi

### Trong phạm vi

- CMS nghiệp vụ hiện tại: authentication, dashboard, catalog, order, customer, inventory, Voucher, Tài khoản nội bộ/Vai trò và settings.
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

## Khoảng trống ghi nhận khi lập kế hoạch

Stack và shared pattern hiện có: xem [FE_architecture.md](../../architecture/README.md) và [CONVENTIONS.md](../../guides/README.md).

Các khoảng trống dưới đây là đầu vào của plan; kiểm source và tracker trước khi kết luận chúng còn tồn tại:

1. Palette brand trong `src/assets/styles/main.css` vẫn được ghi là tạm thời; token hiện chưa bao phủ đầy đủ spacing, elevation, density, motion, icon và image treatment.
2. `DesignSystemView` chưa đại diện đầy đủ cho forms, tables, charts, interaction states, responsive behavior và accessibility.
3. Một số form/detail/table vẫn dùng markup hoặc style cục bộ, làm giảm tính nhất quán với Nuxt UI và shared components.
4. Mobile navigation chưa hoàn chỉnh; header, page actions và các layout mật độ cao chưa có responsive contract rõ ràng.
5. Dashboard thiếu phân cấp thị giác giữa KPI chính, chart, recent activity và operational alerts.
6. Playwright mới thiên về smoke test; chưa có screenshot baseline, multi-viewport visual regression hoặc accessibility automation.
7. Bundle hiện đã đáng kể, nên animation hoặc visual dependency mới phải chứng minh giá trị và không gây regression.

## Quan hệ với tài liệu hiện tại

### `DESIGN.md` — nguồn chuẩn đã có

`DESIGN.md` là design contract, chịu trách nhiệm cho:

- design principles và visual direction;
- color, typography, spacing, radius, elevation và density tokens;
- responsive breakpoints và page anatomy;
- component/state/interaction rules;
- motion và reduced-motion policy;
- accessibility và content guidance;
- data visualization và image treatment.

Schema hoặc CLI của Google DESIGN.md có thể được dùng làm nền tảng, nhưng không được trở thành runtime dependency. Do format còn alpha, phải pin version và review migration trước khi nâng cấp.

**Ranh giới với `docs/guides/README.md` §L:** hiện §L ghi nguồn chuẩn token là `main.css` `@theme` + Nuxt UI color map trong `src/app/config/Ui.config.ts`. §L đã thu gọn thành pointer sang `DESIGN.md`; `main.css` và `Ui.config.ts` là _implementation_ của token, không phải nguồn luật thứ hai. Thay đổi token đi theo thứ tự `DESIGN.md` → `main.css`/`Ui.config.ts`, trong cùng một PR.

### `fashion-store-cms-pages-components.md` — inventory cần reconciliation

[Danh mục prototype lịch sử](../../archive/cms-initial-build/catalog/README.md) giữ tiêu chí ban đầu để reconciliation. Route hiện hành theo navigation-flow và route source; không coi danh mục prototype là inventory mới nhất hoặc design contract.

Khi triển khai plan cần:

- đối chiếu lại từng mục với code và đánh dấu `implemented`, `partial`, `missing` hoặc `backlog`;
- sửa các tuyên bố lỗi thời về layout/shared components và feature views;
- liên kết sang `DESIGN.md` thay vì lặp lại visual rules;
- bổ sung cho từng pattern quan trọng: responsive behavior, keyboard/focus, loading/empty/error/offline, worst-case content và visual acceptance;
- giữ terminology nhất quán với `GLOSSARY.md`.

Không tạo ADR chỉ để ghi lại lựa chọn thẩm mỹ có thể đảo ngược. Chỉ cân nhắc ADR nếu sau này project chọn một toolchain/design format có lock-in đáng kể hoặc áp dụng boundary khó thay đổi.

Tra cứu: [Mục lục chủ đề](README.md) · [Toàn bộ tài liệu](../../README.md).
