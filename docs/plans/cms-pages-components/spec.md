# Spec — Page & Component cho Fashion Store CMS

Status: ready-for-agent
Nguồn chuẩn chi tiết: [fashion-store-cms-pages-components.md](../fashion-store-cms-pages-components.md)

## Lưu ý bắt buộc

- **Không commit hoặc mở PR dưới tên Claude.** Không thêm `Co-Authored-By: Claude …`, không ghi "Generated with Claude Code". Commit theo Conventional Commits bằng git user của người làm.
- Chỉ commit hoặc push khi người phụ trách đồng ý.
- Mỗi plan con một nhánh, một PR vào `dev`, squash merge (QA/UAT/main tách riêng).
- Làm tuần tự theo `Blocked by`: xong một plan thì dừng, báo kết quả trong `report.md`, được xác nhận mới làm tiếp. Plan không phụ thuộc nhau có thể làm song song.

## Problem Statement

Scaffold (Foundation, Auth, khung Layout) đã xong nhưng CMS chưa có màn hình nghiệp vụ nào. Người vận hành cửa hàng thời trang chưa thể xem số liệu, quản lý sản phẩm, danh mục, đơn hàng, khách hàng, tồn kho, khuyến mãi, người dùng hay cấu hình cửa hàng. Danh mục page/component đã có nhưng dài, trải qua 8 Phase, khó làm và review trong một lần.

## Solution

Chia danh mục thành 14 plan con trong `docs/plans/cms-pages-components/NN-<slug>/`, theo thứ tự Phase của FE_architecture §30 (có một chỗ lệch: Categories làm trước Product form vì form cần `CategorySelector`). Hai plan nền (03 List & Table, 04 Form & Media) tạo shared component một lần để mọi list page chỉ cần ráp `PageHeader + FilterBar + DataTable + DataTablePagination` + composable của feature.

Mỗi folder gồm:

| File        | Vai trò                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| `spec.md`   | Mục tiêu, phạm vi, tiêu chí hoàn thành, phụ thuộc.                         |
| `plan.md`   | Việc cần làm, output, mục kiểm tra. Có `Status:` và `Blocked by:` ở đầu.   |
| `report.md` | Kết quả sau khi làm: đã làm, kết quả kiểm tra, lệch so với plan, việc tồn. |

Số liệu (token, test, coverage, bundle) ghi chung trong [metrics.md](./metrics.md). Giá trị `Status`: `ready-for-agent` → `in-progress` → `done`.

## User Stories

Actor: **Master Store Manager** (toàn quyền nhiều Store), **Store Manager** (quản lý một Store), **Order Staff** (xử lý đơn), **Dev** (người xây CMS).

