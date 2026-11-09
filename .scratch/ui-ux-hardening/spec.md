# Spec: UI/UX hardening

Status: ready-for-agent

**Nguồn:** plan `docs/plans/ui-ux-hardening-plan.md` (#41) · contract `DESIGN.md` (#43) · hướng thiết kế đã duyệt `mockup-decision.md` (prototype #42, screenshot #46) · audit `audit-hallmark.md`, `audit-break-ui.md` · skill `design-skills.md`.

## Problem Statement

User CMS (nhân viên vận hành, quản lý Store) đang làm việc trên một giao diện không nhất quán và dễ vỡ:

- Tiền, số, ngày hiển thị thô hoặc theo locale trình duyệt (`15500000`, chuỗi ISO, "1 results"). Phần formatter đã xong ở #44; một số chỗ vẫn còn số thô (tồn `0` thay vì "Hết").
- Dưới 1024px không có điều hướng; header vỡ ở 375px.
- Chữ màu trạng thái và badge `solid` warning/info không đạt tương phản AA.
- Control tự viết (`<select>` trần) không có focus ring, tab tự viết không điều hướng được bằng phím.
- Mỗi màn List/Detail/Form/Dashboard tự dựng bố cục riêng: bảng thưa, thanh thao tác hàng loạt lệch contract, Order detail ba card cao lệch nhau, dữ liệu dài (tên, email, địa chỉ) tràn khỏi khung.
- Không có cổng chất lượng nào (screenshot, axe, budget) để giữ các sửa chữa này không bị thoái lui.

## Solution

Đưa toàn bộ CMS về đúng `DESIGN.md` theo bốn lớp: **nền tảng** (formatter, điều hướng mobile, control Nuxt UI, token) → **pattern dùng chung** (bảng nghiệp vụ, state loading/empty/error) → **archetype màn hình** (List, Detail, Form, Dashboard, cây/ma trận), mỗi archetype có một reference implementation được duyệt trước khi rollout → **cổng chất lượng** (Playwright screenshot + axe + performance budget, báo cáo trước rồi mới chặn merge). Motion được để sau cùng và chỉ làm khi có lý do.

## User Stories

### Định dạng dữ liệu

1. As a User CMS, I want mọi số tiền hiển thị kèm ₫ và dấu phân cách theo ngôn ngữ của app, so that tôi đọc giá không cần đếm chữ số.
2. As a User CMS dùng giao diện tiếng Anh, I want tiền và ngày theo locale app chứ không theo trình duyệt, so that cùng một màn luôn hiển thị nhất quán.
3. As a User CMS, I want ngày giờ trong lịch sử Order được format dễ đọc, so that tôi không phải đọc chuỗi ISO.
4. As a User CMS, I want cột tiền và số căn phải và dùng `tabular-nums`, so that tôi so sánh giá trị theo cột nhanh.
5. As a User CMS, I want "1 kết quả" / "1 result" đúng số ít, so that giao diện không có lỗi ngữ pháp.
6. As a User CMS, I want tồn kho `0` hiện badge "Hết" thay vì số `0`, so that tôi nhận ra Variant hết hàng ngay.

### Điều hướng và header trên mobile

7. As a User CMS dùng điện thoại, I want mở menu điều hướng bằng nút trong header, so that tôi vào được mọi màn dưới 1024px.
8. As a User CMS dùng bàn phím, I want drawer giữ focus bên trong, đóng bằng Esc và trả focus về nút mở, so that tôi không bị lạc focus.
9. As a User CMS, I want drawer tự đóng khi tôi đổi route, so that tôi thấy ngay nội dung trang mới.
10. As a User CMS ở 375px, I want header chỉ giữ nút menu, Store switcher, breadcrumb rút gọn và User menu, so that header không vỡ hàng.
11. As a User CMS trên mobile, I want đổi ngôn ngữ và theme trong User menu, so that tôi vẫn có các lựa chọn này mà header không chật.
12. As a User CMS, I want trang không cuộn ngang ở 320–414px, so that chỉ bảng mới cuộn trong khung của nó.

### Control và khả năng tiếp cận

13. As a User CMS dùng bàn phím, I want mọi select/input có focus ring rõ (≥ 3:1 so với nền), so that tôi biết mình đang ở đâu.
14. As a User CMS dùng trình đọc màn hình, I want mọi control có label truy cập được bằng role và tên, so that tôi biết mỗi control làm gì.
15. As a User CMS có thị lực kém, I want chữ trạng thái đạt AA (đi qua badge `subtle`/`soft`), so that tôi đọc được trạng thái.
16. As a User CMS dùng bàn phím, I want tab bộ lọc đã lưu là link điều hướng bình thường với `aria-current`, so that tôi không gặp tab giả thiếu phím mũi tên.

### Bảng nghiệp vụ dùng chung

17. As a User CMS, I want bảng compact (row khoảng 36px, control `sm`), so that tôi thấy nhiều dòng hơn trên một màn hình.
18. As a User CMS, I want header bảng dính khi cuộn, so that tôi luôn biết cột nào là gì.
19. As a User CMS, I want khi chọn dòng thì thanh thao tác hàng loạt thay vào chỗ tiêu đề bảng, và bỏ chọn thì tiêu đề quay lại, so that thao tác hàng loạt ở đúng chỗ tôi đang nhìn.
20. As a User CMS, I want tên dài bị cắt còn 1 dòng kèm tooltip `title`, so that các dòng giữ chiều cao đều và menu ⋯ không bị đẩy khỏi màn.
21. As a User CMS, I want bấm tên mở trang chi tiết mà không tải lại cả app, so that thao tác nhanh và không mất state.
22. As a User CMS trên màn nhỏ, I want các cột ít quan trọng ẩn theo thứ tự ưu tiên ở `sm`, so that tôi không phải cuộn ngang mới thấy thông tin chính.

### State dùng chung

23. As a User CMS, I want mọi widget/bảng có loading (skeleton), empty và error kèm nút thử lại, so that tôi luôn biết dữ liệu đang ở trạng thái nào.
24. As a User CMS, I want Order không có sản phẩm hiện empty state thay vì bảng trống, so that tôi hiểu đó là dữ liệu rỗng, không phải lỗi.
25. As a User CMS, I want email và mã vận đơn dài xuống dòng trong khung, so that tôi đọc được đủ mà không tràn card.
26. As a developer, I want màn `/design-system` hiển thị badge, bảng, các state, focus, light/dark, so that tôi kiểm pattern trước khi dùng.

### Archetype List (reference: Product list)

27. As a User CMS, I want tab bộ lọc đã lưu kèm số lượng (badge `soft`), so that tôi chuyển nhanh giữa các nhóm Product hay dùng.
28. As a User CMS, I want thanh lọc nằm trên một dòng, bộ lọc đang bật hiện thành chip bỏ được, so that tôi thấy và gỡ bộ lọc nhanh.
29. As a User CMS, I want ảnh nhỏ cạnh tên Product, có ảnh thay thế khi thiếu ảnh, so that tôi nhận ra Product bằng mắt.
30. As a User CMS, I want tab và bộ lọc phản ánh vào URL query, so that tôi chia sẻ hoặc quay lại đúng danh sách.
31. As a User CMS, I want list Order, Customer, Inventory, Promotion, User, Role theo cùng pattern, so that tôi học một lần dùng mọi nơi.

### Archetype Detail (reference: Order detail)

32. As a User CMS, I want header Order gồm link quay lại, mã, badge trạng thái và **một** nút hành động tiếp theo nổi bật, so that tôi biết việc cần làm ngay.
33. As a User CMS, I want nút tiếp theo đúng theo luồng trạng thái hợp lệ của Order, so that tôi không thể chuyển sai trạng thái.
34. As a User CMS, I want Huỷ nằm trong menu và phải xác nhận, so that tôi không huỷ nhầm.
35. As a User CMS, I want thanh tiến trình trạng thái đánh dấu bước hiện tại (`aria-current=step`), so that tôi thấy Order đang ở đâu trong luồng.
36. As a User CMS trên desktop, I want bố cục hai cột: sản phẩm + tổng tiền bên trái, sidebar dính gồm khách, giao hàng, thanh toán, lịch sử bên phải, so that tôi không phải cuộn qua lại.
37. As a User CMS, I want bảng sản phẩm của Order có SKU mono, giá căn phải, `tabular-nums`, so that tôi đối chiếu nhanh.
38. As a User CMS, I want Product detail và Customer detail theo cùng archetype sau khi Order detail được duyệt, so that các màn chi tiết nhất quán.

### Archetype Form (reference: Product editor)

39. As a User CMS sửa Product dài, I want section navigation, so that tôi nhảy nhanh tới phần cần sửa.
40. As a User CMS, I want khi submit lỗi thì có validation summary và focus vào lỗi đầu tiên, so that tôi sửa ngay mà không phải đi tìm.
41. As a User CMS, I want action bar dính (Lưu/Huỷ), so that tôi lưu được từ bất kỳ vị trí nào trong form.
42. As a User CMS, I want label, help text và lỗi đặt nhất quán, so that mọi form đọc giống nhau.
43. As a User CMS, I want Category, Promotion, Settings kế thừa archetype Form, so that trải nghiệm nhập liệu đồng nhất.

### Cây và ma trận

44. As a User CMS dùng bàn phím, I want sắp xếp Category bằng bàn phím/menu thay cho kéo-thả, so that tôi không bắt buộc phải dùng chuột.
45. As a User CMS, I want ma trận quyền có header và nhãn dính, điều hướng bằng phím mũi tên, so that tôi gán quyền cho Role không lạc hàng/cột.

### Dashboard

46. As a quản lý Store, I want câu tóm tắt ở header và hàng "Cần xử lý" ở đầu, so that tôi biết ngay việc cần xử lý hôm nay.
47. As a quản lý Store, I want bấm một ô hàng đợi để tới list đã lọc sẵn, so that tôi xử lý luôn.
48. As a quản lý Store, I want một KPI hero kèm chart (điểm cao nhất tô `primary`, có tóm tắt bằng chữ), so that tôi nắm xu hướng chính, kể cả khi dùng trình đọc màn hình.
49. As a quản lý Store, I want delta KPI phụ hiện bằng badge, so that tăng/giảm đọc được mà không cần dựa vào màu chữ.
50. As a User CMS với quyền hạn chế, I want chỉ thấy widget mình có quyền, so that dashboard không hiện lỗi 403.

### Cổng chất lượng

51. As a developer, I want screenshot Playwright ở 375/768/1280, light + dark, với fixture xấu nhất, so that thoái lui về giao diện bị phát hiện.
52. As a developer, I want axe đo tương phản và ARIA thật, so that các con số tính tay trong audit được xác nhận.
53. As a developer, I want performance budget theo baseline route chunk, so that hardening không làm app nặng thêm.
54. As a tech lead, I want các gate chạy ở chế độ báo cáo trước, chỉ chặn merge khi đã ổn định và có người phụ trách, so that CI không bị đỏ vô cớ.
55. As a developer, I want mỗi đề xuất motion trả lời đủ 5 câu hỏi của plan, so that animation chỉ thêm khi có giá trị.

## Implementation Decisions

- **Nguồn luật duy nhất là `DESIGN.md`.** Ticket nào cần đổi luật thì sửa `DESIGN.md` trong cùng PR. Skill thiết kế ngoài chỉ tư vấn/audit.
- **Sửa contract trước:** hai lỗi critical của audit hallmark (#1 chữ màu trạng thái, #2 badge `solid` warning/info) là lỗi trong chính `DESIGN.md`. Luật: màu trạng thái không dùng làm màu chữ; chữ trạng thái đi qua badge `subtle`/`soft`; `solid` chỉ cho `error`/`neutral`/`primary`.
- **Luật focus:** element tự viết dùng outline `primary` 2px, offset 2px, chỉ khi `focus-visible`; ring ≥ 3:1 so với nền. Không tự viết `role="tab"`: dùng `UTabs`, hoặc `<nav>` + `aria-current` nếu là link.
- **Primitive:** dùng Nuxt UI (`USelect`, `UInput`, `USlideover`, `UTabs`, `UTable`…). Chỉ viết wrapper khi đã chứng minh có khoảng trống.
- **Format:** mọi tiền/số/ngày đi qua shared module format (`formatMoney`, `formatNumber`, `formatDateTime`, composable `useFormat()`) theo locale app. Module đã xong (#44); các ticket sau chỉ dùng nó, không gọi `toLocaleString()` trần.
- **Layout shell (chốt lại 2026-11-09, thay bản tự viết ở #47):**
  - Dựng bằng các component `UDashboard*` có sẵn trong `@nuxt/ui`, theo cách ghép của template [nuxt-ui-templates/dashboard](https://github.com/nuxt-ui-templates/dashboard). Không copy file template (template là app Nuxt, repo này là Vue + Vite).
  - Khung: `UDashboardGroup` (`storage="local"`, `storageKey="cms.dashboard"`; bỏ key cũ `cms.sidebarCollapsed`, ghi vào mục Migration của PR) → `UDashboardSidebar` (`collapsible`, không `resizable`, độ rộng `px` 256/64 theo `DESIGN.md`, `mode="slideover"` mở từ trái dưới `lg`) → `UDashboardPanel` (navbar dính, `PageContainer` nằm trong slot body).
  - Sidebar: Store switcher ở đầu (vị trí giống chọn team của template), `SidebarNav` lấy dữ liệu từ `Navigation.ts` (lọc theo quyền), User menu ở chân.
  - Navbar (`UDashboardNavbar`): nút `UDashboardSidebarCollapse`/toggle + breadcrumb; bên phải là locale + theme (chỉ trên desktop) và User menu. Navbar không lặp tiêu đề trang; tiêu đề lớn vẫn nằm trong `PageHeader`.
  - Locale và theme có trong User menu. Padding trang `px-4 lg:px-6`.
  - `UDashboardToolbar` chưa dùng; ticket 07 quyết định thanh lọc nằm ở toolbar hay trong trang.
  - Trong `DESIGN.md`, chữ "drawer" đổi thành "slideover từ trái" để không nhầm với `drawer` (bottom sheet) của Nuxt UI.
- **Tái dùng template dashboard của Nuxt UI:** chỉ lấy cách ghép các component `U*`, dựng trên khung của repo (`Navigation.ts`, i18n, quyền, `HttpClient`, `shared/lib/format`) và theo `DESIGN.md`. Tránh tự viết lại component Nuxt UI đã có.

  | Nhóm | Template | Component Nuxt UI | Thay / áp vào | Ticket |
  | --- | --- | --- | --- | --- |
  | Lấy | `layouts/default.vue` | `UDashboardGroup`, `UDashboardSidebar`, `UNavigationMenu` | `DashboardLayout`, `AppSidebar`, `MobileNavDrawer` | 03 |
  | Lấy | `pages/*.vue` (khung) | `UDashboardPanel`, `UDashboardNavbar`, `UDashboardSidebarCollapse` | `AppHeader`, nút thu gọn tự viết | 03 |
  | Lấy | `TeamsMenu.vue` | `UDropdownMenu` ở đầu sidebar | `StoreSwitcher` chuyển lên đầu sidebar | 03 |
  | Lấy | `UserMenu.vue` | `UDropdownMenu` + color mode | Cách xếp nhóm của `UserMenu` | 03/04 |
  | Lấy | `pages/customers.vue` | `UTable` (`rowSelection`, `columnVisibility`, pagination), `UInput`, `USelect`, `UPagination` | `DataTablePagination`, `DataTableBulkActions`, `DataTableColumnVisibility`, các filter | 04, 05 |
  | Lấy | `settings.vue` | `UDashboardToolbar` + `UNavigationMenu` ngang | `PageTabs`, tab bộ lọc đã lưu | 07, 10 |
  | Lấy | `settings/index.vue`, `security.vue` | `UPageCard`, `UForm`, `UFormField` | `FormSection`, archetype Form | 06, 10 |
  | Có điều kiện | `layouts/default.vue` | `UDashboardSearch`, `UDashboardSearchButton`, `defineShortcuts` | Command palette từ `command` meta của `Navigation.ts` | 15 |
  | Có điều kiện | `home/HomeStats.vue` | `UPageGrid`, `UPageCard`, `UBadge` | KPI phụ (delta qua badge) | 12 |
  | Có điều kiện | `home/HomeChart.vue` | `UChart` | KPI hero chart: kiểm dependency + bundle trước | 12 |
  | Có điều kiện | `HomeDateRangePicker.vue` | `UPopover`, `UCalendar` | Có thể thay `FilterDateRange` | 05 |
  | Có điều kiện | `NotificationsSlideover.vue` | `USlideover`, `UChip` | Chỉ khi có API thông báo | — |
  | Không | trang home | — | Đã chốt Dashboard A (`mockup-decision.md`) | — |
  | Không | `inbox.vue`, `UDashboardResizeHandle` | — | CMS không có inbox; sidebar độ rộng cố định | — |
  | Không | `customers/AddModal.vue` | — | Form là trang riêng (archetype Form) | — |
  | Không | `server/api`, `date-fns`, auto-import | — | Đặc thù Nuxt; đã có `HttpClient`, `shared/lib/format` | — |

  **Giữ lại** (pattern riêng theo `DESIGN.md`, đã dựng trên `U*`): `PageHeader`, `EmptyState`/`ErrorState`/`LoadingState`, `StatusBadge`, `ActiveFilterTags`, `FilterBar`, `ConfirmDialog`.
- **Pattern bảng (`DataTable`):** compact `py-1.5`, `thead` dính, thanh hàng loạt thay vào tiêu đề bảng (bỏ khối `DataTableBulkActions` riêng), cột tên là router link + `line-clamp-1` + `title`, cột tiền căn phải, cuộn ngang trong khung. Thứ tự ưu tiên cột ở `sm` được ghi vào `DESIGN.md`.
- **Token:** `rounded-lg` (bỏ `rounded-xl`), khoảng cách dọc `space-y-4`/`space-y-6` (bỏ `space-y-5`).
- **State dùng chung:** `LoadingState`/skeleton, `EmptyState`, error có nút thử lại. Mọi widget dashboard và bảng đều có đủ ba state.
- **Archetype đã chốt (`mockup-decision.md`):**
  - Dashboard = phương án A + câu tóm tắt của B.
  - List = bảng dày + tab bộ lọc đã lưu.
  - Detail = hai cột (`lg:grid-cols-[1fr_22rem]`) + thanh tiến trình trạng thái.
  - Form = section nav + validation summary + action bar dính. Archetype này được bổ sung vào `DESIGN.md` mục Layout.
- **Rollout bằng reference:** Product list (List), Order detail (Detail), Product editor (Form), Dashboard. Reference phải được user duyệt rồi mới rollout sang màn khác.
- **Quyết định từ break-ui:** tên trong bảng cắt 1 dòng + `title`, hiện đủ ở Detail. Email ở Detail xuống dòng (`break-all`), không cắt.
- **Order detail:** nút tiếp theo lấy từ luồng trạng thái hợp lệ hiện có (`nextOrderStatuses`). Huỷ dùng confirm dùng chung (`useConfirm`).
- **Dashboard hàng đợi:** cần endpoint backend; nếu chưa có thì tạm đếm từ list API và ghi vào Gap. Không đổi API contract trong spec này.
- **Fixture xấu nhất:** tái dùng fixture của prototype (tên/email/địa chỉ dài, giá 15.500.000 ₫, thiếu ảnh, tồn 0) làm fixture test và fixture screenshot.
- **Phase 0 baseline:** inventory trang/component được đánh dấu `implemented`/`partial`/`missing`/`backlog`, và có `baseline.md` (route → chunk KB; danh sách lệch phân loại design-system gap / shared-pattern gap / feature gap). Đây là mốc cho performance budget.
- **Cổng chất lượng:** Playwright screenshot (Login, Dashboard, Product list, Product edit, Category tree, Order detail, Design system, App shell mobile) + `@axe-core/playwright` + performance budget. Ban đầu chỉ báo cáo.
- **Motion:** CSS/Vue transition trước; GSAP chỉ khi đã chứng minh cần. Ticket ở `needs-triage` cho tới khi có đề xuất cụ thể.

## Testing Decisions

- **Test hành vi bên ngoài, không test chi tiết cài đặt:** query theo role và accessible name, kiểm tra chuỗi người dùng thấy (tiền đã format, nhãn "Hết"), điều hướng router, focus. Không assert class Tailwind hay cấu trúc DOM nội bộ.
- **Seam (ưu tiên seam có sẵn, càng cao càng tốt):**
  1. **View qua `renderWithPlugins()`**: seam chính. Dựng app runtime thật (i18n, router, pinia, query) và chỉ override HTTP. Dùng cho Layout (drawer, focus trả về, đóng khi đổi route), DataTable (chọn dòng → thanh hàng loạt, link không reload), ProductListView (tab → query, chip, fixture xấu nhất giữ menu ⋯), OrderDetailView (nút tiếp theo, huỷ có xác nhận, bước hiện tại), ProductForm (validation summary focus lỗi đầu), DashboardView (widget theo quyền, hàng đợi → list đã lọc), Category tree (di chuyển bằng bàn phím).
  2. **Unit thuần cho shared module format**: bảng vi/en, 0, số âm, null (đã có từ #44).
  3. **Playwright** (Phase 6): screenshot + axe + budget. Đây là seam mới duy nhất, ở tầng cao nhất (app chạy thật trong trình duyệt). **Không cần backend:** network mock bằng `page.route()` trả fixture xấu nhất, đăng nhập bằng Mock auth. Seam này bắt những gì jsdom không thấy: tràn ở 375px, tương phản thật, light/dark, kích thước chunk.
- **Prior art:** `Layout.spec.ts`, `CmsRouting.spec.ts`, `DashboardView.spec.ts`, `ProductListView.spec.ts`, `LoginView.spec.ts`, `UseConfirm.spec.ts`, `Format.spec.ts`. Có screenshot Playwright của prototype ở #46.
- **Đổi control native sang Nuxt UI:** spec hiện có phải vẫn xanh; chỉ cập nhật selector sang role + name.
- **TDD:** red → green ở seam công khai cho từng ticket. Phần kiểm tay (375px, light/dark, `/design-system`) ghi trong ticket.

## Out of Scope

- Storefront và landing page.
- WebGL/3D, React Bits, Canvas UI, Scroll World.
- Đổi business flow hay API contract (endpoint hàng đợi dashboard chỉ ghi vào Gap).
- Màu brand chính thức. Palette rose + font hiện tại giữ tạm, chờ guideline.
- Nút chuyển mật độ bảng.
- Chế độ xem gallery cho Product list và bản in invoice cho Order (bị loại khỏi mặc định, có thể làm sau).
- Figma.
- E2E với backend/API thật (luồng nghiệp vụ đầu-cuối). Làm sau khi có API.

## Further Notes

- **Ticket:** `issues/01`–`15`. Ticket 03 mở lại để làm lại shell bằng `UDashboard*` (PR #47 chưa merge, làm trên cùng branch). Làm ticket nào hết bị chặn trước (dòng `Blocked by`). Ticket 02 (formatter) đã xong ở #44; phần nhãn "Hết" chuyển sang ticket 12.
- **Thứ tự phase:**
  - 0: baseline (01).
  - 2–3: nền tảng + pattern (02–06).
  - 4: archetype (07–11).
  - 5: Dashboard (12).
  - 6: gate (13).
  - 7: motion (14).
- Các tỉ lệ tương phản trong audit hallmark là tính tay theo màu mặc định của Nuxt UI. Phase 6 phải đo lại bằng axe.
- Audit break-ui suy luận từ code, chưa xem trên màn hình. Khi làm Phase 3–4 có thể thêm toggle `?data=worst` dùng fixture xấu nhất.
- Prototype chạy ở `/prototype/{dashboard,products,orders}?variant=A|B|C` (chỉ DEV) để đối chiếu khi làm reference.