1. As a Store Manager, I want a breadcrumb on every page, so that I know where I am and can go back one level.
2. As a Store Manager, I want to switch between Vietnamese and English without losing my current page, so that I can work in my preferred language.
3. As a Store Manager, I want light/dark/system theme, so that the CMS is comfortable to use all day.
4. As any user, I want the sidebar to show only menus I have permission for, so that I am not confused by pages I cannot open.
5. As a Store Manager, I want a dashboard with revenue, orders, customers and products stats, so that I see business health at a glance.
6. As a Store Manager, I want revenue and order charts, so that I can spot trends.
7. As an Order Staff, I want recent orders on the dashboard, so that I can jump into new work quickly.
8. As a Store Manager, I want top products and low-stock lists, so that I know what to restock.
9. As an Order Staff without inventory permission, I want inventory widgets hidden, so that the dashboard only shows what I can act on.
10. As any user, I want one failing widget not to break the whole dashboard, so that I still see the rest.
11. As a Store Manager, I want to search products by name, so that I find items fast.
12. As a Store Manager, I want to filter products by category, status and price, so that I can narrow large catalogs.
13. As a Store Manager, I want to sort and paginate products, so that I can browse in a useful order.
14. As a Store Manager, I want list filters kept in the URL, so that I can share a link or use back/forward and see the same list.
15. As a Store Manager, I want to show/hide table columns and have that remembered, so that the table fits my work.
16. As a Store Manager, I want to select many products and publish, unpublish or delete them at once, so that I save time.
17. As a Store Manager, I want a confirmation before deleting, so that I do not lose data by mistake.
18. As a Store Manager, I want to create a product with basic info, pricing, categories, images, variants and SEO, so that it is ready to sell.
19. As a Store Manager, I want to generate Size × Color variants each with its own SKU, price and stock, so that I can sell fashion items correctly.
20. As a Store Manager, I want to save a product as draft, so that I can finish it later.
21. As a Store Manager, I want to upload, reorder, delete and choose the main image, so that the product looks right in the store.
22. As a Store Manager, I want clear errors for wrong image type or size, so that I know how to fix the upload.
23. As a Store Manager, I want server validation errors shown next to the right field, so that I can fix them quickly.
24. As a Store Manager, I want a warning when leaving a form with unsaved changes, so that I do not lose work.
25. As a Store Manager, I want to view a product detail page, so that I can review it without editing.
26. As a Store Manager, I want a category tree, so that I see the catalog structure.
27. As a Store Manager, I want to move categories by drag and drop, so that I can reorganize quickly.
28. As a Store Manager, I want to create/edit categories with SEO and localized names, so that the storefront is correct in every language.
29. As a Store Manager, I want to pick categories inside the product form, so that I do not leave the form.
30. As an Order Staff, I want to filter orders by date range, status, payment status, customer and amount, so that I find the orders I need.
31. As an Order Staff, I want to see active filters as chips and clear them all, so that I understand and reset the list.
32. As an Order Staff, I want an order detail with customer, shipping, payment, items, summary and timeline, so that I can handle the order fully.
33. As an Order Staff, I want to change order status only to valid next states, so that I do not break the order flow.
34. As an Order Staff, I want to cancel an order with confirmation, so that cancellations are intentional.
35. As a user without `order:write`, I want status actions hidden, so that I only see what I can do.
36. As a Store Manager, I want a customer list with search and filters, so that I find customers.
37. As a Store Manager, I want customer detail tabs (Profile, Addresses, Orders, Activity) kept in the URL, so that reload or shared links open the same tab.
38. As a Store Manager, I want to see a customer's orders, so that I understand their history.
39. As a Store Manager, I want stock per variant (current, reserved, available, status), so that I know what can be sold.
40. As a Store Manager, I want to adjust stock with a required reason, so that changes are traceable.
41. As a Store Manager, I want a stock movement history filterable by date and type, so that I can audit changes.
42. As a Store Manager, I want to create coupon or automatic promotions with discount, minimum order, usage limit and time window, so that I can run campaigns.
43. As a Store Manager, I want invalid promotion input (missing code, end before start, >100%) rejected, so that campaigns are correct.
44. As a Master Store Manager, I want to create users and assign roles and Stores, so that staff get the right access.
45. As a Master Store Manager, I want to edit role permissions in a resource × action matrix, so that access rules are clear.
46. As a Master Store Manager, I want the permission list to come from the backend, so that new permissions appear without a FE release.
47. As a Store Manager, I want to edit store info (name, logo, contact, address), so that the storefront shows correct info.
48. As a Store Manager, I want to configure languages, timezone, currency and formats, so that the store fits its market.
49. As any user, I want loading skeletons, empty and error states on every page, so that I always know what is happening.
50. As a Dev, I want a ready list foundation (`useListState`, `DataTable`, filters), so that a new list page is just assembly.
51. As a Dev, I want shared components free of business logic, so that they stay reusable.
52. As a Dev, I want features to expose public interfaces (`CategorySelector`, `useOrdersQuery`, `useMedia`), so that cross-feature use does not reach into internals.
53. As a Dev, I want each plan to have spec, plan, report and metrics, so that progress and cost are traceable.

## Implementation Decisions

- Stack giữ nguyên: Vite + Vue 3 + vue-router + `@nuxt/ui` (chỉ thư viện component, không file-based routing, không auto-import).
- Mỗi feature là một module sâu trong `features/<x>/`: `<X>.routes.ts`, `api/`, composable query, `views/*View.vue`, `components/`. Interface công khai tối thiểu: routes + vài composable/component được dùng chéo (`CategorySelector`, `useOrdersQuery`, `useMedia`).
- Component không gọi HTTP; View → composable của feature → props.
- `useListState(schema)` là nguồn duy nhất của state list (URL ↔ params, Zod, reset page, debounce). `DataTable` bọc `UTable` ở chế độ manual (server-side); không dùng `useVueTable` riêng.
- Map status → màu nằm ở feature; `StatusBadge` chỉ nhận `color` + `label`.
- Permission theo `<resource>:<action>`, kiểm bằng `useAuth().can()`, khai báo ở route meta; danh sách permission lấy từ BE.
- SKU thuộc Variant; sản phẩm không biến thể có 1 variant mặc định. Coupon là một loại Promotion.
- Shared component chỉ tạo khi có nơi dùng thứ hai (D33). Không tạo `DeleteDialog` (dùng `useConfirm()` preset danger) và `FormGrid` (dùng Tailwind).
- Package K.2 chỉ cài ở plan dùng tới: `echarts`/`vue-echarts` (02), `vee-validate`/`@vee-validate/zod` (04), `@tiptap/*` + `dompurify` (07), `dayjs` (03), `@internationalized/date` (khi cần).
- Lệch Phase: plan 06 Categories trước plan 07 Product form.

## Testing Decisions

- Test hành vi bên ngoài, không test chi tiết cài đặt: render View/Component, thao tác như người dùng, kiểm output trên DOM và URL; không kiểm state nội bộ hay gọi hàm private.
- **Seam chính (cao nhất): View được render qua `@test/Render` với router + Pinia + Vue Query thật, HTTP giả bằng `axios-mock-adapter`.** Một test View phủ cả composable, component con và permission. Không thêm seam mới.
- Seam phụ cho logic thuần: `useListState`, schema Zod, hàm map status/variant — unit test trực tiếp.
- E2E (Playwright) cho luồng chính mỗi feature: list → filter → detail → sửa/lưu, chạy với dev mock auth.
- Prior art: `features/auth/views/LoginView.spec.ts`, `ForgotPasswordView.spec.ts`, `UseAuth.spec.ts`, `Login.schema.spec.ts`, `app/router/Guards.spec.ts`, factories trong `src/test/factories`.
- Mỗi plan: `typecheck`, `lint`, `test` pass; coverage không giảm so với `dev`.

## Quy trình thực hiện mỗi plan

1. Kiểm tra mọi plan trong `Blocked by` đã `Status: done`.
2. Tạo nhánh từ `dev`, ví dụ `feat/<slug>`.
3. Đổi `Status:` trong `plan.md` và `spec.md` thành `in-progress`.
4. Làm theo mục **Làm gì** trong `plan.md`.
5. Chạy hết mục **Kiểm tra**, ghi kết quả vào `report.md`.
6. Ghi token và số liệu chất lượng vào [metrics.md](./metrics.md).
7. Commit theo Conventional Commits, tuân thủ [Lưu ý bắt buộc](#lưu-ý-bắt-buộc).
8. Mở PR vào `dev`, squash merge sau khi được duyệt; đổi `Status:` thành `done`.

## Danh sách plan con

| #   | Plan                                                                   | Phase | Blocked by |
| --- | ---------------------------------------------------------------------- | ----- | ---------- |
| 01  | [Hoàn thiện Layout](./01-layout-completion/plan.md)                    | P3    | —          |
| 02  | [Dashboard](./02-dashboard/plan.md)                                    | P4    | 01         |
| 03  | [Nền tảng List & Table](./03-list-table-foundation/plan.md)            | P5    | 01         |
| 04  | [Nền tảng Form & Media](./04-form-media-foundation/plan.md)            | P5    | 01         |
| 05  | [Products — List](./05-products-list/plan.md)                          | P5    | 03         |
| 06  | [Categories](./06-categories/plan.md)                                  | P6    | 03, 04     |
| 07  | [Products — Create / Edit / Detail](./07-products-form-detail/plan.md) | P5    | 04, 05, 06 |
| 08  | [Orders](./08-orders/plan.md)                                          | P7    | 03         |
| 09  | [Customers](./09-customers/plan.md)                                    | P8    | 08         |
| 10  | [Inventory](./10-inventory/plan.md)                                    | P9    | 08         |
| 11  | [Promotions](./11-promotions/plan.md)                                  | P10   | 03, 04     |
| 12  | [Users & Roles](./12-users-roles/plan.md)                              | P10   | 03, 04     |
| 13  | [Settings](./13-settings/plan.md)                                      | P10   | 04         |
| 14  | [Đối chiếu và chốt](./14-reconcile-finalize/plan.md)                   | —     | 01–13      |

## Out of Scope

- Backlog §5 của nguồn: Content (Banners, Content Page, Blog, `RichTextEditor` dùng chung), Settings payment/shipping/email, `AppNotifications`, `ActivityTimeline`/audit log, page builder, media library, translation manager, bulk import/export.
- `ResetPasswordView` và phần auth backlog.
- Thay đổi API backend; FE chỉ dùng type sinh từ Swagger.

## Further Notes

- Plan 06 cần BE xác nhận format localized data trước khi làm phần localization.
- Nếu API của một feature chưa có, dùng dev mock tương tự mock auth và ghi vào "Việc còn tồn" của report.
- Khi plan 14 xong, chuyển folder này vào `docs/archive/`.
